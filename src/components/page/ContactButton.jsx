import { site } from '../../lib/content'

export default function ContactButton({ subject, label = 'Quiero información' }) {
  const href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}`
  return (
    <a href={href} className="button">
      {label}
    </a>
  )
}
