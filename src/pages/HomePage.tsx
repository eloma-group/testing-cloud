import { Header }       from '../components/Header/Header'
import { Hero }         from '../components/home/Hero'
import { Services }     from '../components/home/Services'
import { Industries }   from '../components/home/Industries'
import { HowWeHelp }    from '../components/home/HowWeHelp'
import { BrandPromise } from '../components/home/BrandPromise'
import { AboutUs }      from '../components/home/AboutUs'
import { Omnichannel }  from '../components/home/Omnichannel'
import { Engagement }   from '../components/home/Engagement'
import { Footer }       from '../components/Footer'

export function HomePage() {
  return (
    <div style={{ overflowX: 'clip' }}>
      <Header />
      <main>
        <Hero />
        <Services />
        <Industries />
        <HowWeHelp />
        <BrandPromise />
        <AboutUs />
        <Omnichannel />
        <Engagement />
      </main>
      <Footer />
    </div>
  )
}
