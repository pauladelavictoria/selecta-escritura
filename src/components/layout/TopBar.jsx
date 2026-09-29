import Icon from '../ui/Icon'
import { site as contact } from '../../lib/content'

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="container topbar__inner">
        <div className="topbar__contact">
          <a href={`mailto:${contact.email}?subject=Contacto%20Inicial`}>
            <Icon name="mail" size={14} /> <span>{contact.email}</span>
          </a>
          <a href={`tel:${contact.phone}`}>
            <Icon name="phone" size={14} /> <span>{contact.phone}</span>
          </a>
        </div>
        <a href={contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
          <Icon name="instagram" size={16} />
        </a>
      </div>
    </div>
  )
}
