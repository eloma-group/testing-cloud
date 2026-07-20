import { Header }       from '../components/Header/Header'
import { Hero }         from '../components/home/Hero'
/// import { Services }     from '../components/home/Services'
import { RealPeople }   from '../components/home/RealPeople'
import { Switchboard }  from '../components/services/Switchboard'
import { Industries }   from '../components/home/Industries'
import { ExtendedBenchHero } from '../components/home/ExtendedBenchHero'
// import { HowWeHelp }    from '../components/home/HowWeHelp'
import { AboutUs }      from '../components/home/AboutUs'
import { LiveDashboard } from '../components/home/LiveDashboard'
import { Omnichannel }  from '../components/home/Omnichannel'
import { OurTeam }      from '../components/home/OurTeam'
import { Spotlight }    from '../components/home/Spotlight'
import { Engagement }   from '../components/home/Engagement'
import { Footer }       from '../components/Footer'

export function HomePage() {
  return (
    <div style={{ overflowX: 'clip' }}>
      <Header />
      <main>
        <Hero />
        <RealPeople />
        {/* <Services /> */}
        <Switchboard />
        <Industries />
        {/* <HowWeHelp /> */}
        <ExtendedBenchHero />
        <AboutUs />
        <LiveDashboard />
        <Spotlight />
        <Omnichannel />
        <OurTeam />
        <Engagement />
      </main>
      <Footer />
    </div>
  )
}
