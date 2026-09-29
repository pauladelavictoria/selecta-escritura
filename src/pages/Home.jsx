import { useEffect } from 'react'
import Hero from '../components/home/Hero'
import Intro from '../components/home/Intro'
import DiscoverGrid from '../components/home/DiscoverGrid'
import Callouts from '../components/home/Callouts'
import { site } from '../lib/content'

export default function Home() {
  useEffect(() => {
    document.title = `${site.title} | Escuela de escritura en Valencia`
  }, [])

  return (
    <>
      <Hero />
      <Intro />
      <DiscoverGrid />
      <Callouts />
    </>
  )
}
