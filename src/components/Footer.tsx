import { Phone, Mail, MapPin } from 'lucide-react'

const DARK   = '#3E4A42'
const ACCENT = '#C6866B'

type FooterCol = { heading: string; links: { label: string; href: string }[] }
const COLS: FooterCol[] = [
  {
    heading: 'Company',
    links: [
      { label: 'About',    href: '/#about'    },
      { label: 'Services', href: '/#services' },
      { label: 'Team',     href: '/#about'     },
      { label: 'Careers',  href: '/contact'  },
    ],
  },
  {
    heading: 'Solutions',
    links: [
      { label: 'Inbound Support', href: '/#services' },
      { label: 'Outbound Sales',  href: '/#services' },
      { label: 'Live Chat',       href: '/#services' },
      { label: 'Back Office',     href: '/#services' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Blog',        href: '/#industries'    },
      { label: 'Case Studies', href: '/#industries'   },
      { label: 'Contact',     href: '/contact' },
      { label: 'Support',     href: '/contact' },
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
    <a
      href={href}
      style={{
        fontSize: 14,
        color: 'rgba(255,255,255,0.55)',
        transition: 'color 0.18s ease, padding-left 0.18s ease',
        display: 'block',
      }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = '#fff'; el.style.paddingLeft = '5px' }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(255,255,255,0.55)'; el.style.paddingLeft = '0' }}
    >
      {label}
    </a>
  )
}

export function Footer() {
  return (
    <footer id="contact" style={{ background: DARK, position: 'relative', overflow: 'hidden' }}>
      {/* soft accent glow, top-center */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: 300,
        background: `radial-gradient(ellipse at top, ${ACCENT}18 0%, transparent 65%)`,
        pointerEvents: 'none', zIndex: 0,
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
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT }} />
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 22, color: '#fff', letterSpacing: '-0.01em' }}>
                  Nexa
                </span>
              </div>

              <h2 style={{
                fontFamily: "'Poppins', sans-serif", fontWeight: 600,
                fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.05, letterSpacing: '-0.02em',
                color: '#fff', margin: '0 0 18px', maxWidth: 12 + 'ch',
              }}>
                Stay in touch.
              </h2>

              <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, maxWidth: 320, margin: '0 0 26px' }}>
                A customer support collective helping brands deliver reliable,
                human service - around the clock, built to scale.
              </p>

              {/* Contact details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 26 }}>
                <a href="tel:1800000000" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  <Phone size={15} strokeWidth={1.6} style={{ color: ACCENT, flexShrink: 0 }} />
                  1800 000 000
                </a>
                <a href="mailto:hello@nexa.support" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  <Mail size={15} strokeWidth={1.6} style={{ color: ACCENT, flexShrink: 0 }} />
                  hello@nexa.support
                </a>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
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
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff',
                      transition: 'transform 0.2s ease, background 0.2s ease',
                    }}
                    onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = ACCENT; el.style.transform = 'translateY(-3px)' }}
                    onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.08)'; el.style.transform = 'translateY(0)' }}
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
            borderTop: '1px solid rgba(255,255,255,0.09)',
          }}>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.32)', margin: 0 }}>
              © {new Date().getFullYear()} Nexa. All rights reserved.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px,2vw,24px)', flexWrap: 'wrap' }}>
              {['Privacy Policy', 'Terms of Use'].map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.32)', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = ACCENT }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.32)' }}
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
