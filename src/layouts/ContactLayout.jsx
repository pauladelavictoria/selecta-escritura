import PageLayout from './PageLayout'
import ContactForm from '../components/page/ContactForm'
import AddressMap from '../components/page/AddressMap'
import { site } from '../lib/content'
import styles from './ContactLayout.module.css'

const channels = [
  { label: 'Teléfono', value: site.phoneDisplay, action: 'Llamar', href: `tel:+34${site.phone}` },
  { label: 'Email', value: site.email, action: 'Escribir', href: `mailto:${site.email}` },
  { label: 'Dirección', value: site.address, action: 'Cómo llegar', href: site.mapsUrl, external: true },
  { label: 'WhatsApp', value: site.phoneDisplay, action: 'Abrir chat', href: `https://api.whatsapp.com/send?phone=${site.phone}`, external: true },
]

export default function ContactLayout({ page }) {
  return (
    <PageLayout page={page}>
      <dl className={styles.list}>
        {channels.map((channel) => (
          <a key={channel.label} href={channel.href} className={styles.row} {...(channel.external && { target: '_blank', rel: 'noreferrer' })}>
            <dt className={styles.label}>{channel.label}</dt>
            <dd className={styles.value}>{channel.value}</dd>
            <span className={styles.action}>
              {channel.action} <span aria-hidden="true">→</span>
            </span>
          </a>
        ))}
      </dl>
      <ContactForm />
      <AddressMap />
    </PageLayout>
  )
}
