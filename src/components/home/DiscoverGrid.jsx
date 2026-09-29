import { Link } from 'react-router-dom'
import { home } from '../../lib/content'

// Las 4 primeras tarjetas van en la fila principal; el resto, centradas debajo.
export default function DiscoverGrid() {
  const rows = [home.discover.slice(0, 4), home.discover.slice(4)].filter((row) => row.length)
  return (
    <section className="discover textured">
      {rows.map((row, i) => (
        <div key={i} className={`container discover__row discover__row--${i === 0 ? 4 : 2}`}>
          {row.map((card) => (
            <Link key={card.href} to={card.href} className="discover__card">
              <img src={card.image} alt={card.label} loading="lazy" />
            </Link>
          ))}
        </div>
      ))}
    </section>
  )
}
