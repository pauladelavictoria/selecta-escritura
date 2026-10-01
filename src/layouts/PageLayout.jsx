import PageHero from '../components/page/PageHero'
import Gallery from '../components/page/Gallery'
import Markdown from '../components/ui/Markdown'
import styles from './PageLayout.module.css'

// Layout base: cabecera + imagen + texto + galería. El resto de layouts lo extienden con `children`.
export default function PageLayout({ page, children, showImage = true }) {
  return (
    <article>
      <PageHero kicker={page.kicker} title={page.title} />
      <div className={`container ${styles.content}`}>
        {showImage && page.image && <img className="page-image" src={page.image} alt="" />}
        <Markdown>{page.body}</Markdown>
        {children}
        <Gallery images={page.gallery} />
      </div>
    </article>
  )
}
