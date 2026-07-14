import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { MaskReveal, useParallax } from '../../lib/anim'

const TEXT   = '#2E3A34'
const ACCENT = '#D2704A'
const CREAM  = '#F6F2EA'
const MUTED  = '#63706A'
const INK    = '#1A211D'
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const GLOSS      = 'linear-gradient(168deg, #F09A72 0%, #D2704A 46%, #9C4324 100%)'
const ACCENT_RIM = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(84,34,16,0.3)'

const TILES = [
  { src: '/images/about/tile-1.webp', alt: 'Close up of a headset microphone beside an agent laptop' },
  { src: '/images/about/tile-2.webp', alt: 'Support agent smiling while taking a customer call on a headset' },
  { src: '/images/about/tile-3.webp', alt: 'Agent handling a live customer call from the support floor' },
]

const STATS = [
  { v: '10+',  l: 'Years building support teams' },
  { v: '24/7', l: 'Cover across every time zone' },
  { v: '92%',  l: 'Issues fixed on first contact' },
]

export function AboutUs() {
  const reduce = useReducedMotion() ?? false
  const stageRef = useRef<HTMLDivElement>(null)
  /* Counter-parallax: the product drifts up, the tile rail drifts down. Two
     compositor-only transforms, so the depth is free at 120fps. */
  const heroY  = useParallax(stageRef, 26)
  const tilesY = useParallax(stageRef, -16)

  const fade = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { delay: d, duration: 0.85, ease: EASE },
  })

  return (
    <section className="cc-au" id="about" aria-label="About us">
      <style>{`
        .cc-au {
          position: relative;
          background: linear-gradient(180deg, #FFFFFF 0%, #FDFBF7 44%, ${CREAM} 82%, #EFE8DC 100%);
          overflow: hidden;
        }
        .cc-au-inner {
          position: relative;
          max-width: min(calc(100vw - 140px), 1760px);
          margin: 0 auto;
          padding: clamp(56px, 8vw, 130px) clamp(24px, 4vw, 64px) clamp(48px, 6vw, 96px);
        }
        /* warm pool of light behind the product, so it reads as lit, not pasted */
        .cc-au-inner::before {
          content: ''; position: absolute; z-index: 0; pointer-events: none;
          top: 2%; right: -4%; width: min(52vw, 700px); aspect-ratio: 1;
          background: radial-gradient(closest-side, rgba(210,112,74,0.20), transparent 72%);
        }

        /* ── stage: copy | product | tile rail ── */
        .cc-au-stage {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1.36fr) minmax(0, 1.08fr) auto;
          column-gap: clamp(24px, 3vw, 56px);
          align-items: start;
        }
        .cc-au-copy { grid-column: 1; grid-row: 1; }
        .cc-au-foot { grid-column: 1; grid-row: 2; }
        .cc-au-hero { grid-column: 2; grid-row: 1 / span 2; align-self: center; }
        /* spans both rows so the rail can sit low beside the product without its own
           height forcing row 1 (and the section) taller */
        .cc-au-tiles { grid-column: 3; grid-row: 1 / span 2; align-self: start; }

        /* ── headline ── */
        .cc-au-head { margin: 0; }
        .cc-au-h {
          display: block;
          font-family: 'Poppins', sans-serif; font-weight: 900; text-transform: uppercase;
          font-size: clamp(52px, 7.4vw, 124px); line-height: 0.9; letter-spacing: -0.045em;
          color: ${TEXT}; margin: 0;
        }
        .cc-au-h-row {
          display: flex; align-items: center; flex-wrap: wrap;
          gap: clamp(12px, 1.6vw, 26px); margin-top: clamp(2px, 0.4vw, 8px);
        }
        .cc-au-h-note {
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.78vw, 13px); letter-spacing: 2.2px; line-height: 1.7;
          color: ${MUTED}; margin: 0; max-width: 16ch;
        }
        /* the accent word carries the editorial serif, exactly one voice change */
        .cc-au-h-accent {
          font-family: Georgia, 'Times New Roman', serif; font-weight: 400; text-transform: none;
          font-size: clamp(48px, 6.4vw, 108px); line-height: 0.92; letter-spacing: -0.02em;
          color: ${ACCENT};
        }

        /* ── paragraph on a hairline rule ── */
        .cc-au-lede {
          display: flex; gap: clamp(14px, 1.4vw, 22px);
          margin: clamp(26px, 3.2vw, 46px) 0 0; max-width: 42ch;
        }
        .cc-au-lede i {
          flex: none; width: 2px; border-radius: 2px;
          background: linear-gradient(180deg, ${ACCENT}, rgba(210,112,74,0));
          transform-origin: top; will-change: transform;
        }
        .cc-au-lede p {
          font-family: 'Inter', sans-serif; font-weight: 400;
          font-size: clamp(14px, 1.15vw, 17px); line-height: 1.8; color: ${MUTED}; margin: 0;
        }

        /* ── CTAs ── */
        .cc-au-ctas {
          display: flex; align-items: center; flex-wrap: wrap;
          gap: clamp(14px, 1.8vw, 28px); margin-top: clamp(26px, 3vw, 44px);
        }
        .cc-au-cta {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          min-height: 52px; padding: 15px clamp(24px, 2.4vw, 36px);
          background: linear-gradient(168deg, #46534A 0%, ${TEXT} 48%, ${INK} 100%);
          color: #FBF9F5; text-decoration: none; border-radius: 4px;
          font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: clamp(12px, 0.9vw, 14px); letter-spacing: 1.5px;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 0 -1px 0 rgba(0,0,0,0.28),
            0 2px 4px rgba(26,33,29,0.22),
            0 14px 26px -12px rgba(26,33,29,0.5);
          transition: transform .45s cubic-bezier(.16,1,.3,1), background .35s ease, box-shadow .35s ease;
          will-change: transform;
        }
        .cc-au-cta:hover {
          background: ${GLOSS}; color: #FFF7F2; transform: translateY(-3px);
          box-shadow: ${ACCENT_RIM},
            0 3px 6px rgba(156,67,36,0.4),
            0 18px 32px -12px rgba(156,67,36,0.72);
        }
        .cc-au-cta svg { transition: transform .45s cubic-bezier(.16,1,.3,1); will-change: transform; }
        .cc-au-cta:hover svg { transform: translateX(4px); }

        .cc-au-ghost {
          display: inline-flex; align-items: center; gap: 12px;
          min-height: 52px; padding: 4px; background: none; border: 0;
          color: ${TEXT}; text-decoration: none;
          font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: clamp(12px, 0.9vw, 14px); letter-spacing: 1.5px;
        }
        .cc-au-ghost i {
          display: grid; place-items: center; flex: none;
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--gl-pane); box-shadow: var(--rim-light), var(--sh-1);
          color: ${TEXT};
          transition: transform .45s cubic-bezier(.16,1,.3,1), background .35s ease, color .35s ease;
          will-change: transform;
        }
        .cc-au-ghost:hover i {
          background: ${GLOSS}; color: #FFF7F2; transform: translate(2px, -2px) scale(1.06);
          box-shadow: ${ACCENT_RIM}, 0 10px 20px -8px rgba(156,67,36,0.65);
        }

        /* ── hero product ──
           A true alpha cutout, so the shadow is drawn here rather than photographed.
           Deliberately not mix-blend-mode: any animated ancestor forms a stacking
           context, which isolates the blend group and resurrects the white plate. */
        .cc-au-hero img {
          display: block; width: 100%; height: auto; pointer-events: none;
          filter: drop-shadow(0 26px 34px rgba(46, 58, 52, 0.18))
                  drop-shadow(0 4px 8px rgba(46, 58, 52, 0.10));
          will-change: transform;
        }

        /* ── tile rail ── */
        .cc-au-tiles {
          display: flex; flex-direction: column; align-items: flex-start;
          gap: clamp(10px, 1vw, 16px);
          /* sits low beside the product, but short enough that rail bottom stays inside
             the height col 1 already sets - otherwise it stretches the grid */
          margin: clamp(170px, 24vw, 370px) 0 0 clamp(-56px, -2.6vw, -20px);
          will-change: transform;
        }
        /* staggered, not a straight column - margins (not transforms) so they never
           fight the tiles' own animated x */
        .cc-au-tile:nth-child(1) { margin-left: clamp(14px, 1.7vw, 30px); }
        .cc-au-tile:nth-child(3) { margin-left: clamp(22px, 2.6vw, 46px); }
        .cc-au-tile {
          width: clamp(74px, 7vw, 112px); aspect-ratio: 1;
          border-radius: clamp(10px, 0.9vw, 16px); overflow: hidden;
          background: ${CREAM};
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.6),
            0 1px 3px rgba(20,20,22,0.05),
            0 16px 30px -14px rgba(26,33,29,0.45);
          transition: transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s ease;
          will-change: transform;
        }
        .cc-au-tile img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cc-au-tile:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.6),
            0 3px 6px rgba(26,33,29,0.18),
            0 24px 42px -14px rgba(26,33,29,0.55);
        }

        /* ── foot: rotated label + alt product + copy ── */
        .cc-au-foot {
          display: grid; grid-template-columns: auto minmax(0, 1fr);
          gap: clamp(18px, 2.4vw, 40px); align-items: center;
          padding-top: clamp(30px, 4vw, 58px);
        }
        .cc-au-foot-media { display: flex; align-items: center; gap: clamp(4px, 0.6vw, 12px); }
        .cc-au-rot {
          writing-mode: vertical-rl; transform: rotate(180deg);
          font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
          font-size: clamp(13px, 1vw, 17px); letter-spacing: 0.14em;
          color: rgba(46,58,52,0.42); white-space: nowrap; margin: 0;
        }
        .cc-au-alt {
          width: clamp(150px, 15vw, 240px); height: auto; display: block;
          pointer-events: none;
          filter: drop-shadow(0 16px 22px rgba(46, 58, 52, 0.16));
        }
        .cc-au-foot h3 {
          font-family: 'Poppins', sans-serif; font-weight: 900; text-transform: uppercase;
          font-size: clamp(24px, 2.4vw, 40px); line-height: 0.98; letter-spacing: -0.04em;
          color: ${TEXT}; margin: 0 0 clamp(10px, 1.1vw, 16px);
        }
        .cc-au-foot p {
          font-family: 'Inter', sans-serif; font-weight: 400;
          font-size: clamp(14px, 1.05vw, 16px); line-height: 1.8; color: ${MUTED};
          margin: 0; max-width: 38ch;
        }

        /* ── stats bar ── */
        .cc-au-stats {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(20px, 3vw, 56px);
          margin-top: clamp(44px, 6vw, 96px);
          padding-top: clamp(26px, 3vw, 44px);
          border-top: 1px solid rgba(26,33,29,0.13);
        }
        .cc-au-stat b {
          display: block; font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
          font-size: clamp(30px, 2.5vw, 46px); line-height: 1; letter-spacing: -0.02em; color: ${TEXT};
        }
        .cc-au-stat span {
          display: block; margin-top: 8px;
          font-family: 'Inter', sans-serif; font-weight: 600; font-size: clamp(13px, 0.95vw, 15px);
          line-height: 1.6; color: ${MUTED};
        }

        @media (min-width: 1920px) {
          .cc-au-inner { max-width: min(calc(100vw - 140px), 1900px); }
        }
        @media (min-width: 2560px) {
          .cc-au-inner { max-width: min(calc(100vw - 160px), 2400px); }
        }

        /* stack the stage: copy, then product + rail, then foot */
        @media (max-width: 1100px) {
          .cc-au-stage { grid-template-columns: minmax(0, 1fr); row-gap: clamp(32px, 5vw, 56px); }
          .cc-au-copy, .cc-au-foot, .cc-au-hero, .cc-au-tiles {
            grid-column: 1; grid-row: auto;
          }
          .cc-au-hero { display: flex; justify-content: center; }
          /* the inline scale(1.22) is baked in, so cap the box lower to compensate */
          .cc-au-hero img { max-width: min(460px, 74%); }
          .cc-au-tiles {
            flex-direction: row; justify-content: center; align-items: center;
            margin: clamp(-40px, -4vw, -16px) 0 0;
          }
          .cc-au-tile { width: clamp(88px, 15vw, 132px); }
          .cc-au-tile:nth-child(1), .cc-au-tile:nth-child(3) { margin-left: 0; }
          .cc-au-tile:nth-child(2) { margin-top: clamp(16px, 3vw, 30px); }
          .cc-au-lede, .cc-au-foot p { max-width: 60ch; }
        }
        @media (max-width: 768px) {
          .cc-au-inner { max-width: 100%; }
          .cc-au-foot { grid-template-columns: minmax(0, 1fr); row-gap: clamp(20px, 4vw, 32px); }
          .cc-au-foot-media { justify-content: flex-start; }
          .cc-au-alt { width: clamp(160px, 42vw, 240px); }
        }
        @media (max-width: 800px) {
          .cc-au-stats { grid-template-columns: minmax(0, 1fr); gap: 20px; }
          .cc-au-stat { display: flex; align-items: baseline; gap: 16px; }
          .cc-au-stat b { min-width: 3.4ch; }
          .cc-au-stat span { margin-top: 0; }
        }
        @media (max-width: 540px) {
          .cc-au-h-note { max-width: 100%; }
          .cc-au-ctas { gap: 14px; }
          .cc-au-cta { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-au-cta, .cc-au-ghost i, .cc-au-tile { transition: none; }
        }
      `}</style>

      <div className="cc-au-inner">
        <div className="cc-au-stage" ref={stageRef}>
          {/* ── Copy ── */}
          <div className="cc-au-copy">
            <h2 className="cc-au-head">
              <MaskReveal as="span" className="cc-au-h" duration={1}>Always</MaskReveal>
              <MaskReveal as="span" className="cc-au-h-row" duration={1} delay={0.08}>
                <span className="cc-au-h">On</span>
                <span className="cc-au-h-note">An extension of your own brand</span>
                <span className="cc-au-h-accent">24/7</span>
              </MaskReveal>
            </h2>

            <motion.div className="cc-au-lede" {...fade(0.18)}>
              <motion.i
                aria-hidden
                initial={reduce ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
              />
              <p>
                We are Nexa, an outsourced support partner for growing brands. For over a decade we have
                staffed, trained and managed dedicated teams that answer every call, chat and email as a
                true extension of your business.
              </p>
            </motion.div>

            <motion.div className="cc-au-ctas" {...fade(0.26)}>
              <Link className="cc-au-cta" to="/contact#write">
                Book a Free Call
                <ArrowRight size={16} strokeWidth={2.6} aria-hidden />
              </Link>
              <Link className="cc-au-ghost" to="/services">
                Our Services
                <i aria-hidden><ArrowUpRight size={17} strokeWidth={2.4} /></i>
              </Link>
            </motion.div>
          </div>

          {/* ── Hero product ── */}
          <motion.div
            className="cc-au-hero"
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <motion.img
              src="/images/about/headset-hero.webp"
              alt="Premium over-ear support headset, the tool behind every Nexa conversation"
              width={1500} height={1604} loading="lazy" decoding="async"
              /* scale, not width: the product grows past its column without the layout
                 box (and so the section) getting any taller */
              style={reduce ? { scale: 1.08, x: '3%' } : { y: heroY, scale: 1.08, x: '3%' }}
            />
          </motion.div>

          {/* ── Tile rail ── */}
          <motion.div
            className="cc-au-tiles"
            style={reduce ? undefined : { y: tilesY }}
            initial={reduce ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            {TILES.map((t, i) => (
              <motion.div
                className="cc-au-tile"
                key={t.src}
                variants={{ hidden: { opacity: 0, x: 26 }, show: { opacity: 1, x: 0 } }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: EASE }}
              >
                <img src={t.src} alt={t.alt} width={520} height={520} loading="lazy" decoding="async" />
              </motion.div>
            ))}
          </motion.div>

          {/* ── Foot: alt product + copy ── */}
          <motion.div className="cc-au-foot" {...fade(0.1)}>
            <div className="cc-au-foot-media">
              <p className="cc-au-rot">Since 2014</p>
              <img
                className="cc-au-alt"
                src="/images/about/phone-alt.webp"
                alt="Corded telephone handset with its cord trailing away"
                width={1000} height={527} loading="lazy" decoding="async"
              />
            </div>
            <div>
              <h3>Real People,<br />Real Time</h3>
              <p>
                Every conversation is handled by a trained agent who knows your product, your tone and
                your customer. No scripts to read from, no queues to die in, no guesswork.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Stats ── */}
        <motion.div className="cc-au-stats" {...fade(0.14)}>
          {STATS.map((s) => (
            <div className="cc-au-stat" key={s.v}>
              <b>{s.v}</b>
              <span>{s.l}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
