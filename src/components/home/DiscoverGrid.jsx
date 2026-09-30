import { Link } from 'react-router-dom'
import { home, site } from '../../lib/content'

// Estantería: cada apartado es un libro con el título en el lomo.
export default function DiscoverGrid() {
  return (
    <section className="discover textured">
      <div className="shelf">
        {home.discover.map((card) => (
          <Link key={card.href} to={card.href} className="book">
            <span className="book__mark" aria-hidden="true">S</span>
            <span className="book__title">{card.label}</span>
            <span className="book__brand" aria-hidden="true">{site.title}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
