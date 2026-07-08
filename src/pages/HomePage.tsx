import { Header }       from '../components/Header/Header'
import { Hero }         from '../components/home/Hero'
import { Services }     from '../components/home/Services'
import { HowWeHelp }    from '../components/home/HowWeHelp'
import { BrandPromise } from '../components/home/BrandPromise'
import { AboutUs }      from '../components/home/AboutUs'
import { Footer }       from '../components/Footer'

export function HomePage() {
  return (
    <div style={{ overflowX: 'clip' }}>
      <Header />
      <main>
        <Hero />
        <Services />
        <HowWeHelp />
        <BrandPromise />
        <AboutUs />
      </main>
      <Footer />
    </div>
  )
}
