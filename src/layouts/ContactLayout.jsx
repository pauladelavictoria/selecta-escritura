import PageLayout from './PageLayout'
import ContactForm from '../components/page/ContactForm'
import AddressMap from '../components/page/AddressMap'
import SmartLink from '../components/ui/SmartLink'
import { contactLinks, site } from '../lib/content'
import styles from './ContactLayout.module.css'

const channels = [
  { label: 'Teléfono', value: site.phoneDisplay, action: 'Llamar', href: contactLinks.phone },
  { label: 'Email', value: site.email, action: 'Escribir', href: contactLinks.email },
  { label: 'Dirección', value: site.address, action: 'Cómo llegar', href: contactLinks.maps },
  { label: 'WhatsApp', value: site.phoneDisplay, action: 'Abrir chat', href: contactLinks.whatsapp },
]

export default function ContactLayout({ page }) {
  return (
    <PageLayout page={page}>
      <dl className={styles.list}>
        {channels.map((channel) => (
          <SmartLink key={channel.label} href={channel.href} className={styles.row}>
            <dt className={styles.label}>{channel.label}</dt>
            <dd className={styles.value}>{channel.value}</dd>
            <span className={styles.action}>
              {channel.action} <span aria-hidden="true">→</span>
            </span>
          </SmartLink>
        ))}
      </dl>
      <ContactForm />
      <AddressMap />
    </PageLayout>
  )
}
