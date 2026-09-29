import { useState } from 'react'
import { Link } from 'react-router-dom'

// Netlify Forms: el formulario gemelo oculto en index.html permite que Netlify lo detecte al desplegar.
// El email de destino de los avisos se configura en el panel de Netlify, no en el código.
const FORM_NAME = 'contacto'

const messages = {
  sent: '¡Gracias! Hemos recibido tu mensaje y te responderemos lo antes posible.',
  error: 'No se ha podido enviar el mensaje. Inténtalo de nuevo o escríbenos directamente por email.',
}

export default function ContactForm() {
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
    <form name={FORM_NAME} className="contact-form" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p hidden>
        <label>
          No rellenar: <input name="bot-field" />
        </label>
      </p>

      <label className="field">
        <span>Nombre *</span>
        <input name="nombre" placeholder="Su nombre" required autoComplete="given-name" />
      </label>
      <label className="field">
        <span>Apellidos *</span>
        <input name="apellidos" placeholder="Su apellido" required autoComplete="family-name" />
      </label>
      <label className="field">
        <span>Correo electrónico *</span>
        <input type="email" name="email" placeholder="Su email" required autoComplete="email" />
      </label>
      <label className="field">
        <span>Teléfono</span>
        <input type="tel" name="telefono" placeholder="Número de teléfono" autoComplete="tel" />
      </label>
      <label className="field field--full">
        <span>Mensaje</span>
        <textarea name="mensaje" rows="6" placeholder="Su mensaje va aquí" />
      </label>
      <label className="field--check field--full">
        <input type="checkbox" name="privacidad" value="acepto" required />
        <span>
          Acepto vuestras <Link to="/politica-de-privacidad">políticas de privacidad</Link> *
        </span>
      </label>

      <div className="field--full contact-form__footer">
        <button type="submit" className="button" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Enviar'}
        </button>
        {messages[status] && (
          <p className={`contact-form__status contact-form__status--${status}`} role="status">
            {messages[status]}
          </p>
        )}
      </div>
    </form>
  )
}
