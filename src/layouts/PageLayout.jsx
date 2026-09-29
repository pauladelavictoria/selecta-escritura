import PageHero from '../components/page/PageHero'
import Gallery from '../components/page/Gallery'
import Markdown from '../components/ui/Markdown'

// Layout base: cabecera + imagen + texto + galería. El resto de layouts lo extienden con `children`.
export default function PageLayout({ page, children, showImage = true }) {
  return (
    <article className="page">
      <PageHero kicker={page.kicker} title={page.title} />
      <div className="container page__content">
        {showImage && page.image && <img className="page__image" src={page.image} alt="" />}
        <Markdown>{page.body}</Markdown>
        {children}
        <Gallery images={page.gallery} />
      </div>
    </article>
  )
}
