import Card from './Card'

// En una rejilla de 3 columnas, las tarjetas a doble ancho rellenan los huecos:
// sobra 1 → la primera ocupa 2; sobran 2 → la primera y la última ocupan 2.
const isWide = (i, total) => (total % 3 === 2 && i === 0) || (total % 3 === 1 && total > 1 && (i === 0 || i === total - 1))

export default function CardGrid({ pages }) {
  if (!pages.length) return null
  return (
    <div className="card-grid">
      {pages.map((page, i) => (
        <Card key={page.slug} page={page} index={i} wide={isWide(i, pages.length)} />
      ))}
    </div>
  )
}
