import TeacherCard from './TeacherCard'

export default function TeacherGrid({ teachers, title }) {
  if (!teachers.length) return null
  return (
    <section className="teacher-grid">
      {title && <h2>{title}</h2>}
      {teachers.map((teacher) => (
        <TeacherCard key={teacher.slug} teacher={teacher} />
      ))}
    </section>
  )
}
