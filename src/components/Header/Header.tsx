import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { navItems } from '../../data/navItems'
import { useScrollY } from '../../hooks/useScrollY'

const TEXT = '#16141F'
const ACCENT = '#998EFF'

/* the one number on the site - a call centre that hides its phone number is a joke */
const TEL = '1800 054 555'
const TEL_HREF = 'tel:1800054555'

/* the glossy violet the whole site's buttons wear */
const GLOSS       = 'linear-gradient(168deg, #C3BCFF 0%, #998EFF 48%, #4A3DBF 100%)'
const ACCENT_RIM  = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(40,32,100,0.3)'
const ACCENT_CAST = '0 2px 4px rgba(74,61,191,0.34), 0 12px 24px -10px rgba(74,61,191,0.5), 0 30px 54px -26px rgba(74,61,191,0.62)'

/* The phone pill wears the CTA's shape in the site's light surface instead of
   the violet: same height, same radius, same lift on hover, so the two read as
   a pair - one primary, one quiet - rather than as two unrelated controls.
   Two skins, because over the dark hero a white pane would be a slab. */
const PANE        = 'linear-gradient(168deg, #FFFFFF 0%, #FAF9FE 55%, #F0EDFC 100%)'
const PANE_RIM    = 'inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.09), 0 1px 2px rgba(26,22,44,0.05), 0 8px 20px -12px rgba(26,22,44,0.16)'
const PANE_RIM_HI = 'inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(153,142,255,0.45), 0 1px 3px rgba(26,22,44,0.06), 0 14px 28px -14px rgba(74,61,191,0.34)'
const GLASS_BG    = 'rgba(255,255,255,0.13)'
const GLASS_RIM   = 'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 0 0 1px rgba(255,255,255,0.26)'
const GLASS_RIM_HI = 'inset 0 1px 0 rgba(255,255,255,0.34), inset 0 0 0 1px rgba(255,255,255,0.5), 0 10px 24px -12px rgba(0,0,0,0.45)'

export function Header() {
  const scrollY = useScrollY()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isHome = pathname === '/'

  // Transparent while the hero (100vh) is still in view; solid white after.
  /* only the home page has a dark hero for the header to sit over */
  const overHero =
    isHome && scrollY < (typeof window !== 'undefined' ? window.innerHeight - 64 : 700)
  const transparent = overHero && !mobileOpen

  const textColor = transparent ? '#ffffff' : TEXT

  return (
    <>
      <header
        className="cc-hd"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          /* White glass, not a tinted slab. The page under it is white now, so a
             tinted bar would read as a stripe rather than as the page continuing. */
          background: transparent
            ? 'transparent'
            : 'rgba(255,255,255,0.82)',
          backdropFilter: transparent ? 'none' : 'blur(16px) saturate(1.5)',
          WebkitBackdropFilter: transparent ? 'none' : 'blur(16px) saturate(1.5)',
          boxShadow: transparent
            ? 'none'
            : '0 1px 0 rgba(26,22,44,0.07)',
          transition: 'background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease',
        }}
      >
        <div
          className="cc-hd-inner"
          style={{
            width: '100%',
            margin: '0 auto',
            padding: '0 clamp(24px, 4vw, 64px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Wordmark */}
          <Link
            to="/"
            className="cc-hd-word"
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: "'Universal Sans', sans-serif",
              fontSize: 'clamp(18px, 1.6vw, 22px)',
              letterSpacing: '-0.01em',
              color: textColor,
              transition: 'color 0.25s ease',
            }}
          >
            <span
              aria-hidden
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 32% 28%, #D6D0FF, #998EFF 58%, #4A3DBF)',
                boxShadow: '0 1px 3px rgba(74,61,191,0.55)',
                flexShrink: 0,
              }}
            />
            Nexa
          </Link>

          {/* Desktop Nav */}
          <nav
            className="cc-desktop-nav"
            style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 12px)' }}
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="cc-hd-link"
                style={{
                  padding: '0 14px',
                  height: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '14.5px',
                  fontWeight: 500,
                  color: textColor,
                  letterSpacing: '0.1px',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.25s ease, opacity 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.6' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a
              href={TEL_HREF}
              className="cc-hd-tel"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 9,
                minHeight: 44,
                padding: '11px 20px',
                marginRight: 10,
                borderRadius: 999,
                background: transparent ? GLASS_BG : PANE,
                boxShadow: transparent ? GLASS_RIM : PANE_RIM,
                fontFamily: "'Universal Sans', sans-serif",
                fontSize: '14.5px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: textColor,
                whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums',
                transition: 'transform 0.35s cubic-bezier(.16,1,.3,1), box-shadow 0.35s ease, background 0.3s ease, color 0.25s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-2px)'
                el.style.boxShadow = transparent ? GLASS_RIM_HI : PANE_RIM_HI
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = transparent ? GLASS_RIM : PANE_RIM
              }}
            >
              <Phone size={15} strokeWidth={2} style={{ color: ACCENT, flexShrink: 0 }} aria-hidden />
              {TEL}
            </a>

            <Link
              to="/contact#write"
              className="cc-hd-cta gl-shine"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 44,
                padding: '11px 26px',
                borderRadius: 999,
                background: GLOSS,
                boxShadow: `${ACCENT_RIM}, ${ACCENT_CAST}`,
                color: '#fff',
                fontFamily: "'Universal Sans', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                transition: 'transform 0.35s cubic-bezier(.16,1,.3,1), box-shadow 0.35s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-2px)'
                el.style.boxShadow = `${ACCENT_RIM}, 0 14px 26px -10px rgba(74,61,191,0.6), 0 34px 60px -24px rgba(74,61,191,0.7)`
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = `${ACCENT_RIM}, ${ACCENT_CAST}`
              }}
            >
              <span>Get Started</span>
            </Link>

            {/* Hamburger - mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="cc-mobile-only"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: textColor,
                padding: '4px',
                display: 'none',
                minWidth: 44,
                minHeight: 44,
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.25s ease',
              }}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9FE 52%, #F4F2FD 100%)',
          zIndex: 49,
          overflowY: 'auto',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ padding: '16px 24px 64px' }}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '18px 0',
                borderBottom: '1px solid rgba(22,20,31,0.08)',
                fontSize: '17px',
                fontWeight: 500,
                fontFamily: "'Universal Sans', sans-serif",
                color: TEXT,
              }}
            >
              {item.label}
            </Link>
          ))}
          {/* the number the desktop bar carries, kept reachable once that bar collapses */}
          <a
            href={TEL_HREF}
            onClick={() => setMobileOpen(false)}
            style={{
              marginTop: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              minHeight: 52,
              fontFamily: "'Universal Sans', sans-serif",
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: TEXT,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <Phone size={18} strokeWidth={2} style={{ color: ACCENT, flexShrink: 0 }} aria-hidden />
            {TEL}
          </a>

          <Link
            to="/contact#write"
            onClick={() => setMobileOpen(false)}
            style={{
              marginTop: 8,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: 52,
              borderRadius: 999,
              background: GLOSS,
              boxShadow: `${ACCENT_RIM}, ${ACCENT_CAST}`,
              color: '#fff',
              fontFamily: "'Universal Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            Get Started
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cc-desktop-nav { display: none !important; }
          .cc-mobile-only { display: flex !important; }
        }
        /* Between 901 and 1180 the nav, the number and the CTA all fit only by
           crowding each other, so the number drops out of the bar - the drawer
           and the footer still carry it. */
        @media (max-width: 1180px) {
          .cc-hd-tel { display: none !important; }
        }
        @media (min-width: 901px) {
          .cc-mobile-only { display: none !important; }
          .cc-desktop-nav { display: flex !important; }
        }
        @media (min-width: 1920px) {
          .cc-hd { height: 78px !important; }
          .cc-hd-link { height: 78px !important; font-size: 16.5px !important; }
        }
        @media (min-width: 2560px) {
          .cc-hd { height: 92px !important; }
          .cc-hd-link { height: 92px !important; font-size: 19px !important; }
        }
      `}</style>
    </>
  )
}
