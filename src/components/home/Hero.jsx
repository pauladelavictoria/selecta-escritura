import BrandComma from '../ui/BrandComma'
import { site } from '../../lib/content'
import styles from './Hero.module.css'

// La frase de site.yml se parte en la afirmación (a tamaño de cartel) y sus «para…», apilados al lado.
const [statement, ...clauses] = site.tagline.split(/\s(?=para\s)/)

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <h1 className={styles.statement}>
          {statement}
          <BrandComma className={styles.comma} />
        </h1>
        {clauses.length > 0 && (
          <ul className={styles.clauses}>
            {clauses.map((clause, i) => (
              <li key={clause} style={{ '--i': i }}>{clause}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
