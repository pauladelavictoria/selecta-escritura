import blockContent from './blockContent.js'
import page from './page.js'
import teacher from './teacher.js'
import siteSettings from './siteSettings.js'
import home from './home.js'
import menu from './menu.js'

export const schemaTypes = [blockContent, page, teacher, siteSettings, home, menu]

// Documentos únicos: se editan, no se crean ni se borran.
export const singletons = [
  { id: 'siteSettings', type: 'siteSettings', title: 'Datos de contacto y textos' },
  { id: 'home', type: 'home', title: 'Portada' },
  { id: 'menu', type: 'menu', title: 'Menú principal' },
]
