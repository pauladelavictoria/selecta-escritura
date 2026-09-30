import { home } from '../../lib/content'

const { intro } = home

export default function Intro() {
  return (
    <section id="abajo" className="intro textured">
      <div className="container intro__inner">
        <h3>{intro.lead}</h3>
        <h1>{intro.title}</h1>
      </div>
    </section>
  )
}
