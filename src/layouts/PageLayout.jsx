import PageHero from '../components/page/PageHero'
import Gallery from '../components/page/Gallery'
import SignupButton from '../components/page/SignupButton'
import RichText from '../components/ui/RichText'
import styles from './PageLayout.module.css'

// Layout base: cabecera + imagen + texto + galería. El resto de layouts lo extienden con `children`.
export default function PageLayout({ page, children }) {
  return (
    <article>
      <PageHero kicker={page.kicker} title={page.title} />
      <div className={`container ${styles.content}`}>
        {page.image && <img className="page-image" src={page.image} alt="" />}
        <RichText value={page.body} />
        {page.signup && (
          <p className={styles.signup}>
            <SignupButton course={page.title} />
          </p>
        )}
        {children}
        <Gallery images={page.gallery} />
      </div>
    </article>
  )
}
