// Texto con formato del editor visual. Sin dependencias de `sanity` para que el script de migración pueda importarlo.
export default {
  name: 'blockContent',
  title: 'Contenido',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Párrafo', value: 'normal' },
        { title: 'Título', value: 'h2' },
        { title: 'Subtítulo', value: 'h3' },
        { title: 'Título pequeño', value: 'h4' },
      ],
      lists: [
        { title: 'Lista', value: 'bullet' },
        { title: 'Lista numerada', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Negrita', value: 'strong' },
          { title: 'Cursiva', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'Enlace',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: 'Dirección',
                type: 'url',
                description: 'Una web completa (https://…) o una página de esta web (/talleres).',
                validation: (rule) => rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
              },
            ],
          },
        ],
      },
    },
    { type: 'image', title: 'Imagen' },
  ],
}
