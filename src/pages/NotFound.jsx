import { Link } from 'react-router-dom'
import PageHero from '../components/page/PageHero'
import styles from '../layouts/PageLayout.module.css'

export default function NotFound() {
  return (
    <>
      <PageHero title="Página no encontrada" />
      <div className={`container ${styles.content}`}>
        <p>Esta página no existe o ha cambiado de sitio.</p>
        <Link to="/" className="button">Volver al inicio</Link>
      </div>
    </>
  )
}
