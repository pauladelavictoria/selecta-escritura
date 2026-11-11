import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { pixels } from '../../lib/content'
import { readConsent, saveConsent } from '../../lib/consent'
import styles from './CookieBanner.module.css'

// Los píxeles de «Píxeles de publicidad» solo se cargan si el visitante acepta.
// El enlace «Configurar cookies» del pie borra la respuesta para volver a preguntar.
// Las etiquetas <script> insertadas con createContextualFragment sí se ejecutan, a diferencia de innerHTML.
// Se cargan una sola vez aunque el efecto se repita (React lo hace en desarrollo).
// El código del píxel ya envía el PageView de la página donde se carga; los cambios de
// página dentro de la web no recargan nada, así que cada uno envía su propio PageView.
let loaded = false
let trackedPath = null
function loadPixels(path) {
  if (loaded) return
  loaded = true
  trackedPath = path
  pixels.forEach((code) => document.head.append(document.createRange().createContextualFragment(code)))
}

export default function CookieBanner() {
  const [consent, setConsent] = useState(readConsent)
  const { pathname } = useLocation()

  useEffect(() => {
    if (consent === 'si') loadPixels(pathname)
  }, [consent]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loaded || pathname === trackedPath) return
    trackedPath = pathname
    window.fbq?.('track', 'PageView')
  }, [pathname])

  if (!pixels.length || consent) return null

  function answer(value) {
    saveConsent(value)
    setConsent(value)
  }

  return (
    <div className={styles.banner} role="dialog" aria-label="Aviso de cookies">
      <p className={styles.text}>
        Usamos cookies de publicidad para medir nuestras campañas. Más información en la{' '}
        <Link to="/politica-cookies">política de cookies</Link>.
      </p>
      <div className={styles.actions}>
        <button type="button" className="button" onClick={() => answer('no')}>
          Rechazar
        </button>
        <button type="button" className="button" onClick={() => answer('si')}>
          Aceptar
        </button>
      </div>
    </div>
  )
}
