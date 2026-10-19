import Icon from '../ui/Icon'
import { contactLinks, site } from '../../lib/content'
import styles from './ContactIcons.module.css'

export default function ContactIcons() {
  return (
    <ul className={styles.icons}>
      <li>
        <a href={`${contactLinks.email}?subject=Contacto%20Inicial`} aria-label={site.email} title={site.email}>
          <Icon name="mail" size={18} />
        </a>
      </li>
      <li>
        <a href={contactLinks.phone} aria-label={site.phoneDisplay} title={site.phoneDisplay}>
          <Icon name="phone" size={18} />
        </a>
      </li>
      <li>
        <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
          <Icon name="instagram" size={18} />
        </a>
      </li>
    </ul>
  )
}
