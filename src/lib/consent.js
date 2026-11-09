// Respuesta del visitante al aviso de cookies, guardada en su navegador.
const KEY = 'consentimiento-cookies'

export function readConsent() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function saveConsent(value) {
  try {
    localStorage.setItem(KEY, value)
  } catch {
    // Sin almacenamiento, el aviso volverá a salir en la próxima visita.
  }
}

// Recargar descarta los píxeles ya cargados si ahora se rechazan.
export function resetConsent() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Nada que borrar.
  }
  location.reload()
}
