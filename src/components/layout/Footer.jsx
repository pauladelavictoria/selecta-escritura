import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import SmartLink from '../ui/SmartLink'
import { site } from '../../lib/content'

const YEAR = new Date().getFullYear()

const contactItems = [
  { icon: 'phone', label: site.phoneDisplay, href: `tel:+34${site.phone}` },
  { icon: 'mail', label: site.email, href: `mailto:${site.email}?subject=Contacto%20Web` },
  { icon: 'pin', label: site.address, href: site.mapsUrl },
  { icon: 'whatsapp', label: site.phone, href: `https://api.whatsapp.com/send?phone=${site.phone}` },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/">
            <img src="/images/logo-selectaescritura-color.svg" alt="Selecta Escritura" />
          </Link>
        </div>

        <ul className="footer__links">
          {site.legalLinks.map((link) => (
            <li key={link.href}>
              <SmartLink href={link.href}>{link.label}</SmartLink>
            </li>
          ))}
        </ul>

        <ul className="footer__contact">
          {contactItems.map((item) => (
            <li key={item.icon}>
              <SmartLink href={item.href}>
                <Icon name={item.icon} size={16} /> <span>{item.label}</span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
      <p className="footer__copy">© {YEAR} Selecta Escritura</p>
    </footer>
  )
}
