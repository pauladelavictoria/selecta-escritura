import { Link } from 'react-router-dom'
import LineIcon from '../ui/LineIcon'
import { home } from '../../lib/content'

export default function Callouts() {
  return (
    <section className="callouts">
      {home.callouts.map((item, i) => (
        <Link key={item.href} to={item.href} className={`callout callout--${i % 2 ? 'teal' : 'pink'}`}>
          <span className="callout__icon">
            <LineIcon name={item.icon} size={44} />
          </span>
          <span className="callout__text">
            <h2>{item.title}</h2>
            {item.text && <p>{item.text}</p>}
          </span>
          <span className="callout__cta">
            Descubre más <span aria-hidden="true">→</span>
          </span>
        </Link>
      ))}
    </section>
  )
}
