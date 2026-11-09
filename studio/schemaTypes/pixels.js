// Códigos de seguimiento de las campañas (Meta, Google Ads, TikTok…). La web los carga
// solo después de que el visitante acepte las cookies en el aviso.
export default {
  name: 'pixels',
  title: 'Píxeles de publicidad',
  type: 'document',
  fields: [
    {
      name: 'items',
      title: 'Píxeles',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'pixel',
          fields: [
            { name: 'name', title: 'Nombre', type: 'string', description: 'Para reconocerlo, p. ej. «Meta – campaña otoño».' },
            {
              name: 'code',
              title: 'Código',
              type: 'text',
              rows: 12,
              description: 'Pega tal cual el código que da la plataforma (con sus etiquetas <script> y <noscript>).',
            },
            { name: 'active', title: 'Activo', type: 'boolean', initialValue: true },
          ],
          preview: {
            select: { title: 'name', active: 'active' },
            prepare: ({ title, active }) => ({ title, subtitle: active ? 'Activo' : 'Desactivado' }),
          },
        },
      ],
    },
  ],
}
