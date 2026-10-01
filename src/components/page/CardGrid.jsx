import Card from './Card'
import styles from './Card.module.css'

export default function CardGrid({ pages }) {
  if (!pages.length) return null
  return (
    <div className={styles.index}>
      {pages.map((page) => (
        <Card key={page.slug} page={page} />
      ))}
    </div>
  )
}
