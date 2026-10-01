import PageHero from '../components/page/PageHero'
import FactList from '../components/page/FactList'
import TeacherGrid from '../components/page/TeacherGrid'
import ContactButton from '../components/page/ContactButton'
import Gallery from '../components/page/Gallery'
import Markdown from '../components/ui/Markdown'
import { getTeachersBySlugs } from '../lib/content'
import styles from './CourseLayout.module.css'

export default function CourseLayout({ page }) {
  const teachers = getTeachersBySlugs(page.teachers)
  return (
    <article>
      <PageHero kicker={page.kicker ?? 'Taller'} title={page.title} />
      <div className={`container ${styles.course}`}>
        <div>
          {page.image && <img className="page-image" src={page.image} alt="" />}
          <Markdown>{page.body}</Markdown>
          <Gallery images={page.gallery} />
          <TeacherGrid teachers={teachers} title={teachers.length > 1 ? 'Profesorado' : 'Imparte'} />
        </div>
        <aside className={styles.aside}>
          <div className={styles.box}>
            {page.status && <p className={styles.status}>{page.status}</p>}
            <FactList facts={page.facts} />
            <ContactButton subject={page.title} label={page.finished ? 'Avísame de la próxima edición' : 'Quiero apuntarme'} />
          </div>
        </aside>
      </div>
    </article>
  )
}
