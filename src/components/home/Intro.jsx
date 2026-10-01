import BrandComma from '../ui/BrandComma'
import { home } from '../../lib/content'
import styles from './Intro.module.css'

const { intro } = home

export default function Intro() {
  return (
    <section id="abajo" className={styles.intro}>
      <div className={`container ${styles.inner}`}>
        {/* La coma rosa del logo, a tamaño gigante */}
        <BrandComma className={styles.comma} />
        <p className={styles.lead}>{intro.lead}</p>
      </div>
    </section>
  )
}
