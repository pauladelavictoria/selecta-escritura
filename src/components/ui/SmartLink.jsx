import { Link } from 'react-router-dom'

// Enlaces internos con el router; externos, mailto y tel como <a> normal.
export default function SmartLink({ href = '#', children, ...props }) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} {...props}>
        {children}
      </Link>
    )
  }
  const external = /^https?:/.test(href)
  return (
    <a href={href} {...(external && { target: '_blank', rel: 'noreferrer' })} {...props}>
      {children}
    </a>
  )
}
