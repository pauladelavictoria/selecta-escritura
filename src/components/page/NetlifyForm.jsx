import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './NetlifyForm.module.css'

// Netlify detecta cada formulario por su copia oculta en index.html: los campos deben coincidir.
// El email que recibe los avisos se configura en el panel de Netlify, no en el código.
const messages = {
  sent: '¡Gracias! Hemos recibido tu mensaje y te responderemos lo antes posible.',
  error: 'No se ha podido enviar el mensaje. Inténtalo de nuevo o escríbenos directamente por email.',
}

export default function NetlifyForm({ name, className = '', children }) {
  const [status, setStatus] = useState('idle')

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('sending')
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      })
      if (!response.ok) throw new Error(response.statusText)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form name={name} className={`${styles.form} ${className}`} onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value={name} />
      <p hidden>
        <label>
          No rellenar: <input name="bot-field" />
        </label>
      </p>

      {children}

      <label className={`${styles.check} ${styles.full}`}>
        <input type="checkbox" name="privacidad" value="acepto" required />
        <span>
          Acepto vuestras <Link to="/politica-de-privacidad">políticas de privacidad</Link> *
        </span>
      </label>

      <label className={`${styles.check} ${styles.full}`}>
        <input type="checkbox" name="novedades" value="acepto" />
        <span>Quiero recibir por email información sobre otros talleres y actividades de Selecta</span>
      </label>

      <div className={`${styles.full} ${styles.footer}`}>
        <button type="submit" className="button" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Enviar'}
        </button>
        {messages[status] && (
          <p className={`${styles.status} ${styles[status]}`} role="status">
            {messages[status]}
          </p>
        )}
      </div>
    </form>
  )
}

export function Field({ label, full, children }) {
  return (
    <label className={`${styles.field} ${full ? styles.full : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  )
}
