import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { navItems } from '../../data/navItems'
import { useScrollY } from '../../hooks/useScrollY'

const TEXT   = '#2E3A34'
const ACCENT = '#C6866B'

export function Header() {
  const scrollY = useScrollY()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isHome = pathname === '/'

  // Transparent while the hero (100vh) is still in view; solid cream after.
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
          background: transparent ? 'transparent' : 'rgba(244,241,235,0.94)',
          backdropFilter: transparent ? 'none' : 'blur(12px)',
          borderBottom: transparent ? '1px solid transparent' : '1px solid rgba(46,58,52,0.08)',
          transition: 'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
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
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
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
                background: ACCENT,
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
            <Link
              to="/contact"
              className="cc-hd-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 44,
                padding: '11px 26px',
                borderRadius: 999,
                background: ACCENT,
                color: '#fff',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                transition: 'transform 0.25s ease, background 0.25s ease',
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = '#b7775c'; el.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = ACCENT; el.style.transform = 'translateY(0)' }}
            >
              Get Started
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
          background: '#F4F1EB',
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
                borderBottom: '1px solid rgba(46,58,52,0.08)',
                fontSize: '17px',
                fontWeight: 500,
                fontFamily: "'Poppins', sans-serif",
                color: TEXT,
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setMobileOpen(false)}
            style={{
              marginTop: 28,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: 52,
              borderRadius: 999,
              background: ACCENT,
              color: '#fff',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
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
