import PageLayout from './PageLayout'
import Icon from '../components/ui/Icon'
import ContactForm from '../components/page/ContactForm'
import AddressMap from '../components/page/AddressMap'
import { site } from '../lib/content'

export default function ContactLayout({ page }) {
  return (
    <PageLayout page={page}>
      <div className="contact-cards">
        <a href={`tel:+34${site.phone}`} className="contact-card">
          <Icon name="phone" size={28} /> <span>{site.phoneDisplay}</span>
        </a>
        <a href={`mailto:${site.email}`} className="contact-card">
          <Icon name="mail" size={28} /> <span>{site.email}</span>
        </a>
        <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="contact-card">
          <Icon name="pin" size={28} /> <span>{site.address}</span>
        </a>
        <a href={`https://api.whatsapp.com/send?phone=${site.phone}`} target="_blank" rel="noreferrer" className="contact-card">
          <Icon name="whatsapp" size={28} /> <span>WhatsApp</span>
        </a>
      </div>
      <ContactForm />
      <AddressMap />
    </PageLayout>
  )
}
