import { Link } from 'react-router-dom'

export default function Card({ page, index, wide }) {
  return (
    <Link to={page.path} className={`card${wide ? ' card--wide' : ''}`}>
      <div className="card__head">
        <h3>{page.title}</h3>
        <span className="card__num" aria-hidden="true">Nº {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="card__media">
        {page.image ? <img src={page.image} alt="" loading="lazy" /> : <span className="card__placeholder">{page.title}</span>}
      </div>
      {page.summary && <p className="card__summary">{page.summary}</p>}
      <span className="card__more">Leer más <span aria-hidden="true">→</span></span>
    </Link>
  )
}
