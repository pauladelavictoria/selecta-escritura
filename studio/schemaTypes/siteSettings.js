const link = {
  type: 'object',
  name: 'link',
  fields: [
    { name: 'label', title: 'Texto', type: 'string' },
    { name: 'href', title: 'Enlace', type: 'string' },
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
}

export default {
  name: 'siteSettings',
  title: 'Datos de contacto y textos',
  type: 'document',
  fields: [
    { name: 'title', title: 'Nombre de la web', type: 'string' },
    { name: 'description', title: 'Descripción', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'phone', title: 'Teléfono (sin espacios)', type: 'string' },
    { name: 'phoneDisplay', title: 'Teléfono (como se muestra)', type: 'string' },
    { name: 'address', title: 'Dirección', type: 'string' },
    { name: 'mapsUrl', title: 'Enlace a Google Maps', type: 'string' },
    { name: 'instagram', title: 'Instagram', type: 'string' },
    { name: 'tagline', title: 'Frase de la portada', type: 'text', rows: 3 },
    { name: 'footerTagline', title: 'Frase del pie', type: 'text', rows: 3 },
    { name: 'legalLinks', title: 'Enlaces del pie', type: 'array', of: [link] },
  ],
}
