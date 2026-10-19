import NetlifyForm, { Field } from './NetlifyForm'

export default function ContactForm() {
  return (
    <NetlifyForm name="contacto">
      <Field label="Nombre *">
        <input name="nombre" placeholder="Su nombre" required autoComplete="given-name" />
      </Field>
      <Field label="Apellidos *">
        <input name="apellidos" placeholder="Su apellido" required autoComplete="family-name" />
      </Field>
      <Field label="Correo electrónico *">
        <input type="email" name="email" placeholder="Su email" required autoComplete="email" />
      </Field>
      <Field label="Teléfono">
        <input type="tel" name="telefono" placeholder="Número de teléfono" autoComplete="tel" />
      </Field>
      <Field label="Mensaje" full>
        <textarea name="mensaje" rows="6" placeholder="Su mensaje va aquí" />
      </Field>
    </NetlifyForm>
  )
}
