import { useEffect, useRef } from 'react'

// lottie-web se carga bajo demanda para no engordar el bundle inicial.
export default function LottieAnimation({ src, className }) {
  const container = useRef(null)

  useEffect(() => {
    let animation
    let cancelled = false
    import('lottie-web/build/player/lottie_light').then(({ default: lottie }) => {
      if (cancelled) return
      animation = lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: src,
      })
    })
    return () => {
      cancelled = true
      animation?.destroy()
    }
  }, [src])

  return <div ref={container} className={className} />
}
