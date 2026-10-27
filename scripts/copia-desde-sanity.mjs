// Copia de seguridad: descarga de Sanity el contenido publicado y lo escribe en /content
// con el mismo formato de antes (Markdown con frontmatter y YAML), más las imágenes en public/uploads.
// Así los textos se pueden leer y llevar a otro CMS aunque Sanity deje de funcionar,
// y scripts/migrar-a-sanity.mjs puede volver a subirlos.
//
//   npm run copia:sanity
//
// Lo lanza cada noche .github/workflows/copia-contenido.yml.
import { existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import { createClient } from '@sanity/client'
import { stringify } from 'yaml'

const ROOT = new URL('..', import.meta.url).pathname
const UPLOADS = join(ROOT, 'public/uploads')

// El dataset es público: sin token solo se leen los documentos publicados, no los borradores.
const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  apiVersion: '2026-10-01',
  useCdn: false,
})

const ASSET = '{ "id": _id, originalFilename, url, size }'
const BODY = `body[]{ ..., _type == "image" => { alt, "asset": asset->${ASSET} } }`

const data = await client.fetch(`{
  "site": *[_id == "siteSettings"][0],
  "home": *[_id == "home"][0]{ intro, callouts, discover[]{ label, href, image{ "asset": asset->${ASSET} } } },
  "menu": *[_id == "menu"][0].items,
  "pages": *[_type == "page"] | order(slug.current){
    ...,
    "slug": slug.current,
    image{ "asset": asset->${ASSET} },
    gallery[]{ "asset": asset->${ASSET} },
    "teachers": teachers[]->slug.current,
    "items": items[]->slug.current,
    ${BODY}
  },
  "teachers": *[_type == "teacher"] | order(slug.current){ ..., "slug": slug.current, photo{ "asset": asset->${ASSET} }, ${BODY} }
}`)

// --- Imágenes ----------------------------------------------------------------

const downloaded = new Map()

// Se guardan con su nombre original; si ya existe otra imagen distinta con ese nombre, se le añade el id.
async function saveImage(asset) {
  if (!asset?.url) return undefined
  if (downloaded.has(asset.id)) return downloaded.get(asset.id)
  let name = asset.originalFilename ?? `${asset.id}${extname(asset.url)}`
  let file = join(UPLOADS, name)
  if (existsSync(file) && statSync(file).size !== asset.size) {
    name = `${name.replace(/(\.[^.]+)?$/, '')}-${asset.id.split('-')[1].slice(0, 8)}${extname(name)}`
    file = join(UPLOADS, name)
  }
  if (!existsSync(file)) {
    const response = await fetch(asset.url)
    if (!response.ok) throw new Error(`No se pudo descargar ${asset.url}: ${response.status}`)
    writeFileSync(file, Buffer.from(await response.arrayBuffer()))
    console.log(`  imagen nueva: ${name}`)
  }
  downloaded.set(asset.id, `/uploads/${name}`)
  return `/uploads/${name}`
}

// --- Bloques del editor → Markdown ---------------------------------------------

const HEADINGS = { h2: '## ', h3: '### ', h4: '#### ' }

// Los espacios de los extremos van fuera de ** y *, o el Markdown no los reconoce.
function wrap(text, marker) {
  const [, start, inner, end] = text.match(/^(\s*)([\s\S]*?)(\s*)$/)
  return inner ? `${start}${marker}${inner}${marker}${end}` : text
}

function inlineText(block) {
  const links = new Map(block.markDefs?.filter((d) => d._type === 'link').map((d) => [d._key, d.href]))
  let out = ''
  let i = 0
  const children = block.children ?? []
  while (i < children.length) {
    const linkKey = children[i].marks?.find((m) => links.has(m))
    // Los trozos seguidos con el mismo enlace forman un solo [texto](url).
    let text = ''
    while (i < children.length && children[i].marks?.find((m) => links.has(m)) === linkKey) {
      const span = children[i++]
      let t = span.text ?? ''
      if (span.marks?.includes('strong')) t = wrap(t, '**')
      if (span.marks?.includes('em')) t = wrap(t, '*')
      text += t
    }
    out += linkKey ? `[${text}](${links.get(linkKey)})` : text
  }
  return out
}

async function toMarkdown(blocks) {
  const parts = []
  let numbers = []
  for (const block of blocks ?? []) {
    if (block._type === 'image') {
      const src = await saveImage(block.asset)
      if (src) parts.push({ text: `![${block.alt ?? ''}](${src})` })
      numbers = []
      continue
    }
    if (block._type !== 'block') continue
    let text = inlineText(block)
    if (block.listItem) {
      const level = block.level ?? 1
      numbers = numbers.slice(0, level)
      numbers[level - 1] = (numbers[level - 1] ?? 0) + 1
      const marker = block.listItem === 'number' ? `${numbers[level - 1]}. ` : '- '
      parts.push({ text: '   '.repeat(level - 1) + marker + text, list: true })
      continue
    }
    numbers = []
    if (HEADINGS[block.style]) text = HEADINGS[block.style] + text
    // Un párrafo que empieza como una lista o un título se escapa para que siga siendo párrafo.
    else text = text.replace(/^(\d+)\. /, '$1\\. ').replace(/^([-#>])/, '\\$1')
    parts.push({ text })
  }
  // Los elementos de una misma lista van seguidos; el resto, separados por una línea en blanco.
  return parts.map((p, i) => (i && !(p.list && parts[i - 1].list) ? '\n\n' : i ? '\n' : '') + p.text).join('')
}

// --- Escritura -----------------------------------------------------------------

const clean = (value) => JSON.parse(JSON.stringify(value, (key, v) => (v === null || key.startsWith('_') ? undefined : v)))

// Todo se prepara en memoria y se escribe al final, para no dejar la copia a medias si algo falla.
const files = new Map()

function writeMarkdown(file, frontmatter, body) {
  const yaml = stringify(clean(frontmatter), { lineWidth: 0 })
  files.set(file, `---\n${yaml}---\n${body ? body + '\n' : ''}`)
}

function writeYaml(file, value) {
  files.set(file, stringify(clean(value), { lineWidth: 0 }))
}

mkdirSync(UPLOADS, { recursive: true })

for (const t of data.teachers) {
  writeMarkdown(
    `content/teachers/${t.slug}.md`,
    { name: t.name, photo: await saveImage(t.photo?.asset), groups: t.groups, order: t.order },
    await toMarkdown(t.body),
  )
}

for (const p of data.pages) {
  const gallery = []
  for (const image of p.gallery ?? []) gallery.push(await saveImage(image.asset))
  writeMarkdown(
    `content/pages/${p.slug}.md`,
    {
      title: p.title,
      layout: p.layout,
      kicker: p.kicker,
      path: p.path,
      summary: p.summary,
      image: await saveImage(p.image?.asset),
      signup: p.signup,
      status: p.status,
      finished: p.finished,
      facts: p.facts,
      teachers: p.teachers,
      items: p.items,
      groups: p.groups,
      gallery: gallery.length ? gallery : undefined,
    },
    await toMarkdown(p.body),
  )
}

writeYaml('content/settings/site.yml', data.site)

const discover = []
for (const { image, ...book } of data.home?.discover ?? []) discover.push({ ...book, image: await saveImage(image?.asset) })
writeYaml('content/settings/home.yml', { intro: data.home?.intro, discover, callouts: data.home?.callouts })

writeYaml('content/settings/menu.yml', { items: data.menu })

// Las carpetas se rehacen enteras para que desaparezcan las páginas borradas en Sanity.
for (const dir of ['content/pages', 'content/teachers']) {
  rmSync(join(ROOT, dir), { recursive: true, force: true })
  mkdirSync(join(ROOT, dir), { recursive: true })
}
for (const [file, text] of files) writeFileSync(join(ROOT, file), text)

console.log(`Copia hecha: ${data.pages.length} páginas, ${data.teachers.length} fichas de profesorado y ${downloaded.size} imágenes.`)
