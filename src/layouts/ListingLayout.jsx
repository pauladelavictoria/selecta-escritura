import PageLayout from './PageLayout'
import CardGrid from '../components/page/CardGrid'
import { getPagesBySlugs } from '../lib/content'

export default function ListingLayout({ page }) {
  return (
    <PageLayout page={page}>
      <CardGrid pages={getPagesBySlugs(page.items)} />
    </PageLayout>
  )
}
