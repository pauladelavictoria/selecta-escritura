// Cada campo propio de un tipo de página solo se ve cuando la página es de ese tipo.
const onlyFor = (...layouts) => ({ document }) => !layouts.includes(document?.layout)

export default {
  name: 'page',
  title: 'Página',
  type: 'document',
  fields: [
    { name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() },
    {
      name: 'slug',
      title: 'Dirección (URL)',
      type: 'slug',
      description: 'Pulsa «Generate» para crearla a partir del título.',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    },
    {
      name: 'layout',
      title: 'Tipo de página',
      type: 'string',
      initialValue: 'page',
      options: {
        list: [
          { value: 'page', title: 'Página de texto' },
          { value: 'course', title: 'Curso / taller' },
          { value: 'listing', title: 'Listado de tarjetas' },
          { value: 'team', title: 'Profesorado' },
          { value: 'contact', title: 'Contacto' },
          { value: 'sitemap', title: 'Mapa del sitio' },
        ],
      },
    },
    { name: 'kicker', title: 'Antetítulo', type: 'string', description: 'Texto pequeño sobre el título, p. ej. «Taller».' },
    {
      name: 'path',
      title: 'URL personalizada',
      type: 'string',
      description: 'Solo si la URL no debe ser la de arriba. P. ej. /profesorado/claustro',
    },
    { name: 'summary', title: 'Resumen', type: 'text', rows: 3, description: 'Aparece en las tarjetas de los listados.' },
    { name: 'image', title: 'Imagen principal', type: 'image' },
    { name: 'body', title: 'Contenido', type: 'blockContent' },
    {
      name: 'signup',
      title: 'Botón «Quiero apuntarme»',
      type: 'boolean',
      initialValue: false,
      description: 'Añade el botón que abre el formulario de inscripción.',
    },
    { name: 'status', title: 'Aviso destacado', type: 'string', description: 'P. ej. «Curso ya impartido en 2024».', hidden: onlyFor('course') },
    { name: 'finished', title: 'Curso finalizado', type: 'boolean', initialValue: false, hidden: onlyFor('course') },
    {
      name: 'facts',
      title: 'Datos prácticos',
      type: 'array',
      hidden: onlyFor('course'),
      of: [
        {
          type: 'object',
          name: 'fact',
          fields: [
            { name: 'label', title: 'Dato', type: 'string', description: 'Duración, Horario, Precio…' },
            { name: 'value', title: 'Valor', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
    },
    {
      name: 'teachers',
      title: 'Profesorado',
      type: 'array',
      hidden: onlyFor('course'),
      of: [{ type: 'reference', to: [{ type: 'teacher' }] }],
    },
    {
      name: 'items',
      title: 'Páginas que aparecen',
      type: 'array',
      hidden: onlyFor('listing'),
      of: [{ type: 'reference', to: [{ type: 'page' }] }],
    },
    {
      name: 'groups',
      title: 'Grupos que se muestran',
      type: 'array',
      hidden: onlyFor('team'),
      of: [{ type: 'string' }],
      options: {
        list: [
          { value: 'claustro', title: 'Claustro' },
          { value: 'invitadas', title: 'Estrellas invitadas' },
        ],
      },
    },
    { name: 'gallery', title: 'Galería', type: 'array', of: [{ type: 'image' }], options: { layout: 'grid' } },
  ],
  preview: { select: { title: 'title', subtitle: 'kicker', media: 'image' } },
}
