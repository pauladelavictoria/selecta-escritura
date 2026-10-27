export default {
  name: 'teacher',
  title: 'Profesor/a',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nombre', type: 'string', validation: (rule) => rule.required() },
    {
      name: 'slug',
      title: 'Identificador',
      type: 'slug',
      description: 'Pulsa «Generate» para crearlo a partir del nombre.',
      options: { source: 'name' },
      validation: (rule) => rule.required(),
    },
    { name: 'photo', title: 'Foto', type: 'image' },
    {
      name: 'groups',
      title: 'Aparece en',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { value: 'claustro', title: 'Claustro' },
          { value: 'invitadas', title: 'Estrellas invitadas' },
        ],
      },
    },
    { name: 'order', title: 'Orden', type: 'number', initialValue: 50, description: 'Los números más bajos salen antes.' },
    { name: 'body', title: 'Biografía', type: 'blockContent' },
  ],
  orderings: [{ title: 'Orden', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', media: 'photo' } },
}
