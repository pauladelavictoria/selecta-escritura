import { useRef, useState } from 'react'
import NetlifyForm, { Field, Select } from './NetlifyForm'
import { toPlainText } from '@portabletext/react'
import { useLocation } from 'react-router-dom'
import { trackLead } from '../../lib/lead'
import { getPageByPath } from '../../lib/content'
import styles from './SignupButton.module.css'

// El campo oculto «curso» conserva desde qué página se envió aunque se cambie el asunto.
export default function SignupButton({ course, label = 'Quiero apuntarme' }) {
  // El título y la frase de la ventana son los de la página /suscribete, sin sus títulos.
  const intro = getPageByPath('/suscribete')
  const introText = toPlainText(intro?.body?.filter((block) => !block.style?.startsWith('h')) ?? [])
  const dialogRef = useRef(null)
  const { pathname } = useLocation()
  // Cada apertura monta un formulario nuevo, sin el mensaje del envío anterior.
  const [openings, setOpenings] = useState(0)

  function open() {
    setOpenings((n) => n + 1)
    dialogRef.current.showModal()
  }

  const close = () => dialogRef.current.close()
  // Tras enviar, deja leer el mensaje de gracias un momento y cierra la ventana.
  const closeSoon = () => setTimeout(close, 2000)
  const handleSent = () => {
    trackLead(pathname)
    closeSoon()
  }

  return (
    <>
      <button type="button" className="button" onClick={open}>
        {label}
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="signup-title"
        onClick={(event) => event.target === event.currentTarget && close()}
      >
        <div className={styles.panel}>
          <button type="button" className={styles.close} onClick={close} aria-label="Cerrar">
            ×
          </button>
          <h2 id="signup-title" className={styles.title}>{intro?.title}</h2>
          <p className={styles.intro}>{introText}</p>

          <NetlifyForm key={openings} name="inscripcion" className={styles.form} onSent={handleSent} newsletter={false}>
            <input type="hidden" name="curso" value={course} />
            <Field label="Nombre completo">
              <input name="nombre" autoComplete="name" />
            </Field>
            <Field label="Teléfono">
              <input type="tel" name="telefono" autoComplete="tel" />
            </Field>
            <Field label="Email *">
              <input type="email" name="email" required autoComplete="email" />
            </Field>
            <Field label="Asunto">
              <input name="asunto" defaultValue={course} />
            </Field>
            <Select
              label="¿Qué necesitas?"
              name="peticion"
              options={['Quiero más información', 'Quiero reservar la plaza']}
              full
            />
            <Field label="Mensaje" full>
              <textarea name="mensaje" rows="4" />
            </Field>
          </NetlifyForm>
        </div>
      </dialog>
    </>
  )
}
