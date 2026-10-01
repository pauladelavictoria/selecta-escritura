import { Link } from 'react-router-dom'
import styles from './PageHero.module.css'

// Los títulos largos bajan un tamaño para no ocupar media pantalla.
const sizeFor = (title) => (title.length > 28 ? styles.long : title.length > 14 ? styles.medium : '')

export default function PageHero({ kicker, title }) {
  return (
    <header className={`container ${styles.hero}`}>
      <nav className={styles.crumbs} aria-label="Migas de pan">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{title}</span>
      </nav>
      {kicker && <p className={styles.kicker}>{kicker}</p>}
      <h1 className={`${styles.title} ${sizeFor(title)}`}>{title}</h1>
    </header>
  )
}
