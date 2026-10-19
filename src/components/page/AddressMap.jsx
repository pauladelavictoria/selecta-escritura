import { site } from '../../lib/content'
import styles from './AddressMap.module.css'

// Mismo mapa que en la web original: embed de Google Maps con la dirección de site.yml.
const src = `https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&t=m&z=14&output=embed&iwloc=near`

export default function AddressMap() {
  return (
    <div className={styles.map}>
      <iframe src={src} title={site.address} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  )
}
