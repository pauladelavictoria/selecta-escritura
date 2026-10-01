import styles from './FactList.module.css'

export default function FactList({ facts = [] }) {
  if (!facts.length) return null
  return (
    <dl className={styles.facts}>
      {facts.map((fact) => (
        <div key={fact.label} className={styles.row}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}
