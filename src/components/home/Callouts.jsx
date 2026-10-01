import { Link } from 'react-router-dom'
import { home } from '../../lib/content'
import styles from './Callouts.module.css'

export default function Callouts() {
  return (
    <section className={styles.band}>
      <div className="container">
        {home.callouts.map((item) => (
          <Link key={item.href} to={item.href} className={styles.callout}>
            <h2 className={styles.title}>{item.title}</h2>
            <span className={styles.side}>
              {item.text && <span className={styles.text}>{item.text}</span>}
              <span className={styles.cta}>
                Descubre más <span aria-hidden="true">→</span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
