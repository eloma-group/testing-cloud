import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Header } from '../Header/Header'
import { Footer } from '../Footer'
import { MaskReveal, staggerParent, fadeUp, VIEWPORT, EASE } from '../../lib/anim'

/* ──────────────────────────────────────────────────────────────
   The kit every inner page is cut from.

   One hero, one band system, one closing call. The home page earns
   its variety by being the front door; the inner pages earn theirs
   by being obviously the same building. So the frame is shared and
   fixed here, and each page spends its invention inside it - on the
   figure that sits beside the hero, and on the shape of its own
   middle. Nothing below hardcodes a colour that is not in the
   palette, and nothing animates a property that is not transform
   or opacity.
   ────────────────────────────────────────────────────────────── */

const TEXT       = '#2E3A34'
const ACCENT     = '#D2704A'
const ACCENT_INK = '#A85434'   /* text-safe on white (5.3:1) - eyebrows, links, small labels */
const CREAM      = '#F6F2EA'
const MUTED      = '#63706A'
const INK        = '#0F0F10'

const GLOSS       = 'linear-gradient(168deg, #F09A72 0%, #D2704A 48%, #9C4324 100%)'
const ACCENT_RIM  = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(84,34,16,0.3)'
const ACCENT_CAST = '0 2px 4px rgba(156,67,36,0.34), 0 12px 24px -10px rgba(156,67,36,0.5), 0 30px 54px -26px rgba(156,67,36,0.62)'

/* ══════════════════ the shared stylesheet ══════════════════ */
const KIT_CSS = `
  .pg { position: relative; isolation: isolate; overflow: clip; color: ${TEXT}; }

  /* the inner rail every band shares - wide, with a thin bezel */
  .pg-in { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }
  @media (min-width: 1920px) { .pg-in { max-width: 1900px; } }
  @media (min-width: 2560px) { .pg-in { max-width: 2400px; } }

  /* ── bands ── */
  .pg-band {
    position: relative; isolation: isolate;
    padding: clamp(56px, 7vw, 124px) clamp(24px, 4vw, 64px);
  }
  .pg-band.paper { background: linear-gradient(180deg, #FFFFFF 0%, #FDFBF7 60%, ${CREAM} 100%); }
  .pg-band.white { background: #FFFFFF; }
  .pg-band.cream { background: linear-gradient(180deg, ${CREAM} 0%, #FDFBF7 55%, #FFFFFF 100%); }
  .pg-band.ink {
    background-color: ${INK};
    background-image: linear-gradient(180deg, #181818 0%, #121213 46%, ${INK} 100%);
    color: #FFFFFF;
  }
  /* grain over the ink, so the gradient never bands into visible steps */
  .pg-band.ink::before {
    content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.32'/%3E%3C/svg%3E");
    background-size: 140px 140px; opacity: 0.04; mix-blend-mode: overlay;
  }
  /* the seam where ink meets paper reads as an edge, not a colour change */
  .pg-band.ink::after {
    content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px; z-index: 5;
    pointer-events: none;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14) 50%, transparent);
  }

  /* ══════════════════ the hero ══════════════════ */
  .pg-hero {
    position: relative; isolation: isolate; overflow: clip;
    background: linear-gradient(180deg, #FFFFFF 0%, #FDFBF7 46%, ${CREAM} 100%);
    padding: calc(64px + clamp(36px, 5vw, 84px)) clamp(24px, 4vw, 64px) clamp(44px, 5.5vw, 88px);
  }
  /* the one hue: a single terracotta bloom, top right, felt not seen */
  .pg-hero::before {
    content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(48% 40% at 94% -4%, rgba(210,112,74,0.15), transparent 70%);
  }
  @media (min-width: 1920px) { .pg-hero { padding-top: calc(78px + clamp(36px, 5vw, 84px)); } }
  @media (min-width: 2560px) { .pg-hero { padding-top: calc(92px + clamp(36px, 5vw, 84px)); } }

  .pg-hero-grid {
    display: grid; grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr);
    gap: clamp(32px, 4vw, 78px); align-items: center;
  }
  .pg-hero-grid.solo { grid-template-columns: minmax(0, 1fr); }

  .pg-crumb {
    display: flex; align-items: center; gap: 9px; margin: 0 0 clamp(16px, 2vw, 26px);
    font-family: 'Inter', sans-serif; font-weight: 600; font-size: clamp(11px, 0.85vw, 13px);
    color: ${MUTED};
  }
  .pg-crumb a { color: ${MUTED}; transition: color .25s ease; }
  .pg-crumb a:hover { color: ${ACCENT_INK}; }
  .pg-crumb b { color: ${TEXT}; font-weight: 600; }
  .pg-crumb svg { color: rgba(26,33,29,0.3); flex: none; }

  .pg-eyebrow {
    display: inline-flex; align-items: center; gap: 10px; margin: 0 0 clamp(14px, 1.8vw, 22px);
    font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
    font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px; color: ${ACCENT_INK};
  }
  .pg-eyebrow i { flex: none; width: 7px; height: 7px; border-radius: 50%; background: ${ACCENT}; }

  .pg-title {
    font-family: 'Poppins', sans-serif; font-weight: 600;
    font-size: clamp(44px, 6.2vw, 104px); line-height: 0.98; letter-spacing: -0.035em;
    margin: 0 0 clamp(18px, 2.2vw, 30px); max-width: 13ch; color: ${TEXT};
  }
  .pg-title .accent { color: ${ACCENT}; }
  /* the serif turn: one clause set in Georgia, the way the site does display type */
  .pg-title .serif {
    font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
    font-style: italic; letter-spacing: -0.02em;
  }

  .pg-lead {
    font-family: 'Inter', sans-serif; font-size: clamp(15px, 1.2vw, 19px); line-height: 1.8;
    color: ${MUTED}; margin: 0; max-width: 52ch;
  }
  .pg-lead b { color: ${TEXT}; font-weight: 700; }

  /* the figures, on a hairline under the lead */
  .pg-stats {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(12px, 1.6vw, 26px);
    margin-top: clamp(26px, 3vw, 40px); padding-top: clamp(20px, 2.4vw, 30px);
    border-top: 1px solid rgba(26,33,29,0.14);
  }
  .pg-stat b {
    display: block; font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
    font-size: clamp(26px, 2.4vw, 44px); line-height: 1; letter-spacing: -0.02em; color: ${TEXT};
  }
  .pg-stat span {
    display: block; margin-top: 8px; font-family: 'Inter', sans-serif; font-weight: 600;
    font-size: clamp(12px, 0.92vw, 14px); line-height: 1.5; color: ${MUTED};
  }

  /* ══════════════════ section heads ══════════════════ */
  .pg-head {
    display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: clamp(18px, 3vw, 60px); align-items: end;
    padding-bottom: clamp(20px, 2.4vw, 32px); margin-bottom: clamp(28px, 3.4vw, 52px);
    border-bottom: 1px solid rgba(26,33,29,0.16);
  }
  .pg-band.ink .pg-head { border-bottom-color: #2A2A2A; }
  .pg-head.solo { grid-template-columns: minmax(0, 1fr); }
  .pg-head h2 {
    font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.03em;
    font-size: clamp(30px, 3.6vw, 62px); line-height: 1.04; margin: 0; color: ${TEXT}; max-width: 16ch;
  }
  .pg-band.ink .pg-head h2 { color: #FFFFFF; }
  .pg-head h2 .accent { color: ${ACCENT}; }
  .pg-head h2 .serif {
    font-family: Georgia, 'Times New Roman', serif; font-weight: 400; font-style: italic;
    letter-spacing: -0.02em;
  }
  /* the lead is classed, never a bare p: an unqualified .pg-head p would also
     match the .pg-eyebrow inside this block and outrank it on specificity */
  .pg-head-lead {
    margin: 0; font-family: 'Inter', sans-serif; font-size: clamp(14px, 1.05vw, 17px);
    line-height: 1.8; color: ${MUTED}; max-width: 46ch;
  }
  .pg-band.ink .pg-head-lead { color: #BDBDBD; }
  .pg-band.ink .pg-eyebrow { color: #F09A72; }

  /* ══════════════════ buttons ══════════════════ */
  .pg-btn {
    position: relative; overflow: hidden; cursor: pointer; border: 0;
    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    min-height: 52px; padding: 15px clamp(24px, 2.4vw, 34px); border-radius: 100px;
    background: ${GLOSS}; color: #fff;
    font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(13px, 1vw, 15px);
    box-shadow: ${ACCENT_RIM}, ${ACCENT_CAST};
    transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s ease;
    will-change: transform;
  }
  .pg-btn > * { position: relative; z-index: 1; }
  .pg-btn::after {
    content: ''; position: absolute; inset: 0; z-index: 0;
    background: linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%);
    transform: translateX(-110%); will-change: transform;
    transition: transform .9s cubic-bezier(.16,1,.3,1);
  }
  .pg-btn:hover {
    transform: translateY(-3px);
    box-shadow: ${ACCENT_RIM}, 0 16px 28px -10px rgba(156,67,36,0.6), 0 38px 66px -26px rgba(156,67,36,0.78);
  }
  .pg-btn:hover::after { transform: translateX(110%); }
  .pg-btn svg { transition: transform .45s cubic-bezier(.16,1,.3,1); }
  .pg-btn:hover svg { transform: translateX(4px); }

  .pg-btn.ghost {
    background: transparent; color: ${TEXT}; box-shadow: inset 0 0 0 1px rgba(26,33,29,0.22);
  }
  .pg-btn.ghost:hover {
    background: ${TEXT}; color: ${CREAM};
    box-shadow: inset 0 0 0 1px ${TEXT}, 0 18px 36px -20px rgba(26,33,29,0.7);
  }
  .pg-band.ink .pg-btn.ghost { color: #fff; box-shadow: inset 0 0 0 1px #2A2A2A; }
  .pg-band.ink .pg-btn.ghost:hover {
    background: #fff; color: ${INK}; box-shadow: inset 0 0 0 1px #fff;
  }

  /* ══════════════════ the closing call ══════════════════ */
  .pg-cta-grid {
    display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: clamp(28px, 4vw, 72px); align-items: center;
  }
  /* The call is written light, and turns obsidian only when the band it sits
     in is the ink one. That way a page whose last section is already dark can
     keep the dark close, and a page that would otherwise stack three black
     sections in a row can end on paper instead. */
  .pg-cta h2 {
    font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.035em;
    font-size: clamp(34px, 4.4vw, 78px); line-height: 1.02; margin: 0 0 clamp(16px, 2vw, 24px);
    color: ${TEXT}; max-width: 15ch;
  }
  .pg-band.ink.pg-cta h2 { color: #fff; }
  .pg-cta h2 .serif {
    font-family: Georgia, 'Times New Roman', serif; font-weight: 400; font-style: italic;
    color: ${ACCENT}; letter-spacing: -0.02em;
  }
  .pg-cta-lead {
    margin: 0 0 clamp(26px, 3vw, 38px); font-family: 'Inter', sans-serif;
    font-size: clamp(14px, 1.05vw, 17px); line-height: 1.8; color: ${MUTED}; max-width: 46ch;
  }
  .pg-band.ink.pg-cta .pg-cta-lead { color: #BDBDBD; }
  .pg-cta-acts { display: flex; flex-wrap: wrap; gap: 14px; }

  /* the three lines to the right of the call */
  .pg-cta-list { display: grid; }
  .pg-cta-row {
    position: relative; isolation: isolate; text-decoration: none; color: inherit;
    display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center;
    gap: clamp(12px, 1.4vw, 20px);
    padding: clamp(16px, 1.8vw, 22px) clamp(10px, 1.2vw, 16px);
    border-bottom: 1px solid rgba(26,33,29,0.16);
  }
  .pg-cta-row:first-child { border-top: 1px solid rgba(26,33,29,0.16); }
  .pg-band.ink.pg-cta .pg-cta-row { border-bottom-color: #2A2A2A; }
  .pg-band.ink.pg-cta .pg-cta-row:first-child { border-top-color: #2A2A2A; }
  .pg-cta-row::before {
    content: ''; position: absolute; inset: 0; z-index: -1; border-radius: 8px;
    background: linear-gradient(90deg, rgba(210,112,74,0.13), rgba(210,112,74,0.01));
    transform: scaleX(0); transform-origin: left; will-change: transform;
    transition: transform .65s cubic-bezier(.16,1,.3,1);
  }
  .pg-band.ink.pg-cta .pg-cta-row::before {
    background: linear-gradient(90deg, rgba(210,112,74,0.18), rgba(210,112,74,0.02));
  }
  .pg-cta-row:hover::before, .pg-cta-row:focus-visible::before { transform: scaleX(1); }
  .pg-cta-row em {
    font-style: normal; font-family: 'Inter', sans-serif; font-weight: 700;
    font-variant-numeric: tabular-nums; font-size: clamp(11px, 0.85vw, 13px); letter-spacing: 1.6px;
    color: rgba(26,33,29,0.4); transition: color .4s ease;
  }
  .pg-band.ink.pg-cta .pg-cta-row em { color: #858387; }
  .pg-cta-row:hover em { color: ${ACCENT_INK}; }
  .pg-band.ink.pg-cta .pg-cta-row:hover em { color: ${ACCENT}; }
  .pg-cta-row b {
    font-family: 'Inter', sans-serif; font-weight: 600; font-size: clamp(14px, 1.1vw, 17px);
    color: ${TEXT}; will-change: transform;
    transition: transform .6s cubic-bezier(.16,1,.3,1);
  }
  .pg-band.ink.pg-cta .pg-cta-row b { color: #fff; }
  .pg-cta-row:hover b { transform: translateX(6px); }
  .pg-cta-row svg {
    color: rgba(26,33,29,0.35);
    transition: transform .5s cubic-bezier(.16,1,.3,1), color .4s ease;
  }
  .pg-band.ink.pg-cta .pg-cta-row svg { color: #858387; }
  .pg-cta-row:hover svg { color: ${ACCENT}; transform: translate(3px, -3px); }

  /* ══════════════════ responsive ══════════════════ */
  @media (max-width: 1024px) {
    .pg-hero-grid, .pg-head, .pg-cta-grid { grid-template-columns: minmax(0, 1fr); }
    .pg-head { align-items: start; }
  }
  @media (max-width: 560px) {
    .pg-stats { grid-template-columns: minmax(0, 1fr); gap: 18px; }
    .pg-btn { width: 100%; }
    .pg-cta-acts { width: 100%; }
  }
  @media (prefers-reduced-motion: reduce) {
    .pg-btn::after { display: none; }
  }
`

/* ══════════════════ shell ══════════════════ */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ overflowX: 'clip' }}>
      <Header />
      <main className="pg">
        <style>{KIT_CSS}</style>
        {children}
      </main>
      <Footer />
    </div>
  )
}

/* ══════════════════ hero ══════════════════ */
export function InnerHero({
  crumb,
  eyebrow,
  title,
  lead,
  stats,
  figure,
}: {
  crumb: string
  eyebrow: string
  title: ReactNode
  lead: ReactNode
  stats?: [string, string][]
  figure?: ReactNode
}) {
  const reduce = useReducedMotion() ?? false

  const rise = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: d, duration: 0.8, ease: EASE },
  })

  return (
    <section className="pg-hero">
      <div className="pg-in">
        <div className={`pg-hero-grid${figure ? '' : ' solo'}`}>
          <div>
            <motion.p className="pg-crumb" {...rise(0)}>
              <Link to="/">Home</Link>
              <ArrowRight size={12} strokeWidth={2.4} aria-hidden />
              <b>{crumb}</b>
            </motion.p>

            <motion.p className="pg-eyebrow" {...rise(0.04)}>
              <i aria-hidden /> {eyebrow}
            </motion.p>

            <MaskReveal as="h1" className="pg-title" delay={0.08} inView={false}>
              {title}
            </MaskReveal>

            <motion.p className="pg-lead" {...rise(0.16)}>
              {lead}
            </motion.p>

            {stats && (
              <motion.div className="pg-stats" {...rise(0.22)}>
                {stats.map(([v, l]) => (
                  <div className="pg-stat" key={l}>
                    <b>{v}</b>
                    <span>{l}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {figure && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1.05, ease: EASE }}
            >
              {figure}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════ band ══════════════════ */
export function Band({
  tone = 'white',
  id,
  className,
  label,
  children,
}: {
  tone?: 'paper' | 'white' | 'cream' | 'ink'
  id?: string
  className?: string
  label?: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-label={label} className={`pg-band ${tone}${className ? ` ${className}` : ''}`}>
      <div className="pg-in">{children}</div>
    </section>
  )
}

/* ══════════════════ section head ══════════════════ */
export function SectionHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
}) {
  return (
    <div className={`pg-head${lead ? '' : ' solo'}`}>
      <div>
        {eyebrow && (
          <p className="pg-eyebrow">
            <i aria-hidden /> {eyebrow}
          </p>
        )}
        <MaskReveal as="h2">{title}</MaskReveal>
      </div>
      {lead && <p className="pg-head-lead">{lead}</p>}
    </div>
  )
}

/* ══════════════════ the closing call ══════════════════ */
const NEXT: [string, string, string][] = [
  ['01', 'Book a 30 minute call', '/contact#write'],
  ['02', 'Read a case study', '/case-studies'],
  ['03', 'See what a seat costs', '/solutions'],
]

export function CTABand({
  title,
  lead,
  /* obsidian by default. Pages whose last section is already dark pass
     nothing; a page that would otherwise run three black bands together
     passes "paper" and closes on light instead. */
  tone = 'ink',
}: {
  title?: ReactNode
  lead?: ReactNode
  tone?: 'ink' | 'paper' | 'cream'
}) {
  const reduce = useReducedMotion() ?? false

  return (
    <Band tone={tone} className="pg-cta" label="Talk to us">
      <div className="pg-cta-grid">
        <div>
          <p className="pg-eyebrow">
            <i aria-hidden /> Next step
          </p>
          <MaskReveal as="h2">
            {title ?? (
              <>
                Hand us the queue, <span className="serif">keep the credit.</span>
              </>
            )}
          </MaskReveal>
          <motion.p
            className="pg-cta-lead"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            {lead ??
              'Thirty minutes, no deck and no discovery fee. You leave with a staffing plan and a number, whether or not you ever work with us.'}
          </motion.p>

          <div className="pg-cta-acts">
            <Link to="/contact#write" className="pg-btn">
              <span>Talk to us</span>
              <ArrowRight size={17} strokeWidth={2.4} aria-hidden />
            </Link>
            <Link to="/case-studies" className="pg-btn ghost">
              <span>See the results</span>
            </Link>
          </div>
        </div>

        <motion.div
          className="pg-cta-list"
          variants={staggerParent(0.08)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {NEXT.map(([n, label, href]) => (
            <motion.div key={n} variants={fadeUp}>
              <Link to={href} className="pg-cta-row">
                <em>{n}</em>
                <b>{label}</b>
                <ArrowUpRight size={19} strokeWidth={2.2} aria-hidden />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Band>
  )
}
