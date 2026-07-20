import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'

const ACCENT = '#998EFF'
const ACCENT_GLOSS = 'linear-gradient(168deg, #C3BCFF 0%, #998EFF 46%, #4A3DBF 100%)'

/* Deep indigo - deliberately not #000.

   A pure black under a violet accent flattens it: there is no hue in the
   surface for the accent to relate to, so the violet sits on top of the black
   rather than glowing out of it. #14111F carries a trace of the same hue, and
   that is what lets the bloom at the seam read as light.

   Everything else follows the reference: surfaces sit only a few points above
   the base (#211C33 on #14111F), and every division is a #2F2A42 hairline
   rather than a shadow. */
const INK     = '#14111F'   // the base
const SURFACE = '#211C33'   // a raised surface - only just lighter, on purpose
const LINE    = '#2F2A42'   // every hairline in here

const DARK_GLOSS = 'linear-gradient(180deg, #211C33 0%, #191527 46%, #14111F 100%)'
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.32'/%3E%3C/svg%3E\")"

/* type on ink, straight off the reference: white, then two greys */
const LINK  = '#BDBDBD'
const QUIET = '#858387'

type FooterCol = { heading: string; links: { label: string; href: string }[] }
const COLS: FooterCol[] = [
  {
    heading: 'Company',
    links: [
      { label: 'About',    href: '/about'    },
      { label: 'Team',     href: '/team'     },
      { label: 'Careers',  href: '/careers'  },
      { label: 'Contact',  href: '/contact'  },
    ],
  },
  {
    heading: 'Solutions',
    links: [
      { label: 'Inbound Support', href: '/services#inbound-voice'   },
      { label: 'Outbound Sales',  href: '/services#outbound-sales'  },
      { label: 'Live Chat',       href: '/services#live-chat-email' },
      { label: 'Back Office',     href: '/services#back-office'     },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Blog',         href: '/blog'         },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Industries',   href: '/industries'   },
      { label: 'Pricing',      href: '/solutions#pricing' },
    ],
  },
]

/* ── Inline brand SVGs ── */
function IconLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  )
}
function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

const socials = [
  { Icon: IconLinkedIn,  href: '#', label: 'LinkedIn'  },
  { Icon: IconInstagram, href: '#', label: 'Instagram' },
  { Icon: IconFacebook,  href: '#', label: 'Facebook'  },
]

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      to={href}
      style={{
        fontSize: 14,
        color: LINK,
        transition: 'color 0.18s ease, padding-left 0.18s ease',
        display: 'block',
      }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = '#fff'; el.style.paddingLeft = '5px' }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = LINK; el.style.paddingLeft = '0' }}
    >
      {label}
    </Link>
  )
}

export function Footer() {
  return (
    <footer
      id="contact"
      style={{
        background: DARK_GLOSS,
        backgroundColor: INK,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* The one place the accent gets to be a gradient over a large area:
          a soft bloom at the seam, so the violet reads as light falling
          into the black rather than as paint sitting on it. */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '68%', height: 340,
        background: `radial-gradient(ellipse at top, rgba(153,142,255,0.20) 0%, transparent 66%)`,
        pointerEvents: 'none', zIndex: 0,
      }} />
      {/* grain film - keeps the ink gradient from banding into visible steps */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: GRAIN, backgroundSize: '140px 140px',
        opacity: 0.04, mixBlendMode: 'overlay',
        pointerEvents: 'none', zIndex: 0,
      }} />
      {/* the seam where the wash above meets the ink - an edge, not a colour change */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      <div style={{ padding: 'clamp(56px,7vw,110px) clamp(24px,4vw,64px) 0', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1760, margin: '0 auto' }}>

          <div
            className="cc-ft-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
              gap: 'clamp(32px,4vw,64px)',
              paddingBottom: 'clamp(48px,6vw,88px)',
              alignItems: 'start',
            }}
          >
            {/* Brand / stay in touch */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: 'radial-gradient(circle at 32% 28%, #D6D0FF, #998EFF 58%, #4A3DBF)',
                  boxShadow: '0 0 14px rgba(153,142,255,0.55)',
                }} />
                <span style={{ fontFamily: "'Universal Sans', sans-serif", fontSize: 22, color: '#fff', letterSpacing: '-0.01em' }}>
                  Nexa
                </span>
              </div>

              <h2 style={{
                fontFamily: "'Universal Sans', sans-serif",
                fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.05, letterSpacing: '-0.02em',
                color: '#fff', margin: '0 0 18px', maxWidth: 12 + 'ch',
              }}>
                Stay in touch.
              </h2>

              <p style={{ fontSize: 14.5, color: LINK, lineHeight: 1.8, maxWidth: 320, margin: '0 0 26px' }}>
                A customer support collective helping brands deliver reliable,
                human service - around the clock, built to scale.
              </p>

              {/* Contact details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 26 }}>
                <a href="tel:1800054555" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, color: LINK }}>
                  <Phone size={15} strokeWidth={1.6} style={{ color: ACCENT, flexShrink: 0 }} />
                  1800 054 555
                </a>
                <a href="mailto:hello@nexa.support" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, color: LINK }}>
                  <Mail size={15} strokeWidth={1.6} style={{ color: ACCENT, flexShrink: 0 }} />
                  hello@nexa.support
                </a>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, color: LINK }}>
                  <MapPin size={15} strokeWidth={1.6} style={{ color: ACCENT, flexShrink: 0 }} />
                  Melbourne, Australia
                </span>
              </div>

              {/* Socials */}
              <div style={{ display: 'flex', gap: 10 }}>
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    style={{
                      width: 40, height: 40, borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: SURFACE,
                      boxShadow: `inset 0 0 0 1px ${LINE}`,
                      color: '#FFFFFF',
                      transition: 'transform 0.25s cubic-bezier(.16,1,.3,1), background 0.25s ease, box-shadow 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = ACCENT_GLOSS
                      el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.4), 0 10px 24px -10px rgba(153,142,255,0.7)'
                      el.style.transform = 'translateY(-3px)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = SURFACE
                      el.style.boxShadow = `inset 0 0 0 1px ${LINE}`
                      el.style.transform = 'translateY(0)'
                    }}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {COLS.map((col) => (
              <div key={col.heading}>
                <h3 style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase',
                  color: ACCENT, margin: '0 0 20px',
                }}>
                  {col.heading}
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 13, margin: 0, padding: 0 }}>
                  {col.links.map((item) => (
                    <li key={item.label}><FooterLink label={item.label} href={item.href} /></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{
            padding: 'clamp(18px,2.5vw,26px) 0 clamp(24px,3vw,36px)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 14,
            borderTop: `1px solid ${LINE}`,
          }}>
            <p style={{ fontSize: 12.5, color: QUIET, margin: 0 }}>
              © {new Date().getFullYear()} Nexa. All rights reserved.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px,2vw,24px)', flexWrap: 'wrap' }}>
              {['Privacy Policy', 'Terms of Use'].map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{ fontSize: 12.5, color: QUIET, transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = ACCENT }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = QUIET }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .cc-ft-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 520px) { .cc-ft-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 2560px) { .cc-ft-grid { max-width: 2400px; } }
      `}</style>
    </footer>
  )
}
