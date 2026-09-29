import { Link } from 'react-router-dom'

export default function PageHero({ kicker, title }) {
  return (
    <section className="page-hero textured">
      <div className="container">
        {kicker && <p className="page-hero__kicker">{kicker}</p>}
        <h1>{title}</h1>
        <nav className="page-hero__crumbs" aria-label="Migas de pan">
          <Link to="/">Inicio</Link> » <span>{title}</span>
        </nav>
      </div>
    </section>
  )
}
