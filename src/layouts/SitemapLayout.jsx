import { useState } from 'react'
import PageHero from '../components/page/PageHero'
import SmartLink from '../components/ui/SmartLink'
import AddressMap from '../components/page/AddressMap'
import Icon from '../components/ui/Icon'
import { home, menu, site } from '../lib/content'

// Se genera solo a partir del menú, la portada y el pie: no hay que mantenerlo a mano.

const normalize = (text = '') =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

// Cada entrada de primer nivel del menú es una tarjeta; sus hijos con submenú, bloques dentro de ella.
function sectionFromMenu(item) {
  const loose = []
  const groups = []
  for (const child of item.children ?? []) {
    if (child.children?.length) groups.push({ title: child.label, href: child.href, links: child.children })
    else loose.push(child)
  }
  if (loose.length) groups.unshift({ links: loose })
  return { title: item.label, href: item.href, groups }
}

function buildSections() {
  const sections = menu.map(sectionFromMenu)

  const inMenu = new Set()
  const collect = (items) => items.forEach((i) => (i.href && inMenu.add(i.href), i.children && collect(i.children)))
  collect(menu)

  const extras = [...home.callouts.map((c) => ({ label: c.title, href: c.href })), ...home.discover]
    .filter((link) => !inMenu.has(link.href))
    .filter((link, i, all) => all.findIndex((l) => l.href === link.href) === i)
  if (extras.length) sections.push({ title: 'Más', groups: [{ links: extras }] })

  const legal = site.legalLinks.filter((link) => link.href !== '/mapa-sitio')
  sections.push({ title: 'Información legal', groups: [{ links: legal }] })
  return sections
}

// Si el título de un bloque coincide, se muestra entero; si no, solo los enlaces que coinciden.
function filterSections(sections, query) {
  const q = normalize(query.trim())
  if (!q) return sections
  return sections
    .map((section) => {
      if (normalize(section.title).includes(q)) return section
      const groups = section.groups
        .map((group) =>
          group.title && normalize(group.title).includes(q)
            ? group
            : { ...group, links: group.links.filter((link) => normalize(link.label).includes(q)) },
        )
        .filter((group) => group.links.length)
      return { ...section, groups }
    })
    .filter((section) => section.groups.length)
}

const sections = buildSections()

// Algunos cursos aparecen en dos secciones (presencial y online): se cuentan una vez.
const countLinks = (sections) => new Set(sections.flatMap((s) => s.groups.flatMap((g) => g.links.map((l) => l.href)))).size

function SitemapCard({ section }) {
  return (
    <section className="sitemap-card">
      <h2 className="sitemap-card__title">
        {section.href ? <SmartLink href={section.href}>{section.title}</SmartLink> : section.title}
      </h2>
      <div className="sitemap-card__body">
        {section.groups.map((group, i) => (
          <div key={group.title ?? i} className="sitemap-group">
            {group.title && (
              <h3 className="sitemap-group__title">
                {group.href ? <SmartLink href={group.href}>{group.title}</SmartLink> : group.title}
              </h3>
            )}
            <ul className="sitemap-group__links">
              {group.links.map((link) => (
                <li key={link.href}>
                  <SmartLink href={link.href}>{link.label}</SmartLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function SitemapLayout({ page }) {
  const [query, setQuery] = useState('')
  const visible = filterSections(sections, query)

  return (
    <article className="page">
      <PageHero kicker={page.kicker} title={page.title} />
      <div className="container sitemap">
        <section className="sitemap-location">
          <h2>Dónde estamos</h2>
          <SmartLink href={site.mapsUrl} className="sitemap-location__address">
            <Icon name="pin" size={18} /> {site.address}
          </SmartLink>
          <AddressMap />
        </section>

        <div className="sitemap__search">
          <label htmlFor="sitemap-search">¿Qué estás buscando?</label>
          <input
            id="sitemap-search"
            type="search"
            placeholder="Narrativa, poesía, tutorías…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <p className="sitemap__count" aria-live="polite">
            {query ? `${countLinks(visible)} resultados` : `${countLinks(sections)} páginas`}
          </p>
        </div>

        {visible.length ? (
          <div className="sitemap__grid">
            {visible.map((section) => (
              <SitemapCard key={section.title} section={section} />
            ))}
          </div>
        ) : (
          <p className="sitemap__empty">
            No hay ninguna página con «{query}». <SmartLink href="/contacto">Escríbenos</SmartLink> y te ayudamos.
          </p>
        )}
      </div>
    </article>
  )
}
