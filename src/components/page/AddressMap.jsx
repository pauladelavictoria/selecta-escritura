import { site } from '../../lib/content'
import styles from './AddressMap.module.css'

// Mismo mapa que en la web original: embed de Google Maps con la dirección de site.yml.
export default function AddressMap({ address = site.address, zoom = 14 }) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=m&z=${zoom}&output=embed&iwloc=near`
  return (
    <div className={styles.map}>
      <iframe src={src} title={address} aria-label={address} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  )
}
