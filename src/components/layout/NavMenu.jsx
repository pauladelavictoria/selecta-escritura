import Icon from '../ui/Icon'
import SmartLink from '../ui/SmartLink'

function NavItem({ item, depth }) {
  const hasChildren = Boolean(item.children?.length)
  const content = (
    <>
      {item.label}
      {hasChildren && <Icon name="chevron" size={depth === 0 ? 16 : 14} />}
    </>
  )
  return (
    <li className={`nav__item${hasChildren ? ' has-children' : ''}`}>
      {item.href ? (
        <SmartLink href={item.href} className="nav__link">
          {content}
        </SmartLink>
      ) : (
        <button type="button" className="nav__link">
          {content}
        </button>
      )}
      {hasChildren && (
        <ul className="nav__submenu">
          {item.children.map((child) => (
            <NavItem key={child.label + child.href} item={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function NavMenu({ items, open }) {
  return (
    <nav className={`nav${open ? ' is-open' : ''}`} aria-label="Principal">
      <ul className="nav__list">
        {items.map((item) => (
          <NavItem key={item.label} item={item} depth={0} />
        ))}
      </ul>
    </nav>
  )
}
