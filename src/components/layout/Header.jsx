import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ContactIcons from './ContactIcons'
import NavMenu from './NavMenu'
import Icon from '../ui/Icon'
import { menu } from '../../lib/content'
import styles from './Header.module.css'

// En la portada la cabecera flota transparente sobre la foto solo mientras no se ha hecho scroll.
function useOverHero(enabled) {
  const sentinel = useRef(null)
  const [overHero, setOverHero] = useState(enabled)
  useEffect(() => {
    if (!enabled || !sentinel.current) return setOverHero(false)
    const observer = new IntersectionObserver(([entry]) => setOverHero(entry.isIntersecting))
    observer.observe(sentinel.current)
    return () => observer.disconnect()
  }, [enabled])
  return [sentinel, overHero]
}

export default function Header() {
  const { pathname } = useLocation()
  // Se guarda la ruta en la que se abrió el menú: al navegar deja de coincidir y se cierra solo.
  const [openAt, setOpenAt] = useState(null)
  const menuOpen = openAt === pathname
  const isHome = pathname === '/'
  const [sentinel, overHero] = useOverHero(isHome)
  const transparent = overHero && !menuOpen

  // Al navegar, quita el foco que mantiene abiertos los submenús.
  useEffect(() => {
    document.activeElement?.blur()
  }, [pathname])

  const classes = [styles.header, isHome && styles.overlay, transparent && styles.transparent].filter(Boolean).join(' ')

  return (
    <>
      {isHome && <div ref={sentinel} className={styles.sentinel} aria-hidden="true" />}
      <header className={classes}>
        <div className={`container ${styles.main}`}>
          <Link to="/" className={styles.logo}>
            <img
              src={transparent ? '/images/logo-selectaescritura-white.svg' : '/images/logo-selectaescritura-color.svg'}
              alt="Selecta Escritura"
            />
          </Link>
          <NavMenu items={menu} open={menuOpen} />
          <ContactIcons />
          <button
            className={styles.toggle}
            onClick={() => setOpenAt(menuOpen ? null : pathname)}
            aria-expanded={menuOpen}
            aria-label="Menú"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={26} />
          </button>
        </div>
      </header>
    </>
  )
}
