import { Link } from 'react-router-dom'

export default function Card({ page }) {
  return (
    <Link to={page.path} className="card">
      <div className="card__media">
        {page.image ? <img src={page.image} alt="" loading="lazy" /> : <span className="card__placeholder">{page.title}</span>}
      </div>
      <div className="card__body">
        <h3>{page.title}</h3>
        {page.summary && <p>{page.summary}</p>}
        <span className="card__more">Leer más →</span>
      </div>
    </Link>
  )
}
