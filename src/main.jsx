import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource-variable/newsreader/opsz-italic.css'
import '@fontsource-variable/geist/wght.css'
import './styles/tokens.css'
import './styles/base.css'
import { loadContent } from './lib/content'

// Los componentes leen el contenido al importarse, así que App se carga cuando ya ha llegado de Sanity.
await loadContent()
const { default: App } = await import('./App.jsx')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
