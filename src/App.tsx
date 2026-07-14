import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HomePage }        from './pages/HomePage'
import { AboutPage }       from './pages/AboutPage'
import { ServicesPage }    from './pages/ServicesPage'
import { SolutionsPage }   from './pages/SolutionsPage'
import { IndustriesPage }  from './pages/IndustriesPage'
import { BlogPage }        from './pages/BlogPage'
import { CaseStudiesPage } from './pages/CaseStudiesPage'
import { TeamPage }        from './pages/TeamPage'
import { CareersPage }     from './pages/CareersPage'
import { ContactPage }     from './pages/ContactPage'

type Lenis = {
  scrollTo: (target: number | string | HTMLElement, opts?: Record<string, unknown>) => void
}

/* Route changes land at the top of the new page; a hash on the URL
   (say /#services from another page) scrolls to that section instead.
   Both go through Lenis so the motion matches the rest of the site. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis

    if (!hash) {
      if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
      return
    }

    /* the target section may not be mounted on the first frame after a route change */
    let tries = 0
    const find = () => {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        if (lenis) lenis.scrollTo(el, { offset: -64, duration: 1.2 })
        else el.scrollIntoView()
        return
      }
      if (tries++ < 20) requestAnimationFrame(find)
    }
    requestAnimationFrame(find)
  }, [pathname, hash])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route path="/"             element={<HomePage />} />
        <Route path="/about"        element={<AboutPage />} />
        <Route path="/services"     element={<ServicesPage />} />
        <Route path="/solutions"    element={<SolutionsPage />} />
        <Route path="/industries"   element={<IndustriesPage />} />
        <Route path="/blog"         element={<BlogPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/team"         element={<TeamPage />} />
        <Route path="/careers"      element={<CareersPage />} />
        <Route path="/contact"      element={<ContactPage />} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
