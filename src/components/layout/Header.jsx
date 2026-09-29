import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import NavMenu from './NavMenu'
import Icon from '../ui/Icon'
import { menu } from '../../lib/content'

export default function Header() {
  const { pathname } = useLocation()
  // Se guarda la ruta en la que se abrió el menú: al navegar deja de coincidir y se cierra solo.
  const [openAt, setOpenAt] = useState(null)
  const menuOpen = openAt === pathname

  // Al navegar, quita el foco que mantiene abiertos los submenús.
  useEffect(() => {
    document.activeElement?.blur()
  }, [pathname])

  return (
    <header className="site-header">
      <TopBar />
      <div className="container header__main">
        <Link to="/" className="header__logo">
          <img src="/images/logo-selectaescritura-color.svg" alt="Selecta Escritura" />
        </Link>
        <button
          className="header__toggle"
          onClick={() => setOpenAt(menuOpen ? null : pathname)}
          aria-expanded={menuOpen}
          aria-label="Menú"
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={28} />
        </button>
        <NavMenu items={menu} open={menuOpen} />
      </div>
    </header>
  )
}
