import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import SmartLink from '../ui/SmartLink'
import { site } from '../../lib/content'
import styles from './Footer.module.css'

const YEAR = new Date().getFullYear()

const contactItems = [
  { icon: 'phone', label: site.phoneDisplay, href: `tel:+34${site.phone}` },
  { icon: 'mail', label: site.email, href: `mailto:${site.email}?subject=Contacto%20Web` },
  { icon: 'pin', label: site.address, href: site.mapsUrl },
  { icon: 'whatsapp', label: site.phone, href: `https://api.whatsapp.com/send?phone=${site.phone}` },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <Link to="/" className={styles.brand}>
          <img src="/images/logo-selectaescritura-color.svg" alt="Selecta Escritura" />
        </Link>

        <ul className={styles.links}>
          {site.legalLinks.map((link) => (
            <li key={link.href}>
              <SmartLink href={link.href}>{link.label}</SmartLink>
            </li>
          ))}
        </ul>

        <ul className={styles.contact}>
          {contactItems.map((item) => (
            <li key={item.icon}>
              <SmartLink href={item.href}>
                <Icon name={item.icon} size={16} /> <span>{item.label}</span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="container">
        <p className={styles.copy}>© {YEAR} Selecta Escritura</p>
      </div>
    </footer>
  )
}
