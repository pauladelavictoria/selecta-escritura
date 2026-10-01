import { Link } from 'react-router-dom'
import styles from './Card.module.css'

// Una entrada del índice: título grande, resumen y cartel al lado.
export default function Card({ page }) {
  return (
    <Link to={page.path} className={styles.card}>
      <h3 className={styles.title}>{page.title}</h3>
      <div className={styles.body}>
        {page.summary && <p className={styles.summary}>{page.summary}</p>}
        <span className={styles.more}>Leer más <span aria-hidden="true">→</span></span>
      </div>
      <div className={styles.media}>
        {page.image && <img src={page.image} alt="" loading="lazy" />}
      </div>
    </Link>
  )
}
