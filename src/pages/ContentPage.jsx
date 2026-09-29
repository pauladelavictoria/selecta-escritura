import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getPageByPath, site } from '../lib/content'
import { layouts } from '../layouts'
import NotFound from './NotFound'

export default function ContentPage() {
  const { pathname } = useLocation()
  const page = getPageByPath(pathname)

  useEffect(() => {
    document.title = page ? `${page.title} | ${site.title}` : site.title
  }, [page])

  if (!page) return <NotFound />
  const Layout = layouts[page.layout] ?? layouts.page
  return <Layout page={page} />
}
