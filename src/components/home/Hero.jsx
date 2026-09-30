import { site } from '../../lib/content'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__stage">
        <div className="hero__bubble">
          <h5>{site.tagline}</h5>
        </div>
      </div>
      <div className="hero__brand">
        <img src="/images/logo-selectaescritura-black.svg" alt="Selecta Escritura" />
      </div>
    </section>
  )
}
