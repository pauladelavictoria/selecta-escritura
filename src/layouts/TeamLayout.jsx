import PageLayout from './PageLayout'
import TeacherGrid from '../components/page/TeacherGrid'
import { getTeachersByGroup } from '../lib/content'

const groupTitles = { claustro: 'Claustro', invitadas: 'Estrellas invitadas' }

export default function TeamLayout({ page }) {
  const groups = page.groups ?? []
  return (
    <PageLayout page={page}>
      {groups.map((group) => (
        <TeacherGrid
          key={group}
          teachers={getTeachersByGroup(group)}
          title={groups.length > 1 ? groupTitles[group] : undefined}
        />
      ))}
    </PageLayout>
  )
}
