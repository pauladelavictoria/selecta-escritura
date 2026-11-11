// Evento «Lead» de Meta en las páginas indicadas. Se lanza solo cuando Netlify confirma
// que ha recibido la solicitud, y una sola vez por navegador y página, para contar
// solicitudes reales. Si el visitante rechazó las cookies, el píxel no está cargado y no se envía nada.
const LEAD_PAGES = ['/proyecto-con-almudena-sanchez']

export function trackLead(pathname) {
  const path = '/' + pathname.replace(/^\/+|\/+$/g, '')
  if (!LEAD_PAGES.includes(path) || typeof window.fbq !== 'function') return
  const key = `lead:${path}`
  try {
    if (localStorage.getItem(key)) return
    localStorage.setItem(key, '1')
  } catch {
    // Sin localStorage (modo privado estricto) se cuenta igualmente.
  }
  window.fbq('track', 'Lead')
}
