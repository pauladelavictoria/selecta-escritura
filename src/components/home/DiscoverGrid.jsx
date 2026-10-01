import { Link } from 'react-router-dom'
import { home } from '../../lib/content'
import styles from './DiscoverGrid.module.css'

// Estantería: cada apartado es un libro con el título en el lomo.
export default function DiscoverGrid() {
  return (
    <section className={`container ${styles.discover}`}>
      <div className={styles.headingBox}>
        <h2 className={styles.heading}>{home.intro.title}</h2>
      </div>
      <div className={styles.shelf}>
        {home.discover.map((card) => (
          <Link key={card.href} to={card.href} className={styles.book}>
            <span className={styles.spine}>
              {/* Cara superior del libro (tapas y bloque de páginas): solo se ve al inclinarlo */}
              <span className={styles.top} aria-hidden="true" />
              <span className={styles.title}>{card.label}</span>
              <span className={styles.mark} aria-hidden="true"><span>S</span></span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
