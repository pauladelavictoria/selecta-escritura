// Lee el contenido de Sanity al abrir la web: una sola consulta con todo.
// Los cambios publicados en el Studio se ven sin volver a desplegar la web.
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: '2026-10-01',
  useCdn: true,
})

// Las imágenes se piden ya redimensionadas y en el formato más ligero que acepte el navegador.
const QUERY = `{
  "site": *[_id == "siteSettings"][0],
  "home": *[_id == "home"][0]{
    intro,
    callouts,
    "discover": discover[]{ label, href, "image": image.asset->url + "?w=800&auto=format" }
  },
  "menu": *[_id == "menu"][0].items,
  "pages": *[_type == "page"]{
    ...,
    "slug": slug.current,
    "image": image.asset->url + "?w=1600&auto=format",
    "gallery": gallery[].asset->url + "?w=1600&auto=format",
    "teachers": teachers[]->slug.current,
    "items": items[]->slug.current,
    body[]{ ..., _type == "image" => { "url": asset->url + "?w=1600&auto=format" } }
  },
  "teachers": *[_type == "teacher"] | order(order asc){
    ...,
    "slug": slug.current,
    "photo": photo.asset->url + "?w=600&auto=format",
    body[]{ ..., _type == "image" => { "url": asset->url + "?w=1600&auto=format" } }
  }
}`

const normalizePath = (path) => '/' + path.replace(/^\/+|\/+$/g, '')

// GROQ devuelve null en los campos vacíos; sin ellos, los valores por defecto de los componentes funcionan.
const withoutNulls = (doc) => Object.fromEntries(Object.entries(doc).filter(([, value]) => value !== null))

export let site
export let home
export let menu
export let contactLinks

let teachers = []
let pagesByPath = new Map()
let pagesBySlug = new Map()
let teachersBySlug = new Map()

export async function loadContent() {
  const data = await client.fetch(QUERY)

  site = data.site ?? {}
  home = data.home ?? {}
  menu = data.menu ?? []
  contactLinks = {
    phone: `tel:+34${site.phone}`,
    email: `mailto:${site.email}`,
    whatsapp: `https://api.whatsapp.com/send?phone=34${site.phone}`,
    maps: site.mapsUrl,
  }

  const pages = data.pages.map(withoutNulls).map((page) => ({ ...page, path: normalizePath(page.path ?? page.slug) }))
  teachers = data.teachers.map(withoutNulls)

  pagesByPath = new Map(pages.map((page) => [page.path, page]))
  pagesBySlug = new Map(pages.map((page) => [page.slug, page]))
  teachersBySlug = new Map(teachers.map((teacher) => [teacher.slug, teacher]))
}

export const getPageByPath = (path) => pagesByPath.get(normalizePath(path))

export const getPagesBySlugs = (slugs = []) => slugs.map((slug) => pagesBySlug.get(slug)).filter(Boolean)
export const getTeachersBySlugs = (slugs = []) => slugs.map((slug) => teachersBySlug.get(slug)).filter(Boolean)
export const getTeachersByGroup = (group) => teachers.filter((teacher) => teacher.groups?.includes(group))
