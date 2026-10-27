// Tres niveles como máximo, igual que el menú de la web.
const entry = (level) => ({
  type: 'object',
  name: `menuItem${level}`,
  title: 'Entrada',
  fields: [
    { name: 'label', title: 'Texto', type: 'string' },
    { name: 'href', title: 'Enlace', type: 'string' },
    ...(level < 3 ? [{ name: 'children', title: 'Submenú', type: 'array', of: [entry(level + 1)] }] : []),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
})

export default {
  name: 'menu',
  title: 'Menú principal',
  type: 'document',
  fields: [{ name: 'items', title: 'Entradas', type: 'array', of: [entry(1)] }],
}
