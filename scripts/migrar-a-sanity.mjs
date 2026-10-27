// Pasa el contenido de /content (Markdown y YAML) y sus imágenes a Sanity, tal cual, sin tocar los textos.
//
//   npm run migrar:sanity            # se niega si Sanity ya tiene páginas
//   npm run migrar:sanity -- --force # sobrescribe lo que haya (también lo editado en el Studio)
//   npm run migrar:sanity -- --dry   # solo convierte y muestra un resumen, sin subir nada
//
// Necesita en .env.local un token con permisos de escritura: SANITY_WRITE_TOKEN=…
import { createReadStream, existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'
import { createClient } from '@sanity/client'
import { htmlToBlocks, randomKey } from '@portabletext/block-tools'
import { Schema } from '@sanity/schema'
import { JSDOM } from 'jsdom'
import { marked } from 'marked'
import { parse } from 'yaml'
import blockContent from '../studio/schemaTypes/blockContent.js'

const ROOT = new URL('..', import.meta.url).pathname
const force = process.argv.includes('--force')
const dry = process.argv.includes('--dry')

const projectId = process.env.VITE_SANITY_PROJECT_ID
if (!dry && (!projectId || projectId === 'pendiente' || !process.env.SANITY_WRITE_TOKEN)) {
  console.error('Faltan VITE_SANITY_PROJECT_ID (en .env) o SANITY_WRITE_TOKEN (en .env.local).')
  process.exit(1)
}

const client = createClient({
  projectId: dry ? 'dry' : projectId,
  dataset: process.env.VITE_SANITY_DATASET,
  apiVersion: '2026-10-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

// Fuera del Studio no existen los tipos internos de imagen, así que para convertir basta un objeto con el mismo nombre.
const blockContentType = Schema.compile({
  name: 'default',
  types: [{ ...blockContent, of: [blockContent.of[0], { type: 'object', name: 'image', fields: [{ name: 'alt', type: 'string' }] }] }],
}).get('blockContent')

// --- Lectura de /content -----------------------------------------------------

function readMarkdownDir(dir) {
  return readdirSync(join(ROOT, dir))
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = readFileSync(join(ROOT, dir, file), 'utf8')
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
      const data = match ? (parse(match[1]) ?? {}) : {}
      return { ...data, slug: basename(file, '.md'), body: (match ? match[2] : raw).trim() }
    })
}

const readYaml = (file) => parse(readFileSync(join(ROOT, file), 'utf8'))

// Las referencias pueden guardarse como «slug», «slug.md» o «content/pages/slug.md» según el CMS.
const toSlug = (ref) => String(ref).split('/').pop().replace(/\.md$/, '')

// --- Imágenes ----------------------------------------------------------------

const uploaded = new Map()

async function uploadImage(src) {
  if (!src) return null
  if (uploaded.has(src)) return uploaded.get(src)
  const file = join(ROOT, 'public', decodeURIComponent(src))
  if (!src.startsWith('/') || !existsSync(file)) {
    console.warn(`  ! Imagen no encontrada, se omite: ${src}`)
    uploaded.set(src, null)
    return null
  }
  const id = dry ? `image-dry-${uploaded.size}` : (await client.assets.upload('image', createReadStream(file), { filename: basename(file) }))._id
  uploaded.set(src, id)
  return id
}

const imageField = (assetId) => assetId && { _type: 'image', asset: { _type: 'reference', _ref: assetId } }

// --- Markdown → bloques del editor -------------------------------------------

async function toBlocks(markdown) {
  if (!markdown) return undefined
  // Primero se suben las imágenes del texto, porque la conversión es síncrona.
  for (const [, src] of markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) await uploadImage(src)

  // El título de la página ya es el h1; los «# …» del texto pasan al nivel «Título» del editor.
  const html = marked.parse(markdown.replace(/^# /gm, '## '))
  const blocks = htmlToBlocks(html, blockContentType, {
    parseHtml: (input) => new JSDOM(input).window.document,
    rules: [
      {
        deserialize(el, next, block) {
          if (el.tagName !== 'IMG') return undefined
          const assetId = uploaded.get(el.getAttribute('src'))
          return assetId ? block({ ...imageField(assetId), alt: el.getAttribute('alt') || undefined }) : undefined
        },
      },
    ],
  })
  return blocks.map((b) => ({ _key: b._key ?? randomKey(12), ...b }))
}

const withKeys = (items, type) => items?.map((item) => ({ _key: randomKey(12), _type: type, ...item }))
const refs = (slugs, prefix, existing) =>
  slugs
    ?.map(toSlug)
    .filter((slug) => existing.has(slug) || console.warn(`  ! Referencia a «${slug}» que no existe, se omite`))
    .map((slug) => ({ _key: randomKey(12), _type: 'reference', _ref: `${prefix}-${slug}` }))

function menuItems(items, level = 1) {
  return items?.map(({ children, ...item }) => ({
    _key: randomKey(12),
    _type: `menuItem${level}`,
    ...item,
    ...(children && { children: menuItems(children, level + 1) }),
  }))
}

// --- Documentos ----------------------------------------------------------------

async function buildDocuments() {
  const pages = readMarkdownDir('content/pages')
  const teachers = readMarkdownDir('content/teachers')
  const pageSlugs = new Set(pages.map((p) => p.slug))
  const teacherSlugs = new Set(teachers.map((t) => t.slug))
  const docs = []

  for (const t of teachers) {
    console.log(`Profesorado: ${t.name}`)
    docs.push({
      _id: `teacher-${t.slug}`,
      _type: 'teacher',
      name: t.name,
      slug: { _type: 'slug', current: t.slug },
      photo: imageField(await uploadImage(t.photo)),
      groups: t.groups,
      order: t.order,
      body: await toBlocks(t.body),
    })
  }

  for (const p of pages) {
    console.log(`Página: ${p.title}`)
    const gallery = []
    for (const src of p.gallery ?? []) {
      const assetId = await uploadImage(src)
      if (assetId) gallery.push({ _key: randomKey(12), ...imageField(assetId) })
    }
    docs.push({
      _id: `page-${p.slug}`,
      _type: 'page',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      layout: p.layout,
      kicker: p.kicker,
      path: p.path,
      summary: p.summary,
      image: imageField(await uploadImage(p.image)),
      body: await toBlocks(p.body),
      signup: p.signup,
      status: p.status,
      finished: p.finished,
      facts: withKeys(p.facts, 'fact'),
      teachers: refs(p.teachers, 'teacher', teacherSlugs),
      items: refs(p.items, 'page', pageSlugs),
      groups: p.groups,
      gallery: gallery.length ? gallery : undefined,
    })
  }

  const site = readYaml('content/settings/site.yml')
  docs.push({ _id: 'siteSettings', _type: 'siteSettings', ...site, legalLinks: withKeys(site.legalLinks, 'link') })

  const home = readYaml('content/settings/home.yml')
  const discover = []
  for (const { image, ...book } of home.discover ?? []) {
    discover.push({ _key: randomKey(12), _type: 'book', ...book, image: imageField(await uploadImage(image)) })
  }
  docs.push({ _id: 'home', _type: 'home', intro: home.intro, discover, callouts: withKeys(home.callouts, 'callout') })

  docs.push({ _id: 'menu', _type: 'menu', items: menuItems(readYaml('content/settings/menu.yml').items) })

  // Sanity no guarda campos vacíos: se quitan para no dejar `null` en los documentos.
  return JSON.parse(JSON.stringify(docs, (_, value) => (value === null ? undefined : value)))
}

// --- Subida --------------------------------------------------------------------

if (!dry) {
  const existing = await client.fetch('count(*[_type == "page"])')
  if (existing && !force) {
    console.error(`Sanity ya tiene ${existing} páginas. Usa --force para sobrescribirlas (se pierde lo editado en el Studio).`)
    process.exit(1)
  }
}

const docs = await buildDocuments()

if (dry) {
  const sample = docs.find((d) => d._id === 'page-quienes-somos')
  console.log(JSON.stringify(sample?.body?.slice(0, 3), null, 2))
  console.log(`\n${docs.length} documentos y ${uploaded.size} imágenes listos (sin subir).`)
} else {
  const tx = client.transaction()
  for (const doc of docs) tx.createOrReplace(doc)
  await tx.commit()
  console.log(`\nHecho: ${docs.length} documentos y ${uploaded.size} imágenes en Sanity.`)
}
