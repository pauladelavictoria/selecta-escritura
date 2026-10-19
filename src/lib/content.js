// Lee el contenido de /content en tiempo de build. No hay base de datos:
// cada página es un .md con frontmatter y los ajustes globales son .yml.
import { parse } from 'yaml'
import siteRaw from '/content/settings/site.yml?raw'
import homeRaw from '/content/settings/home.yml?raw'
import menuRaw from '/content/settings/menu.yml?raw'

const pageFiles = import.meta.glob('/content/pages/*.md', { query: '?raw', import: 'default', eager: true })
const teacherFiles = import.meta.glob('/content/teachers/*.md', { query: '?raw', import: 'default', eager: true })

function parseMarkdown(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw.trim() }
  return { data: parse(match[1]) ?? {}, body: match[2].trim() }
}

// Las referencias pueden guardarse como «slug», «slug.md» o «content/pages/slug.md» según el CMS.
const toSlug = (ref) => String(ref).split('/').pop().replace(/\.md$/, '')

const normalizePath = (path) => '/' + path.replace(/^\/+|\/+$/g, '')

function loadCollection(files) {
  return Object.entries(files).map(([file, raw]) => {
    const { data, body } = parseMarkdown(raw)
    return { ...data, slug: toSlug(file), body }
  })
}

export const site = parse(siteRaw)
export const home = parse(homeRaw)
export const menu = parse(menuRaw).items

export const contactLinks = {
  phone: `tel:+34${site.phone}`,
  email: `mailto:${site.email}`,
  whatsapp: `https://api.whatsapp.com/send?phone=34${site.phone}`,
  maps: site.mapsUrl,
}

const pages = loadCollection(pageFiles).map((page) => ({
  ...page,
  path: normalizePath(page.path ?? page.slug),
}))

const teachers = loadCollection(teacherFiles).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

const pagesByPath = new Map(pages.map((page) => [page.path, page]))
const pagesBySlug = new Map(pages.map((page) => [page.slug, page]))
const teachersBySlug = new Map(teachers.map((teacher) => [teacher.slug, teacher]))

export const getPageByPath = (path) => pagesByPath.get(normalizePath(path))

export const getPagesBySlugs = (slugs = []) => slugs.map((slug) => pagesBySlug.get(toSlug(slug))).filter(Boolean)
export const getTeachersBySlugs = (slugs = []) => slugs.map((slug) => teachersBySlug.get(toSlug(slug))).filter(Boolean)
export const getTeachersByGroup = (group) => teachers.filter((teacher) => teacher.groups?.includes(group))
