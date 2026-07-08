import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import './index.css'
import App from './App.tsx'

/* ── Lenis premium smooth scroll ── */
const lenis = new Lenis({
  duration: 0.9,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  touchMultiplier: 1.5,
})

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

;(window as unknown as Record<string, unknown>).__lenis = lenis

/* ── Anchor link smooth scroll (works with Lenis) ── */
document.addEventListener('click', (e) => {
  const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
  if (!anchor) return
  const id = anchor.getAttribute('href')?.slice(1)
  if (!id) return
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  lenis.scrollTo(el, { offset: -64, duration: 1.4 })
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
