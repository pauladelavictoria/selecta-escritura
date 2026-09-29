import { Link } from 'react-router-dom'
import PageHero from '../components/page/PageHero'

export default function NotFound() {
  return (
    <>
      <PageHero title="Página no encontrada" />
      <div className="container page__content">
        <p>Esta página no existe o ha cambiado de sitio.</p>
        <Link to="/" className="button">Volver al inicio</Link>
      </div>
    </>
  )
}
