export default function FactList({ facts = [] }) {
  if (!facts.length) return null
  return (
    <dl className="facts">
      {facts.map((fact) => (
        <div key={fact.label} className="facts__row">
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}
