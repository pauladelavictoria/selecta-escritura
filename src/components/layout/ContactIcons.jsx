import Icon from '../ui/Icon'
import { site as contact } from '../../lib/content'
import styles from './ContactIcons.module.css'

// Email, teléfono e Instagram como iconos en la misma fila que el menú.
export default function ContactIcons() {
  return (
    <ul className={styles.icons}>
      <li>
        <a href={`mailto:${contact.email}?subject=Contacto%20Inicial`} aria-label={contact.email} title={contact.email}>
          <Icon name="mail" size={18} />
        </a>
      </li>
      <li>
        <a href={`tel:${contact.phone}`} aria-label={contact.phone} title={contact.phone}>
          <Icon name="phone" size={18} />
        </a>
      </li>
      <li>
        <a href={contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
          <Icon name="instagram" size={18} />
        </a>
      </li>
    </ul>
  )
}
