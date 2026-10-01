import Icon from '../ui/Icon'
import SmartLink from '../ui/SmartLink'
import styles from './NavMenu.module.css'

function NavItem({ item, depth }) {
  const hasChildren = Boolean(item.children?.length)
  const content = (
    <>
      {item.label}
      {hasChildren && <Icon name="chevron" size={depth === 0 ? 16 : 14} />}
    </>
  )
  return (
    <li className={styles.item}>
      {item.href ? (
        <SmartLink href={item.href} className={styles.link}>
          {content}
        </SmartLink>
      ) : (
        <button type="button" className={styles.link}>
          {content}
        </button>
      )}
      {hasChildren && (
        <ul className={styles.submenu}>
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
    <nav className={`${styles.nav}${open ? ` ${styles.open}` : ''}`} aria-label="Principal">
      <ul className={styles.list}>
        {items.map((item) => (
          <NavItem key={item.label} item={item} depth={0} />
        ))}
      </ul>
    </nav>
  )
}
