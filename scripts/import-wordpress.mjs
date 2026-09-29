#!/usr/bin/env node
// Importa el contenido de selectaescritura.com (WordPress) a los Markdown de /content.
//
//   npm run import:wp            # falla si ya hay contenido, para no pisar cambios
//   npm run import:wp -- --force # borra content/pages y content/teachers y reimporta
//
// - Entradas de la categoría "profesorado"  → content/teachers/<slug>.md
// - Resto de entradas y páginas             → content/pages/<slug>.md
// - Categorías (Talleres, Eventos…)         → páginas de listado generadas a partir de sus entradas
// - Imágenes                                → public/uploads/, con los enlaces reescritos
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import TurndownService from 'turndown'
import { stringify } from 'yaml'

const SITE = 'https://selectaescritura.com'
const API = `${SITE}/wp-json/wp/v2`
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGES_DIR = path.join(ROOT, 'content/pages')
const TEACHERS_DIR = path.join(ROOT, 'content/teachers')
const UPLOADS_DIR = path.join(ROOT, 'public/uploads')

// ---------- Configuración de la estructura (no de contenido) ----------

const TEACHER_CATEGORY = 'profesorado'
const TEACHER_GROUPS = { claustro: 'claustro', 'estrellas-invitadas-profesores': 'invitadas' }
const COURSE_CATEGORIES = ['talleres', 'talleres-online', 'estrellas-invitadas', 'talleres-experiencias']
// Páginas de WordPress que no se migran (tienda, portada de Elementor…).
const SKIP_PAGES = ['inicio', 'carrito', 'finalizar-compra', 'resumen-de-compra', 'tienda-talleres']
const PAGE_LAYOUTS = { contacto: 'contact', 'mapa-sitio': 'sitemap' }
// Datos que en WordPress aparecen como «Etiqueta: valor» al principio de cada curso.
const FACT_LABELS = /^(duración|modalidad|horarios?|hora|precio|cuándo|fechas?|matrícula|lugar|dónde|inicio|sesiones)$/i

// Páginas de archivo de categoría del WordPress original.
const ARCHIVES = [
  { file: 'talleres', category: 'talleres', kicker: 'Todos nuestros' },
  { file: 'talleres-online', category: 'talleres-online', kicker: 'Todos nuestros' },
  { file: 'estrellas-invitadas', category: 'estrellas-invitadas', kicker: 'Todas nuestras' },
  { file: 'eventos', category: 'eventos', kicker: 'Todos nuestros' },
  { file: 'exposiciones', category: 'exposiciones', kicker: 'Todas nuestras' },
  { file: 'servicios', category: 'servicios', kicker: 'Todos nuestros' },
  // En WordPress es una página vacía; aquí se muestra como listado de su categoría.
  { file: 'taller-de-experiencias-2', category: 'talleres-experiencias', title: 'Taller de experiencias' },
  { file: 'eventos-viernes-de-selecta', category: 'viernes-de-selecta', kicker: 'Todas nuestras', path: '/eventos/viernes-de-selecta' },
  { file: 'profesorado', category: 'profesorado', kicker: 'Todo nuestro', layout: 'team', groups: ['claustro', 'invitadas'] },
  { file: 'profesorado-claustro', category: 'claustro', kicker: 'Todo nuestro', layout: 'team', groups: ['claustro'], path: '/profesorado/claustro' },
  {
    file: 'profesorado-estrellas-invitadas',
    category: 'estrellas-invitadas-profesores',
    kicker: 'Todas nuestras',
    layout: 'team',
    groups: ['invitadas'],
    path: '/profesorado/estrellas-invitadas-profesores',
  },
]

// ---------- Utilidades ----------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// El servidor devuelve "Database Error" si se le satura: peticiones en serie y con reintentos.
async function request(url, attempt = 1) {
  await sleep(250)
  const res = await fetch(url)
  if (res.ok) return res
  if (attempt < 4) return request(url, attempt + 1)
  throw new Error(`${res.status} ${url}`)
}

const getJson = async (url) => (await request(url)).json()

async function getAll(type) {
  const items = []
  for (let page = 1; ; page++) {
    const res = await request(`${API}/${type}?per_page=100&page=${page}&_embed=wp:featuredmedia`)
    items.push(...(await res.json()))
    if (page >= Number(res.headers.get('x-wp-totalpages') ?? 1)) return items
  }
}

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', laquo: '«', raquo: '»', ndash: '–', mdash: '—' }
const decode = (text = '') =>
  text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&(\w+);/g, (m, name) => entities[name] ?? m)

// Emojis decorativos del WordPress original que no se quieren en la web nueva.
const removeEmojis = (text) => text.replace(/[ \t]*✍\uFE0F?[ \t]*/g, ' ')

// Las etiquetas en línea (<strong>, <a>…) se quitan sin más; las de bloque, por un espacio.
const stripTags = (html = '') =>
  removeEmojis(decode(html.replace(/<\/?(?:strong|b|em|i|a|span)\b[^>]*>/gi, '').replace(/<[^>]+>/g, ' ')))
    .replace(/\s+/g, ' ')
    .trim()

// Enlaces al propio WordPress → rutas locales (/talleres/ → /talleres).
const localizeLinks = (md) =>
  md.replace(/\]\(https?:\/\/(?:www\.)?selectaescritura\.com(\/[^)\s]*)?\)/g, (m, p = '/') =>
    p.includes('/wp-content/') ? m : `](${p.replace(/\/+$/, '') || '/'})`,
  )

// ---------- Imágenes ----------

const downloaded = new Map()

async function downloadImage(url) {
  if (!url?.includes('/wp-content/uploads/')) return url
  const clean = url.split('?')[0].replace(/^http:/, 'https:')
  if (downloaded.has(clean)) return downloaded.get(clean)
  const name = clean.split('/wp-content/uploads/')[1].replace(/\//g, '-')
  const localPath = `/uploads/${name}`
  const file = path.join(UPLOADS_DIR, name)
  try {
    await fs.access(file)
  } catch {
    const res = await request(clean)
    await fs.writeFile(file, Buffer.from(await res.arrayBuffer()))
  }
  downloaded.set(clean, localPath)
  return localPath
}

async function localizeImages(md) {
  const urls = [...md.matchAll(/https?:\/\/(?:www\.)?selectaescritura\.com\/wp-content\/uploads\/[^)\s"]+/g)].map((m) => m[0])
  for (const url of new Set(urls)) md = md.replaceAll(url, await downloadImage(url))
  return md
}

const featuredImage = (item) => item._embedded?.['wp:featuredmedia']?.[0]?.source_url

// ---------- HTML → Markdown ----------

const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '*' })
turndown.remove(['script', 'style', 'noscript', 'svg', 'form', 'button', 'iframe'])
// Enlaces sin texto (iconos, imágenes envueltas en enlaces vacíos…) no aportan nada.
turndown.addRule('emptyLinks', {
  filter: (node) => node.nodeName === 'A' && !node.textContent.trim() && !node.querySelector('img'),
  replacement: () => '',
})

async function toMarkdown(html, title) {
  let md = removeEmojis(turndown.turndown(html ?? ''))
  md = localizeLinks(md)
  md = await localizeImages(md)
  // WordPress repite el título (a veces ampliado, p. ej. con el segundo apellido) como primer encabezado.
  const lines = md.split('\n')
  const first = lines.findIndex((line) => line.trim())
  const heading = first >= 0 && /^#+\s/.test(lines[first]) ? stripTags(lines[first].replace(/^#+\s*/, '')).toLowerCase() : null
  if (heading && (heading.startsWith(title.toLowerCase()) || title.toLowerCase().startsWith(heading))) lines.splice(first, 1)
  return lines
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/^-\s{2,}/gm, '- ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Saca las líneas «Etiqueta: valor» anteriores a la primera sección (##) para la ficha del curso.
function extractFacts(md) {
  const lines = md.split('\n')
  const end = lines.findIndex((line) => /^##\s/.test(line))
  const facts = []
  const keep = lines.filter((line, i) => {
    if (end >= 0 && i >= end) return true
    const match = line.replace(/\*\*/g, '').match(/^(?:-\s+)?([^:]{3,25}?)\s*:\s*(.+)$/)
    if (!match || !FACT_LABELS.test(match[1].trim())) return true
    facts.push({ label: match[1].trim(), value: match[2].trim() })
    return false
  })
  return { facts, body: keep.join('\n').replace(/\n{3,}/g, '\n\n').trim() }
}

// ---------- Escritura ----------

async function writeMarkdown(dir, slug, data, body = '') {
  const frontmatter = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && !v.length)),
  )
  const content = `---\n${stringify(frontmatter, { lineWidth: 0 })}---\n${body ? `${body}\n` : ''}`
  await fs.writeFile(path.join(dir, `${slug}.md`), content)
}

async function prepareDirs(force) {
  for (const dir of [PAGES_DIR, TEACHERS_DIR]) {
    await fs.mkdir(dir, { recursive: true })
    const existing = (await fs.readdir(dir)).filter((f) => f.endsWith('.md'))
    if (existing.length && !force) {
      throw new Error(`${path.relative(ROOT, dir)} ya tiene ${existing.length} archivos. Usa --force para reemplazarlos.`)
    }
    for (const file of existing) await fs.unlink(path.join(dir, file))
  }
  await fs.mkdir(UPLOADS_DIR, { recursive: true })
}

// ---------- Importación ----------

async function main() {
  await prepareDirs(process.argv.includes('--force'))

  console.log('Descargando categorías, entradas y páginas…')
  const categories = await getJson(`${API}/categories?per_page=100`)
  const categorySlug = new Map(categories.map((c) => [c.id, c.slug]))
  const posts = await getAll('posts')
  const pages = await getAll('pages')
  const slugsOf = (item) => item.categories.map((id) => categorySlug.get(id))
  // Algunas fichas solo están en «claustro» o en «estrellas-invitadas-profesores», sin «profesorado».
  const isTeacher = (item) => slugsOf(item).some((c) => c === TEACHER_CATEGORY || c in TEACHER_GROUPS)

  let teacherCount = 0
  let pageCount = 0
  // La web original muestra el profesorado del más antiguo al más reciente (la API los da al revés).
  const teacherPosts = posts.filter(isTeacher)
  const teacherOrder = new Map(teacherPosts.reverse().map((p, i) => [p.slug, i + 1]))

  for (const post of posts) {
    const title = decode(post.title.rendered)
    const cats = slugsOf(post)
    const image = featuredImage(post) && (await downloadImage(featuredImage(post)))
    const body = await toMarkdown(post.content.rendered, title)

    if (isTeacher(post)) {
      const groups = cats.map((c) => TEACHER_GROUPS[c]).filter(Boolean)
      await writeMarkdown(TEACHERS_DIR, post.slug, { name: title, photo: image, groups, order: teacherOrder.get(post.slug) }, body)
      teacherCount++
      continue
    }

    const isCourse = cats.some((c) => COURSE_CATEGORIES.includes(c))
    const { facts, body: rest } = isCourse ? extractFacts(body) : { facts: [], body }
    await writeMarkdown(
      PAGES_DIR,
      post.slug,
      {
        title,
        layout: isCourse ? 'course' : 'page',
        kicker: isCourse ? 'Taller' : undefined,
        summary: stripTags(post.excerpt.rendered),
        image,
        facts,
      },
      rest,
    )
    pageCount++
    console.log(`  ✓ ${post.slug}`)
  }

  for (const page of pages) {
    if (SKIP_PAGES.includes(page.slug)) continue
    const title = decode(page.title.rendered)
    const layout = PAGE_LAYOUTS[page.slug] ?? 'page'
    const image = featuredImage(page) && (await downloadImage(featuredImage(page)))
    const body = layout === 'sitemap' ? '' : await toMarkdown(page.content.rendered, title)
    await writeMarkdown(PAGES_DIR, page.slug, { title, layout, summary: stripTags(page.excerpt.rendered), image }, body)
    pageCount++
    console.log(`  ✓ ${page.slug}`)
  }

  // Listados: cada categoría enlaza a sus entradas, en el mismo orden que WordPress (más recientes primero).
  for (const archive of ARCHIVES) {
    const category = categories.find((c) => c.slug === archive.category)
    if (!category) {
      console.warn(`  ! categoría no encontrada: ${archive.category}`)
      continue
    }
    const layout = archive.layout ?? 'listing'
    const items = layout === 'listing' ? posts.filter((p) => p.categories.includes(category.id)).map((p) => p.slug) : undefined
    await writeMarkdown(
      PAGES_DIR,
      archive.file,
      {
        title: archive.title ?? decode(category.name),
        kicker: archive.kicker,
        layout,
        path: archive.path,
        summary: stripTags(category.description),
        items,
        groups: archive.groups,
      },
      stripTags(category.description),
    )
    pageCount++
    console.log(`  ✓ ${archive.file} (listado)`)
  }

  console.log(`\nListo: ${pageCount} páginas, ${teacherCount} profesores, ${downloaded.size} imágenes.`)
}

main().catch((error) => {
  console.error(`\n✗ ${error.message}`)
  process.exit(1)
})
