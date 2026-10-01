import Markdown from '../ui/Markdown'
import styles from './Teacher.module.css'

const initials = (name) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')

export default function TeacherCard({ teacher }) {
  return (
    <article className={styles.teacher}>
      <div className={styles.photo}>
        {teacher.photo ? <img src={teacher.photo} alt={teacher.name} loading="lazy" /> : <span>{initials(teacher.name)}</span>}
      </div>
      <div>
        <h3 className={styles.name}>{teacher.name}</h3>
        <Markdown>{teacher.body}</Markdown>
      </div>
    </article>
  )
}
