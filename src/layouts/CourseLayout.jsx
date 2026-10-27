import PageHero from '../components/page/PageHero'
import FactList from '../components/page/FactList'
import TeacherGrid from '../components/page/TeacherGrid'
import SignupButton from '../components/page/SignupButton'
import Gallery from '../components/page/Gallery'
import RichText from '../components/ui/RichText'
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
          <RichText value={page.body} />
          <Gallery images={page.gallery} />
          <TeacherGrid teachers={teachers} title={teachers.length > 1 ? 'Profesorado' : 'Imparte'} />
        </div>
        <aside className={styles.aside}>
          <div className={styles.box}>
            {page.status && <p className={styles.status}>{page.status}</p>}
            <FactList facts={page.facts} />
            <SignupButton course={page.title} label={page.finished ? 'Avísame de la próxima edición' : undefined} />
          </div>
        </aside>
      </div>
    </article>
  )
}
