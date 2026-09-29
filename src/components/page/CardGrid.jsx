import Card from './Card'

export default function CardGrid({ pages }) {
  if (!pages.length) return null
  return (
    <div className="card-grid">
      {pages.map((page) => (
        <Card key={page.slug} page={page} />
      ))}
    </div>
  )
}
