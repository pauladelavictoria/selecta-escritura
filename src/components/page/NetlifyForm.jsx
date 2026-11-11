import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './NetlifyForm.module.css'

// Netlify detecta cada formulario por su copia oculta en index.html: los campos deben coincidir.
// El email que recibe los avisos se configura en el panel de Netlify, no en el código.
const messages = {
  sent: '¡Gracias! Hemos recibido tu mensaje y te responderemos lo antes posible.',
  error: 'No se ha podido enviar el mensaje. Inténtalo de nuevo o escríbenos directamente por email.',
}

export default function NetlifyForm({ name, className = '', onSent, newsletter = true, children }) {
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
      onSent?.()
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

      {newsletter && (
        <label className={`${styles.check} ${styles.full}`}>
          <input type="checkbox" name="novedades" value="acepto" />
          <span>Quiero recibir por email información sobre otros talleres y actividades de Selecta</span>
        </label>
      )}

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

// Desplegable propio: la lista nativa la dibuja el navegador y en Safari/Firefox no se puede maquetar.
// El valor viaja en un campo oculto con el mismo «name», así Netlify lo recibe como cualquier otro.
export function Select({ label, name, options, full }) {
  const [value, setValue] = useState(options[0])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const ref = useRef(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const closeOutside = (event) => ref.current.contains(event.target) || setOpen(false)
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [open])

  function show() {
    setActive(options.indexOf(value))
    setOpen(true)
  }

  function choose(index) {
    setValue(options[index])
    setOpen(false)
  }

  function handleKeyDown(event) {
    const { key } = event
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault()
      if (!open) return show()
      const step = key === 'ArrowDown' ? 1 : -1
      setActive((i) => (i + step + options.length) % options.length)
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      open ? choose(active) : show()
    } else if (key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
    } else if (key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={ref} className={`${styles.field} ${full ? styles.full : ''}`}>
      <span id={`${id}-label`}>{label}</span>
      <div className={styles.select}>
        <button
          type="button"
          role="combobox"
          aria-labelledby={`${id}-label`}
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-activedescendant={open ? `${id}-${active}` : undefined}
          onClick={() => (open ? setOpen(false) : show())}
          onKeyDown={handleKeyDown}
        >
          {value}
        </button>
        <input type="hidden" name={name} value={value} />
        {open && (
          <ul id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`}>
            {options.map((option, index) => (
              <li
                key={option}
                id={`${id}-${index}`}
                role="option"
                aria-selected={option === value}
                data-active={index === active || undefined}
                onPointerEnter={() => setActive(index)}
                onClick={() => choose(index)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
