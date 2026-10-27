export default {
  name: 'home',
  title: 'Portada',
  type: 'document',
  fields: [
    {
      name: 'intro',
      title: 'Introducción',
      type: 'object',
      fields: [
        { name: 'lead', title: 'Texto', type: 'text', rows: 4 },
        { name: 'title', title: 'Título', type: 'string' },
      ],
    },
    {
      name: 'discover',
      title: 'Estantería de libros',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'book',
          fields: [
            { name: 'label', title: 'Título del lomo', type: 'string' },
            { name: 'href', title: 'Enlace', type: 'string' },
            { name: 'image', title: 'Imagen', type: 'image', description: 'Actualmente no se muestra en la estantería.' },
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    },
    {
      name: 'callouts',
      title: 'Bloques destacados',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'callout',
          fields: [
            { name: 'title', title: 'Título', type: 'string' },
            { name: 'text', title: 'Frase', type: 'string' },
            { name: 'href', title: 'Enlace', type: 'string' },
            {
              name: 'icon',
              title: 'Icono',
              type: 'string',
              options: {
                list: [
                  { value: 'gift', title: 'Regalo' },
                  { value: 'heart', title: 'Corazón' },
                  { value: 'book', title: 'Libro' },
                ],
              },
            },
          ],
          preview: { select: { title: 'title', subtitle: 'text' } },
        },
      ],
    },
  ],
}
