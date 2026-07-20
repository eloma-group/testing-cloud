import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { EASE, MaskReveal, fadeUp, VIEWPORT } from '../../lib/anim'

const TEXT   = '#16141F'
const ACCENT = '#998EFF'
const ACCENT_INK = '#6A5BE8'
const WASH   = '#F4F2FD'
const MUTED  = '#5E5B6B'

const GLOSS      = 'linear-gradient(168deg, #C3BCFF 0%, #998EFF 48%, #4A3DBF 100%)'
const ACCENT_RIM = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(40,32,100,0.3)'

/* ──────────────────────────────────────────────────────────────
   An anti-grid editorial spread. No cards, no rails, no widget.
   Four capabilities set as magazine plates: an oversized numeral
   sunk into the page, the name at display size running across it,
   and the photograph overlapping the type rather than sitting beside
   it. The plates alternate side and interlock vertically, so the eye
   zig-zags down the page instead of scanning a column of boxes.

   Depth comes from three planes drifting at different rates as you
   scroll - numeral, photograph, type - all transform-only.
   ────────────────────────────────────────────────────────────── */

type Item = {
  n: string
  tag: string
  label: string
  lines: [string, string]
  desc: string
  metric: string
  img: string
  alt: string
}

const ITEMS: Item[] = [
  {
    n: '01', tag: 'Voice',
    label: 'Customer Care',
    lines: ['Customer', 'Care'],
    desc: 'Warm, on-brand help on every call, chat and email - answered in seconds, never left in a queue.',
    metric: '18 sec average answer',
    img: '/images/help/care.webp',
    alt: 'Support agent wearing a headset speaking with a customer',
  },
  {
    n: '02', tag: 'Support',
    label: 'Technical Support',
    lines: ['Technical', 'Support'],
    desc: 'Tier-1 and tier-2 troubleshooting, logged and escalated with a clear trail behind every fix.',
    metric: '92% fixed first time',
    img: '/images/help/tech.webp',
    alt: 'Engineer troubleshooting on a laptop in a modern office',
  },
  {
    n: '03', tag: 'Growth',
    label: 'Sales and Retention',
    lines: ['Sales and', 'Retention'],
    desc: 'Follow-ups, renewals and win-backs, run to a script you approve and coached call by call.',
    metric: '+38% more win-backs',
    img: '/images/help/sales.webp',
    alt: 'Agent making an outbound call at a desk by a window',
  },
  {
    n: '04', tag: 'Operations',
    label: 'Back Office',
    lines: ['Back', 'Office'],
    desc: 'Orders, data entry and CRM hygiene cleared the same day, off your team and off your mind.',
    metric: 'Zero backlog, daily',
    img: '/images/help/back-office.webp',
    alt: 'Hands working through order paperwork at a desk',
  },
]

/* The planes only separate in depth while the plate is a spread. Once it
   unstacks, the picture sits directly on top of the type block, and drifting
   them past each other just makes them collide. */
function useStacked() {
  const [stacked, setStacked] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)')
    const read = () => setStacked(mq.matches)
    read()
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])
  return stacked
}

/* One plate. Its three planes are parallaxed against the plate's own travel
   through the viewport, which is what separates them in depth. */
function Plate({ item, i }: { item: Item; i: number }) {
  const reduce = useReducedMotion() ?? false
  const stacked = useStacked()
  const still = reduce || stacked
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const shotY = useTransform(scrollYProgress, [0, 1], [58, -58])
  const numY  = useTransform(scrollYProgress, [0, 1], [-26, 26])
  const typeY = useTransform(scrollYProgress, [0, 1], [18, -18])

  return (
    <div className={`cc-hw-plate${i % 2 ? ' is-flip' : ''}`} ref={ref}>
      <motion.span className="cc-hw-num" aria-hidden style={still ? undefined : { y: numY }}>
        {item.n}
      </motion.span>

      <motion.figure className="cc-hw-shot" style={still ? undefined : { y: shotY }}>
        <img src={item.img} alt={item.alt} width={1000} height={1250} loading="lazy" decoding="async" />
      </motion.figure>

      <motion.div className="cc-hw-type" style={still ? undefined : { y: typeY }}>
        <p className="cc-hw-meta">
          <span className="rule" aria-hidden />
          <b>{item.n}</b>
          <span>{item.tag}</span>
        </p>

        {/* the break-out lives on this wrapper, never on the heading itself:
            MaskReveal clips its child, so a heading pulled left out of its own
            clip box simply loses the letters that hang over the edge */}
        <div className="cc-hw-name-out">
          <MaskReveal as="h3" className="cc-hw-name" delay={0.02}>
            <span>{item.lines[0]}</span>
            <span>{item.lines[1]}</span>
          </MaskReveal>
        </div>

        <motion.div
          className="cc-hw-note"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          transition={{ delay: 0.12, duration: 0.8, ease: EASE }}
        >
          <p>{item.desc}</p>
          <p className="cc-hw-metric">{item.metric}</p>
          <Link className="cc-hw-go" to="/services" aria-label={`More about ${item.label}`}>
            <span>Explore</span>
            <ArrowUpRight size={17} strokeWidth={2.4} aria-hidden />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export function HowWeHelp() {
  return (
    <section className="cc-hw" id="how-we-help" aria-label="How we help">
      <style>{`
        .cc-hw {
          position: relative; isolation: isolate;
          background: linear-gradient(180deg, ${WASH} 0%, #FAF9FE 26%, #FFFFFF 62%, #FBFAFE 100%);
          color: ${TEXT};
          padding: clamp(64px, 9vw, 150px) clamp(24px, 4vw, 64px) clamp(70px, 9vw, 150px);
          overflow: hidden;
        }
        .cc-hw::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(46% 34% at 92% 12%, rgba(153,142,255,0.12), transparent 70%),
            radial-gradient(44% 32% at 4% 88%, rgba(153,142,255,0.10), transparent 72%);
        }
        .cc-hw-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }

        /* ── masthead ── */
        .cc-hw-head {
          display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between;
          gap: clamp(20px, 3vw, 56px);
          padding-bottom: clamp(30px, 4vw, 60px);
          border-bottom: 1px solid rgba(22,20,31,0.12);
        }
        .cc-hw-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px;
          color: ${ACCENT_INK}; margin: 0 0 clamp(14px, 1.6vw, 22px);
        }
        .cc-hw-eyebrow::before { content: ''; width: clamp(26px, 4vw, 54px); height: 1px; background: ${ACCENT}; opacity: 0.6; }
        .cc-hw-title {
          font-family: 'Universal Sans', sans-serif; 
          font-size: clamp(42px, 6.4vw, 98px); line-height: 0.98; letter-spacing: -0.03em;
          margin: 0; color: ${TEXT};
        }
        .cc-hw-title .accent { color: ${ACCENT}; }
        .cc-hw-lead {
          font-family: 'Universal Sans', sans-serif; font-size: clamp(15px, 1.2vw, 18px); line-height: 1.72;
          color: ${MUTED}; max-width: 42ch; margin: 0; padding-bottom: 6px;
        }

        /* ── the plates ──
              Twelve columns, and the pieces are placed off them deliberately:
              the photograph runs past the type, and the type runs past the
              photograph. The overlap is the design. ── */
        .cc-hw-plates { display: flex; flex-direction: column; }
        .cc-hw-plate {
          position: relative;
          display: grid; grid-template-columns: repeat(12, minmax(0, 1fr));
          align-items: center;
          padding: clamp(56px, 7vw, 120px) 0;
        }
        /* interlock: each plate rides up into the one above it */
        .cc-hw-plate + .cc-hw-plate { margin-top: clamp(-90px, -6vw, -30px); }

        /* the numeral, sunk into the page behind everything */
        .cc-hw-num {
          position: absolute; z-index: 0; top: clamp(10px, 3vw, 60px); left: 0;
          font-family: 'Universal Sans', sans-serif; font-weight: 600; letter-spacing: -0.06em;
          font-size: clamp(160px, 22vw, 400px); line-height: 0.8;
          color: rgba(22,20,31,0.06);
          pointer-events: none; user-select: none; will-change: transform;
        }
        .cc-hw-plate.is-flip .cc-hw-num { left: auto; right: 0; }

        /* the photograph */
        /* A plate, not a card: the corner is barely rounded and the shadow only
           lifts the picture off the page rather than framing it.

           The edge the name crosses is dissolved into the page. Without it the
           type lands on whatever the photograph happens to be doing there - on
           dark hair, on a dark jacket - and the overlap reads as a mistake.
           Fading that edge out gives the letters clean ground to sit on and
           makes the picture bleed into the spread. */
        .cc-hw-shot {
          grid-column: 1 / 6; grid-row: 1;
          position: relative; z-index: 1; margin: 0;
          aspect-ratio: 4 / 5; overflow: hidden;
          border-radius: clamp(4px, 0.5vw, 8px);
          background: #DFDCF6; will-change: transform;
          box-shadow:
            0 2px 8px rgba(22,20,31,0.08),
            0 40px 70px -44px rgba(22,20,31,0.5);
          -webkit-mask-image: linear-gradient(to left, transparent 0%, rgba(0,0,0,0.6) 9%, #000 22%);
                  mask-image: linear-gradient(to left, transparent 0%, rgba(0,0,0,0.6) 9%, #000 22%);
        }
        .cc-hw-plate.is-flip .cc-hw-shot {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 9%, #000 22%);
                  mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 9%, #000 22%);
        }
        .cc-hw-plate.is-flip .cc-hw-shot { grid-column: 8 / 13; }
        .cc-hw-shot img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transform: scale(1.001);
          transition: transform 1.1s cubic-bezier(.16,1,.3,1);
        }
        .cc-hw-plate:hover .cc-hw-shot img { transform: scale(1.05); }

        /* The type block sits in the half the photograph does not use, so the
           label, the copy and the link are always on clean ground. Only the
           display name is allowed to break out and cross the picture - that is
           the one overlap the spread wants, and it is drawn on top. */
        .cc-hw-type {
          grid-column: 7 / 13; grid-row: 1;
          position: relative; z-index: 2; will-change: transform;
          padding-left: clamp(12px, 2vw, 40px);
        }
        .cc-hw-plate.is-flip .cc-hw-type {
          grid-column: 1 / 7;
          padding-left: 0; padding-right: clamp(12px, 2vw, 40px);
        }

        .cc-hw-meta {
          display: flex; align-items: center; gap: 12px; margin: 0 0 clamp(12px, 1.4vw, 20px);
          font-family: 'Universal Sans', sans-serif; text-transform: uppercase;
          font-size: clamp(10px, 0.78vw, 12px); letter-spacing: 2.4px;
        }
        .cc-hw-meta .rule { width: clamp(24px, 3vw, 48px); height: 1px; background: ${ACCENT}; opacity: 0.7; }
        .cc-hw-meta b { font-weight: 800; color: ${ACCENT_INK}; }
        .cc-hw-meta span:last-child { font-weight: 700; color: rgba(22,20,31,0.42); }

        /* the break-out: the name runs back over the picture, everything under
           it stays on clean ground */
        .cc-hw-name-out { margin-left: clamp(-260px, -16vw, -70px); }
        .cc-hw-plate.is-flip .cc-hw-name-out {
          margin-left: 0; margin-right: clamp(-260px, -16vw, -70px);
        }
        .cc-hw-name {
          margin: 0; font-family: 'Universal Sans', sans-serif; 
          font-size: clamp(44px, 6.6vw, 128px); line-height: 0.9; letter-spacing: -0.042em;
          color: ${TEXT};
        }
        .cc-hw-name span { display: block; }
        /* the second line steps in and takes the accent - it is the line that
           lands squarely on the photograph */
        .cc-hw-name span + span {
          color: ${ACCENT}; padding-left: clamp(20px, 4vw, 90px);
        }
        .cc-hw-plate.is-flip .cc-hw-name { text-align: right; }
        .cc-hw-plate.is-flip .cc-hw-name span + span {
          padding-left: 0; padding-right: clamp(20px, 4vw, 90px);
        }

        .cc-hw-note {
          display: flex; flex-wrap: wrap; align-items: center;
          gap: clamp(14px, 1.6vw, 26px) clamp(20px, 2.4vw, 40px);
          margin-top: clamp(20px, 2.4vw, 38px);
          max-width: 62ch;
        }
        /* on a flipped plate the block hangs off the right of its column, but
           the prose itself stays left-aligned - right-ragged body copy in a
           22ch column is a headache to read */
        .cc-hw-plate.is-flip .cc-hw-note { justify-content: flex-end; }
        .cc-hw-plate.is-flip .cc-hw-meta { justify-content: flex-end; }
        .cc-hw-note p {
          flex: 0 1 26ch; min-width: 0; margin: 0;
          font-family: 'Universal Sans', sans-serif;
          font-size: clamp(15px, 1.1vw, 18px); line-height: 1.7; color: ${MUTED};
        }
        .cc-hw-metric {
          flex: 0 0 auto !important;
          display: inline-flex; align-items: center; gap: 9px; white-space: nowrap;
          font-family: 'Universal Sans', sans-serif; font-weight: 700 !important;
          font-size: clamp(13px, 0.95vw, 16px) !important; color: ${TEXT} !important;
        }
        .cc-hw-metric::before {
          content: ''; width: 8px; height: 8px; border-radius: 50%; flex: none;
          background: radial-gradient(circle at 32% 28%, #D6D0FF, ${ACCENT} 60%, #4A3DBF);
          box-shadow: 0 0 0 5px rgba(153,142,255,0.16);
        }

        .cc-hw-go {
          flex: none; display: inline-flex; align-items: center; gap: 10px;
          min-height: 44px; padding: 12px 20px; border-radius: 100px;
          text-decoration: none; color: ${TEXT};
          font-family: 'Universal Sans', sans-serif; font-weight: 700; font-size: clamp(12px, 0.9vw, 14px);
          box-shadow: inset 0 0 0 1px rgba(22,20,31,0.16);
          transition: color .35s ease, background .4s ease, box-shadow .4s ease, transform .5s cubic-bezier(.16,1,.3,1);
          will-change: transform;
        }
        .cc-hw-go:hover {
          color: #fff; background: ${GLOSS}; transform: translate(3px, -3px);
          box-shadow: ${ACCENT_RIM}, 0 16px 30px -14px rgba(74,61,191,0.8);
        }
        .cc-hw-go:focus-visible { outline: 2px solid ${ACCENT_INK}; outline-offset: 3px; }

        @media (min-width: 1920px) { .cc-hw-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-hw-inner { max-width: 2400px; } }

        /* ── tablet: the overlap tightens but survives ── */
        @media (max-width: 1100px) {
          .cc-hw-shot { grid-column: 1 / 6; }
          .cc-hw-plate.is-flip .cc-hw-shot { grid-column: 8 / 13; }
          .cc-hw-type { grid-column: 6 / 13; }
          .cc-hw-plate.is-flip .cc-hw-type { grid-column: 1 / 8; }
          .cc-hw-name { font-size: clamp(40px, 7vw, 72px); }
        }

        /* ── phones: the plates unstack. Overlapping type on a 375px screen is
              unreadable, so the photograph goes full width and the type sits
              under it, still oversized. ── */
        @media (max-width: 820px) {
          .cc-hw-plate {
            grid-template-columns: minmax(0, 1fr);
            padding: clamp(38px, 9vw, 60px) 0;
          }
          .cc-hw-plate + .cc-hw-plate { margin-top: 0; border-top: 1px solid rgba(22,20,31,0.1); }
          .cc-hw-shot, .cc-hw-plate.is-flip .cc-hw-shot {
            grid-column: 1; grid-row: 1; aspect-ratio: 16 / 11;
            /* nothing crosses the picture here, so it keeps all four edges */
            -webkit-mask-image: none; mask-image: none;
          }
          .cc-hw-type, .cc-hw-plate.is-flip .cc-hw-type {
            grid-column: 1; grid-row: 2;
            padding: clamp(18px, 5vw, 28px) 0 0; text-align: left;
          }
          .cc-hw-name-out,
          .cc-hw-plate.is-flip .cc-hw-name-out { margin: 0; }   /* no break-out at this width */
          .cc-hw-name,
          .cc-hw-plate.is-flip .cc-hw-name {
            text-align: left; font-size: clamp(34px, 10vw, 56px);
          }
          .cc-hw-plate.is-flip .cc-hw-meta,
          .cc-hw-plate.is-flip .cc-hw-note { justify-content: flex-start; }
          .cc-hw-name span + span,
          .cc-hw-plate.is-flip .cc-hw-name span + span { padding: 0 0 0 clamp(14px, 5vw, 30px); }
          /* at this width the numeral has nowhere to sit that is not on top of
             the copy, so it goes */
          .cc-hw-num { display: none; }
          .cc-hw-plate.is-flip .cc-hw-note { margin-left: 0; justify-content: flex-start; text-align: left; }
          .cc-hw-note { max-width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-hw-shot img, .cc-hw-go { transition: none; }
        }
      `}</style>

      <div className="cc-hw-inner">
        <div className="cc-hw-head">
          <div>
            <motion.p className="cc-hw-eyebrow" variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
              What We Deliver
            </motion.p>
            <MaskReveal as="h2" className="cc-hw-title" delay={0.05}>
              How we <span className="accent">help</span>
            </MaskReveal>
          </div>
          <motion.p
            className="cc-hw-lead"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            transition={{ delay: 0.12, duration: 0.85, ease: EASE }}
          >
            Four ways one dedicated team keeps your customers looked after - from the
            first hello to the admin long after the call ends.
          </motion.p>
        </div>

        <div className="cc-hw-plates">
          {ITEMS.map((it, i) => <Plate key={it.label} item={it} i={i} />)}
        </div>
      </div>
    </section>
  )
}
