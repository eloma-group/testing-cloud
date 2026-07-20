import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Package, Ticket, CalendarCheck, Truck, ShieldCheck, Plane } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { MaskReveal } from '../../lib/anim'

const TEXT   = '#16141F'
const ACCENT = '#998EFF'
const ACCENT_INK = '#6A5BE8'   /* text-safe on white (5.3:1) - eyebrows, small labels */
const WASH  = '#F4F2FD'
const LIVE   = '#2EBAC6'
const LIVE_INK   = '#0E7C88'   /* the label beside a live dot - teal itself is only 2.2:1 on white */
const MUTED  = '#5E5B6B'
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const GLOSS      = 'linear-gradient(168deg, #C3BCFF 0%, #998EFF 48%, #4A3DBF 100%)'
const ACCENT_RIM = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(40,32,100,0.3)'

/* the six tiles are pinned around the floor roughly 60deg apart, starting at the top -
   the two back tiles sit 1deg closer together so their edge gaps stay even with the
   neighbouring tiles once their wider radius and 1.24 upscale are applied */
const RING = [-89, -31, 30, 90, 150, 210]
const R    = 31        // ring radius, in floor-em - tiles ring wider around the dais (raised to spread the tiles apart and push them off-centre for wide screens)
const TILT = 54        // floor rotateX
const SPIN = 26        // floor rotateZ (labels counter-rotate by this to stay horizontal)
const DWELL = 3000     // ms each sector holds before the dial turns itself

type Sector = {
  code: string
  name: string
  short: string
  desc: string
  runs: string[]
  stats: [string, string][]
  queue: number
  answer: string
  Icon: LucideIcon
}

const SECTORS: Sector[] = [
  {
    code: 'FIN', name: 'Fintech and Insurance', short: 'fintech', Icon: ShieldCheck,
    desc: 'Account queries, claims intake and verification, with an audit trail sitting under every case.',
    runs: ['Account queries', 'Claims intake', 'Verification', 'Disputes'],
    stats: [['100', 'Percent audited notes'], ['4', 'Eyes on every claim'], ['0', 'Cases left open']],
    queue: 19, answer: '0:26',
  },
  {
    code: 'SAAS', name: 'SaaS and Technology', short: 'SaaS', Icon: Ticket,
    desc: 'Tier 1 and tier 2 tickets triaged, resolved and escalated inside your own stack, not ours.',
    runs: ['Tier 1', 'Tier 2 triage', 'Onboarding', 'Bug intake'],
    stats: [['2', 'Tiers held in house'], ['86', 'Percent closed without dev'], ['24', 'Hours a day']],
    queue: 21, answer: '0:24',
  },
  {
    code: 'CARE', name: 'Healthcare and Clinics', short: 'healthcare', Icon: CalendarCheck,
    desc: 'Appointment booking, reminders and patient queries, handled by agents trained to slow down.',
    runs: ['Bookings', 'Reminders', 'Patient queries', 'Referrals'],
    stats: [['15', 'Second answer'], ['31', 'Percent fewer no shows'], ['100', 'Percent confidential']],
    queue: 12, answer: '0:15',
  },
  {
    code: 'MOVE', name: 'Logistics and Delivery', short: 'logistics', Icon: Truck,
    desc: 'Delivery exceptions, driver support and live status chased down before the customer asks twice.',
    runs: ['Exceptions', 'Driver support', 'Live status', 'Claims'],
    stats: [['24', 'Hour exception desk'], ['38', 'Percent fewer chase calls'], ['7', 'Days a week']],
    queue: 47, answer: '0:21',
  },
  {
    code: 'TRVL', name: 'Travel and Hospitality', short: 'travel', Icon: Plane,
    desc: 'Bookings, changes and cancellations answered in the language your guests actually speak.',
    runs: ['Bookings', 'Changes', 'Cancellations', 'Disruption'],
    stats: [['6', 'Languages from day one'], ['19', 'Second answer'], ['365', 'Days covered']],
    queue: 28, answer: '0:19',
  },
  {
    code: 'E-COM', name: 'E-commerce and Retail', short: 'e-commerce', Icon: Package,
    desc: 'Order tracking, returns and refunds answered in minutes, right the way through peak season.',
    runs: ['Order tracking', 'Returns', 'Refunds', 'Where is my order'],
    stats: [['5', 'Days to peak cover'], ['92', 'Percent fixed first time'], ['4', 'Channels live']],
    queue: 34, answer: '0:18',
  },
]

export function Industries() {
  const reduce = useReducedMotion() ?? false
  const [sel, setSel] = useState(0)
  const [paused, setPaused] = useState(false)
  const [queue, setQueue] = useState(SECTORS[0].queue)
  const startRef = useRef(0)
  const progRef = useRef<HTMLSpanElement>(null)

  const active = SECTORS[sel]

  const pick = useCallback((i: number) => {
    setSel(i)
    startRef.current = performance.now()
    setQueue(SECTORS[i].queue)
  }, [])

  /* auto-advance on a progress bar; hovering the floor takes the dial off the clock */
  useEffect(() => {
    if (reduce) return
    let raf = 0
    startRef.current = performance.now()
    const tick = (now: number) => {
      if (!paused) {
        const p = Math.min(1, (now - startRef.current) / DWELL)
        if (progRef.current) progRef.current.style.transform = `scaleX(${p})`
        if (p >= 1) {
          setSel((s) => {
            const next = (s + 1) % SECTORS.length
            setQueue(SECTORS[next].queue)
            return next
          })
          startRef.current = now
        }
      } else {
        startRef.current = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused, reduce])

  /* the queue figure drifts, the way a real board does */
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => {
      setQueue((q) => Math.max(6, q + Math.round((Math.random() - 0.5) * 6)))
    }, 2800)
    return () => clearInterval(id)
  }, [reduce, sel])

  const rise = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { delay: d, duration: 0.8, ease: EASE },
  })

  return (
    <section className="cc-in" id="industries" aria-label="Industries we serve">
      <style>{`
        /* picks the wash up off the section above, climbs to white, settles into wash again */
        .cc-in {
          position: relative; isolation: isolate; overflow: hidden;
          background: linear-gradient(180deg, #E3DEF8 0%, #FBFAFE 24%, #FFFFFF 54%, ${WASH} 100%);
          color: ${TEXT};
          padding: clamp(72px, 10vw, 150px) clamp(24px, 4vw, 64px) clamp(72px, 9vw, 140px);
        }
        .cc-in::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(52% 42% at 50% 40%, rgba(153,142,255,0.10), transparent 72%);
        }
        .cc-in-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }
        @media (min-width: 1920px) { .cc-in-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-in-inner { max-width: 2400px; } }

        /* ── masthead: heading left, live index right, hairline under both ── */
        .cc-in-mast {
          display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(340px, 0.9fr);
          gap: clamp(24px, 4vw, 72px); align-items: end;
          padding-bottom: clamp(22px, 2.6vw, 36px);
          border-bottom: 1px solid rgba(22,20,31,0.16);
        }
        .cc-in-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px; color: ${ACCENT_INK};
          margin: 0 0 clamp(14px, 1.8vw, 22px);
        }
        .cc-in-eyebrow i { width: 7px; height: 7px; border-radius: 50%; background: ${ACCENT}; }
        .cc-in-title {
          font-family: 'Universal Sans', sans-serif; 
          font-size: clamp(40px, 6.4vw, 118px); line-height: 0.98; letter-spacing: -0.03em;
          margin: 0;
        }
        .cc-in-title .accent { color: ${ACCENT}; }
        /* the live sector line - its own vw clamp keeps the longest name on a single
           row, so the heading is always exactly two lines and never shifts height */
        .cc-in-title .swap {
          display: block; white-space: nowrap; min-height: 1.1em;
          font-size: clamp(24px, 4.4vw, 112px); line-height: 1.06; margin-top: 0.08em;
          will-change: transform, opacity;
        }

        .cc-in-index { width: 100%; }
        /* the four glass chips - what the live sector actually runs, swapping with the dial */
        .cc-in-runs {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(8px, 0.8vw, 12px);
          margin: 0; padding: 0; list-style: none; width: 100%;
        }
        .cc-in-runs li {
          display: flex; align-items: center; gap: 9px; min-height: 44px;
          padding: clamp(12px, 1.1vw, 16px) clamp(14px, 1.2vw, 18px); border-radius: 14px;
          font-family: 'Universal Sans', sans-serif; font-weight: 700;
          font-size: clamp(12px, 0.95vw, 15px); line-height: 1.3; color: ${TEXT};
          will-change: transform, opacity;
          background: linear-gradient(155deg, rgba(255,255,255,0.66), rgba(232,242,244,0.38));
          backdrop-filter: blur(10px) saturate(1.4); -webkit-backdrop-filter: blur(10px) saturate(1.4);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.95),
            inset 0 0 0 1px rgba(255,255,255,0.6),
            0 18px 34px -20px rgba(22,20,31,0.45);
        }
        .cc-in-runs li i { flex: none; width: 6px; height: 6px; border-radius: 50%; background: ${ACCENT}; }
        /* only on very small phones the single row would be unreadable - fall back to two-up */
        @media (max-width: 480px) {
          .cc-in-runs { grid-template-columns: 1fr 1fr; }
        }

        /* ══════════ the stage: one isometric floor, with flat UI floating over it ══════════ */
        .cc-in-stage {
          position: relative; margin-top: clamp(16px, 2vw, 32px);
          min-height: clamp(680px, 58vw, 1020px);
        }

        /* the perspective box; the floor scales off a single clamped unit so every
           tile, wall and offset (all written in em) moves together across breakpoints */
        .cc-in-scene {
          position: absolute; inset: 0; display: grid; place-items: center;
          perspective: 1600px; perspective-origin: 50% 42%;
          /* -6.4% on the taller stage keeps the floor's top exactly where it was,
             so all the extra height lands below the front tiles */
          transform: translateY(-6.4%); pointer-events: none;
        }
        .cc-in-floor {
          position: relative; width: 74em; height: 74em; font-size: clamp(5px, 1.32vw, 13.5px);
          transform-style: preserve-3d;
          transform: rotateX(${TILT}deg) rotateZ(-${SPIN}deg);
        }
        .cc-in-floor > * { pointer-events: auto; }

        /* the central raised platform - a brushed-steel slab that tucks under the front
           tiles (it paints before them in the DOM, so the tiles occlude its near edge) */
        .cc-in-dais {
          position: absolute; top: 50%; left: 50%; width: 34em; height: 34em; margin: -17em 0 0 -17em;
          border-radius: 9em; transform-style: preserve-3d; pointer-events: none;
        }
        .cc-in-dais .side {
          position: absolute; inset: 0; border-radius: 9em; transform: translateZ(-3em);
          background: linear-gradient(160deg, #C0C5CC, #979DA6);
          box-shadow: 0 4em 4.4em -1em rgba(22,20,31,0.42);
        }
        .cc-in-dais .top {
          position: absolute; inset: 0; border-radius: 9em;
          background: radial-gradient(circle at 42% 30%, #FDFEFE 0%, #E4E8ED 60%, #CDD2D9 100%);
          box-shadow:
            inset 0 0.24em 0.3em rgba(255,255,255,1),
            inset 0 0 0 0.16em rgba(255,255,255,0.7),
            inset 0 -3em 4em -2em rgba(22,20,31,0.2);
        }
        /* a shallow recessed well in the middle, where the cards sit */
        .cc-in-dais .top::after {
          content: ''; position: absolute; inset: 16%; border-radius: 5em;
          background: radial-gradient(circle at 50% 36%, #EEF1F4, #DBE0E6 70%, #C9CFD6);
          box-shadow:
            inset 0 0.2em 0.6em rgba(22,20,31,0.14),
            inset 0 -0.3em 0.4em rgba(255,255,255,0.7);
        }

        /* the two neon tracks - a purple/teal ring hugging the cards, low over the platform
           so it stays clear of the tile labels and the turn-for-sector text */
        .cc-in-arcs {
          position: absolute; top: 50%; left: 50%; width: 39em; height: 39em; margin: -19.5em 0 0 -19.5em;
          transform: translateZ(3em); overflow: visible; pointer-events: none;
        }
        .cc-in-arcs path { fill: none; stroke-width: 2.6; stroke-linecap: round; }

        /* the "turn for sector" hints, lying flat on the platform, outside the ring */
        .cc-in-turn {
          position: absolute; left: 50%; top: 50%;
          font-family: 'Universal Sans', sans-serif; font-weight: 800; font-size: 1.7em; letter-spacing: 0.28em;
          text-transform: uppercase; color: rgba(22,20,31,0.26); white-space: nowrap; pointer-events: none;
        }
        .cc-in-turn.l { transform: translate(-112%, 11.5em); }
        .cc-in-turn.r { transform: translate(12%, 11.5em); }

        /* ---- the six chunky metal tiles ---- */
        .cc-in-tile {
          position: absolute; top: 50%; left: 50%; width: 18em; height: 18em; margin: -9em 0 0 -9em;
          transform-style: preserve-3d; border: 0; padding: 0; background: none; cursor: pointer;
          transition: transform 1s cubic-bezier(.16,1,.3,1);
        }
        .cc-in-tile .face, .cc-in-tile .wall {
          position: absolute; inset: 0; border-radius: 2.8em;
        }
        /* the extrusion: three stacked walls of brushed steel give the block real thickness */
        .cc-in-tile .wall { background: linear-gradient(150deg, #BBC1C8, #969CA5); }
        .cc-in-tile .w3 { transform: translateZ(-3.4em); background: linear-gradient(150deg, #A5ABB4, #7E858E);
          box-shadow: 0 4.4em 4.4em -1.6em rgba(22,20,31,0.5); }
        .cc-in-tile .w2 { transform: translateZ(-2.2em); background: linear-gradient(150deg, #C2C7CE, #9EA5AE); }
        .cc-in-tile .w1 { transform: translateZ(-1.1em); background: linear-gradient(150deg, #D6DAE0, #B2B8C0); }
        .cc-in-tile .face {
          transform-style: preserve-3d;      /* keeps the label a true 3D layer, so it lies flat, not slanted */
          /* clean, near-flat light surface - no grey reflection banding */
          background: linear-gradient(150deg, #FBFCFD 0%, #EFF2F5 100%);
          /* thin crisp bevels (px, so they stay sharp) read as machined metal, not a soft cushion */
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.85),
            inset 0 2px 1px rgba(255,255,255,1),
            inset 0 -3px 3px rgba(22,20,31,0.18),
            inset 2px 0 3px rgba(255,255,255,0.4),
            inset -2px 0 4px rgba(22,20,31,0.08);
          transition: transform .55s cubic-bezier(.16,1,.3,1), box-shadow .55s ease;
        }
        /* a crisp diagonal glare travelling across the metal */
        .cc-in-tile .face::after {
          content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          background: linear-gradient(122deg,
            rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 24%,
            rgba(255,255,255,0) 60%, rgba(255,255,255,0.6) 86%, rgba(255,255,255,0) 100%);
          opacity: 0.85;
        }
        /* the label rides above the plate and counter-rotates the floor's spin,
           so it stays horizontal and readable while lying on the tilted surface */
        .cc-in-tile .label {
          position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 0.5em; text-align: center; padding: 1.4em;
          transform: translateZ(0.4em) rotate(${SPIN}deg); transform-origin: center;
          font-family: 'Universal Sans', sans-serif; font-weight: 800; font-size: 1.75em; line-height: 1.1;
          letter-spacing: -0.01em; color: rgba(22,20,31,0.82);
          transition: color .45s ease;
        }
        .cc-in-tile .label svg { width: 1.7em; height: 1.7em; flex: none; color: rgba(22,20,31,0.42); opacity: 0.85; }
        .cc-in-tile .dot {
          position: absolute; bottom: 1.6em; left: 50%; width: 0.9em; height: 0.9em; margin-left: -0.45em;
          border-radius: 50%; background: ${ACCENT_INK}; transform: translateZ(0.5em) rotate(${SPIN}deg);
          box-shadow: 0 0 0.9em rgba(106,91,232,0.8);
        }
        .cc-in-tile:hover .face { transform: translateZ(0.8em); }
        .cc-in-tile:hover .label { color: ${TEXT}; }
        .cc-in-tile.on { transform: translate3d(var(--tx), var(--ty), 2em) scale(var(--sc, 1)) !important; }
        .cc-in-tile.on .face {
          background: linear-gradient(150deg, #FFFFFF 0%, #F2F5F8 100%);
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.95),
            inset 0 0 0 3px rgba(153,142,255,0.55),
            inset 0 2px 1px rgba(255,255,255,1),
            inset 0 -3px 3px rgba(22,20,31,0.14),
            0 3em 4em -1.4em rgba(74,61,191,0.4);
        }
        .cc-in-tile.on .label { color: ${TEXT}; }
        .cc-in-tile.on .label svg { color: ${ACCENT_INK}; opacity: 1; }

        /* ---- the central control knob, sat at the front lip of the dais ---- */
        .cc-in-knob {
          position: absolute; top: 50%; left: 50%; width: 12.5em; height: 12.5em; margin: -6.25em 0 0 -6.25em;
          border-radius: 50%; transform-style: preserve-3d;
          transition: transform 1s cubic-bezier(.16,1,.3,1);
        }
        .cc-in-knob .base {
          position: absolute; inset: 0; border-radius: 50%; transform: translateZ(-2.6em);
          background: linear-gradient(#8F959E, #767C85); box-shadow: 0 3.4em 4em -1em rgba(22,20,31,0.5);
        }
        .cc-in-knob .base2 {
          position: absolute; inset: 8%; border-radius: 50%; transform: translateZ(-1.3em);
          background: linear-gradient(#AAB0B9, #878E97);
        }
        .cc-in-knob .rim {
          position: absolute; inset: 0; border-radius: 50%;
          background: conic-gradient(from 0deg, #EEF0F3, #C4CAD1, #F5F7F9, #C4CAD1, #EEF0F3);
          box-shadow: inset 0 0.3em 0.5em rgba(255,255,255,0.9), inset 0 0 0 0.14em rgba(255,255,255,0.7);
          display: grid; place-items: center;
        }
        .cc-in-knob .cap {
          width: 66%; height: 66%; border-radius: 50%;
          background: radial-gradient(circle at 42% 34%, #FFFFFF, #DCE0E5 72%, #C4CAD1);
          box-shadow: inset 0 0 1.4em rgba(22,20,31,0.16);
          display: grid; place-items: center;
        }
        .cc-in-knob .cap i {
          width: 22%; height: 22%; border-radius: 50%;
          background: #F3F5F7; box-shadow: inset 0 0 0 0.12em rgba(22,20,31,0.1);
        }
        .cc-in-knob .notch {
          position: absolute; top: 0.9em; left: 50%; width: 0.7em; height: 2.4em; margin-left: -0.35em;
          border-radius: 100px; background: ${ACCENT_INK}; box-shadow: 0 0 0.8em rgba(106,91,232,0.8);
        }

        /* ══════════ flat UI floating over the floor ══════════ */

        /* the three glass stat cards rising off the dial */
        /* the cards sit in the gap between the back tiles' labels and the knob, over the
           platform - low enough to clear the tile labels above, short enough to clear the knob */
        .cc-in-cards {
          position: absolute; top: 36%; left: 50%; transform: translateX(-50%);
          display: flex; gap: clamp(10px, 1vw, 16px); z-index: 6; pointer-events: none;
        }
        .cc-in-stat {
          width: clamp(84px, 7.4vw, 128px); height: clamp(104px, 8.8vw, 142px); border-radius: 18px;
          display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
          padding: 10px; will-change: transform, opacity;
          background: linear-gradient(155deg, rgba(255,255,255,0.62), rgba(232,242,244,0.34));
          backdrop-filter: blur(11px) saturate(1.4); -webkit-backdrop-filter: blur(11px) saturate(1.4);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.95),
            inset 0 0 0 1px rgba(255,255,255,0.6),
            0 26px 44px -22px rgba(22,20,31,0.5);
        }
        /* the outer pair fan out a touch, the middle one lifts - so the trio reads as an arc */
        .cc-in-stat:nth-child(1) { transform: translateX(clamp(-22px, -1.1vw, -10px)); }
        .cc-in-stat:nth-child(2) { transform: translateY(clamp(-52px, -2.6vw, -38px)); }
        .cc-in-stat:nth-child(3) { transform: translateX(clamp(10px, 1.1vw, 22px)); }
        .cc-in-stat b {
          font-family: 'Universal Sans', sans-serif; font-weight: 800; letter-spacing: -0.02em; font-variant-numeric: tabular-nums;
          font-size: clamp(26px, 2.7vw, 42px); line-height: 1; color: ${TEXT};
        }
        .cc-in-stat span {
          margin-top: 9px; font-family: 'Universal Sans', sans-serif; font-weight: 700;
          font-size: clamp(9px, 0.72vw, 11px); line-height: 1.35; letter-spacing: 0.4px;
          text-transform: uppercase; color: rgba(22,20,31,0.5);
        }

        /* the right helper panel */
        .cc-in-panel {
          position: absolute; top: 7%; right: 0; width: clamp(220px, 20vw, 292px); z-index: 5;
          padding: clamp(18px, 1.6vw, 24px); border-radius: 18px;
          background: linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.44));
          backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            inset 0 0 0 1px rgba(255,255,255,0.65),
            0 30px 54px -26px rgba(22,20,31,0.5);
        }
        .cc-in-panel .pcount {
          display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px;
          font-family: 'Universal Sans', sans-serif; font-variant-numeric: tabular-nums;
        }
        .cc-in-panel .pcount b { font-weight: 800; letter-spacing: -0.02em; font-size: clamp(30px, 2.6vw, 46px); line-height: 1; color: ${TEXT}; }
        .cc-in-panel .pcount span { font-size: clamp(13px, 1vw, 16px); color: rgba(22,20,31,0.42); }
        .cc-in-panel p {
          font-family: 'Universal Sans', sans-serif; font-size: clamp(12px, 0.95vw, 14px); line-height: 1.7;
          color: ${MUTED}; margin: 0;
        }
        .cc-in-track {
          margin-top: 16px; height: 3px; border-radius: 100px; overflow: hidden;
          background: rgba(22,20,31,0.12);
        }
        .cc-in-prog {
          display: block; height: 100%; border-radius: 100px; background: ${ACCENT};
          transform-origin: left center; transform: scaleX(0); will-change: transform;
        }

        /* the live console, bottom-right, glass */
        .cc-in-console {
          position: absolute; right: 0; bottom: 3%; z-index: 6;
          display: flex; align-items: center; gap: clamp(14px, 1.4vw, 22px);
          padding: clamp(12px, 1.1vw, 16px) clamp(16px, 1.5vw, 22px); border-radius: 14px;
          background: linear-gradient(168deg, rgba(255,255,255,0.97), rgba(255,255,255,0.82));
          backdrop-filter: blur(8px) saturate(1.3); -webkit-backdrop-filter: blur(8px) saturate(1.3);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            inset 0 0 0 1px rgba(22,20,31,0.07),
            0 30px 50px -26px rgba(22,20,31,0.55);
        }
        .cc-in-console .live {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: 'Universal Sans', sans-serif; font-weight: 800; font-size: 10px; letter-spacing: 1.6px;
          text-transform: uppercase; color: ${LIVE_INK};
        }
        .cc-in-console .live i { position: relative; width: 7px; height: 7px; border-radius: 50%; background: ${LIVE}; }
        .cc-in-console .live i::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%; border: 1px solid ${LIVE};
          animation: cc-ping 2.4s cubic-bezier(.16,1,.3,1) infinite;
        }
        @keyframes cc-ping { 0% { transform: scale(1); opacity: .6; } 70%, 100% { transform: scale(2.8); opacity: 0; } }
        .cc-in-console .fig { display: flex; flex-direction: column; gap: 3px; font-variant-numeric: tabular-nums; }
        .cc-in-console .fig b { font-family: 'Universal Sans', sans-serif; font-weight: 800; letter-spacing: -0.02em; font-size: clamp(18px, 1.5vw, 24px); line-height: 1; }
        .cc-in-console .fig span {
          font-family: 'Universal Sans', sans-serif; font-size: 10px; letter-spacing: 1.3px; text-transform: uppercase;
          font-weight: 700; color: rgba(22,20,31,0.45); white-space: nowrap;
        }
        .cc-in-console .bars { display: flex; align-items: flex-end; gap: 3px; height: 26px; }
        .cc-in-console .bars i {
          width: 4px; border-radius: 100px; background: ${ACCENT}; opacity: 0.8; height: 100%;
          transform-origin: bottom; transform: scaleY(var(--h)); will-change: transform;
          animation: cc-bar 1.3s cubic-bezier(.4,0,.6,1) infinite alternate; animation-delay: var(--d);
        }
        @keyframes cc-bar { from { transform: scaleY(calc(var(--h) * 0.3)); } to { transform: scaleY(var(--h)); } }

        /* the mobile rail: on small screens the floor is retired for a tap list */
        .cc-in-rail { display: none; }

        /* ── responsive ── */
        @media (max-width: 1180px) {
          .cc-in-mast { grid-template-columns: minmax(0, 1fr); align-items: start; }
          .cc-in-panel { display: none; }
        }
        @media (max-width: 860px) {
          .cc-in-scene, .cc-in-console.floating { display: none; }
          .cc-in-stage {
            position: static; min-height: 0; display: flex; flex-direction: column;
            align-items: stretch; gap: clamp(22px, 4vw, 32px);
          }
          .cc-in-cards, .cc-in-console {
            position: static; transform: none; width: 100%;
          }
          .cc-in-cards { justify-content: flex-start; flex-wrap: wrap; }
          .cc-in-stat:nth-child(1),
          .cc-in-stat:nth-child(2),
          .cc-in-stat:nth-child(3) { transform: none; }
          .cc-in-console { align-self: flex-start; width: auto; bottom: auto; }
          .cc-in-rail {
            display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px;
          }
          .cc-in-rail::-webkit-scrollbar { display: none; }
          .cc-in-rail button {
            flex: none; min-height: 44px; padding: 11px 18px; border-radius: 100px; cursor: pointer;
            border: 0; color: ${TEXT};
            background: linear-gradient(168deg, rgba(255,255,255,0.98), rgba(255,255,255,0.7));
            box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(22,20,31,0.14);
            font-family: 'Universal Sans', sans-serif; font-weight: 600; font-size: 14px; white-space: nowrap;
          }
          .cc-in-rail button.on {
            background: ${GLOSS}; color: #fff;
            box-shadow: ${ACCENT_RIM}, 0 10px 22px -12px rgba(74,61,191,0.7);
          }
        }
        @media (max-width: 420px) {
          .cc-in-stat { width: calc(50% - 6px); height: auto; padding: 16px 12px; flex-direction: row; gap: 12px; justify-content: flex-start; }
          .cc-in-stat b { min-width: 2.6ch; }
          .cc-in-stat span { margin-top: 0; text-align: left; }
        }

        /* ── large screens: everything below ~1728px keeps the tuned desktop look;
           above it the floor, stage and cards keep scaling with the viewport so the
           composition stays the same size *relative to the screen* on 2K / 4K ── */
        @media (min-width: 1728px) {
          .cc-in-floor { font-size: clamp(13.5px, 0.781vw, 30px); }
          .cc-in-stage { min-height: clamp(1020px, 56vw, 1560px); }
          .cc-in-stat { width: clamp(128px, 7.4vw, 200px); height: clamp(142px, 8.2vw, 232px); }
          .cc-in-stat b { font-size: clamp(42px, 2.42vw, 60px); }
          .cc-in-stat span { font-size: clamp(11px, 0.637vw, 16px); }
          .cc-in-panel { width: clamp(292px, 16.9vw, 440px); }
        }
        @media (min-width: 1843px) {
          .cc-in-title { font-size: clamp(118px, 6.4vw, 175px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-in-dais .top::after, .cc-in-console .bars i, .cc-in-console .live i::after { animation: none; }
          .cc-in-tile, .cc-in-knob, .cc-in-tile .face { transition: none; }
        }
      `}</style>

      <div className="cc-in-inner">
        {/* ── masthead ── */}
        <div className="cc-in-mast">
          <div>
            <motion.p className="cc-in-eyebrow" {...rise(0)}>
              <i aria-hidden /> Who We Serve
            </motion.p>
            <MaskReveal as="h2" className="cc-in-title" delay={0.05}>
              Six sectors.
              <motion.span
                key={`title-${sel}`}
                className="accent swap"
                initial={reduce ? false : { opacity: 0, y: '0.35em' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {active.name}.
              </motion.span>
            </MaskReveal>
          </div>
          <motion.div className="cc-in-index" {...rise(0.12)}>
            <ul className="cc-in-runs">
              {active.runs.map((r, i) => (
                <motion.li
                  key={`${sel}-${r}`}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                >
                  <i aria-hidden /> {r}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ── stage: floor + floating UI ── */}
        <motion.div
          className="cc-in-stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: EASE }}
        >
          {/* the isometric floor */}
          <div className="cc-in-scene" aria-hidden>
            <div className="cc-in-floor">
              <div className="cc-in-dais">
                <span className="side" />
                <span className="top" />
              </div>

              <svg className="cc-in-arcs" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="cc-in-arcV" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity="0.35" />
                    <stop offset="55%" stopColor={ACCENT} stopOpacity="0.95" />
                    <stop offset="100%" stopColor={ACCENT_INK} />
                  </linearGradient>
                  <linearGradient id="cc-in-arcT" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={LIVE} stopOpacity="0.35" />
                    <stop offset="55%" stopColor={LIVE} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={LIVE_INK} />
                  </linearGradient>
                  <marker id="cc-in-arrowV" markerWidth="5.4" markerHeight="5.4" refX="2.7" refY="2.7" orient="auto">
                    <path d="M0,0 L5.4,2.7 L0,5.4 Z" fill={ACCENT_INK} />
                  </marker>
                  <marker id="cc-in-arrowT" markerWidth="5.4" markerHeight="5.4" refX="2.7" refY="2.7" orient="auto">
                    <path d="M0,0 L5.4,2.7 L0,5.4 Z" fill={LIVE_INK} />
                  </marker>
                </defs>
                {/* purple arc sweeps the back half, teal the front - together a ring round the cards */}
                <path d="M 10,50 A 40,40 0 0,1 90,50" stroke="url(#cc-in-arcV)" markerEnd="url(#cc-in-arrowV)" />
                <path d="M 90,50 A 40,40 0 0,1 10,50" stroke="url(#cc-in-arcT)" markerEnd="url(#cc-in-arrowT)" />
              </svg>

              {SECTORS.map((s, i) => {
                const a = (RING[i] * Math.PI) / 180
                const on = i === sel
                /* the two back tiles (Fintech, SaaS) read larger, like the reference -
                   they also sit on a wider radius so the upscale doesn't crowd the centre */
                const big = i === 0 || i === 1
                /* the top pair (0,1) and the two mid-height side tiles (2 right, 5 left)
                   get an extra push out, so those 4 spread a little wider while the two
                   front tiles (3,4) stay where they are */
                const side = i === 2 || i === 5
                const sc = big ? 1.24 : 1
                const r = R + (big ? 8.5 : 0) + (big || side ? 3.5 : 0)
                const x = (Math.cos(a) * r).toFixed(2)
                const y = (Math.sin(a) * r).toFixed(2)
                return (
                  <button
                    key={s.code}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-label={s.name}
                    className={`cc-in-tile${on ? ' on' : ''}`}
                    style={{
                      ['--tx' as string]: `${x}em`,
                      ['--ty' as string]: `${y}em`,
                      ['--sc' as string]: sc,
                      transform: `translate3d(${x}em, ${y}em, 0) scale(${sc})`,
                    }}
                    onClick={() => pick(i)}
                  >
                    <span className="wall w3" aria-hidden />
                    <span className="wall w2" aria-hidden />
                    <span className="wall w1" aria-hidden />
                    <span className="face">
                      <span className="label"><s.Icon aria-hidden /> {s.name}</span>
                      {on && <span className="dot" aria-hidden />}
                    </span>
                  </button>
                )
              })}

              {/* the knob sits at the front lip of the dais; its notch turns to the live sector */}
              <div
                className="cc-in-knob"
                style={{ transform: `translate3d(-1.5em, 3.5em, 1.6em) rotate(${RING[sel] + 90}deg)` }}
                aria-hidden
              >
                <span className="base" />
                <span className="base2" />
                <span className="rim">
                  <span className="cap"><i /></span>
                </span>
                <span className="notch" />
              </div>
            </div>
          </div>

          {/* the three glass stats rising off the dial */}
          <motion.div
            className="cc-in-cards"
            key={`cards-${sel}`}
            initial={reduce ? false : { opacity: 0, scale: 0.94, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {active.stats.map(([v, l]) => (
              <div className="cc-in-stat" key={l}>
                <b>{v}</b>
                <span>{l}</span>
              </div>
            ))}
          </motion.div>

          {/* the right helper panel */}
          <aside className="cc-in-panel">
            <p className="pcount">
              <b>{String(sel + 1).padStart(2, '0')}</b>
              <span>/ 06 on the dial</span>
            </p>
            <p>
              Turn the dial, or click any tile. Each sector is staffed by agents who already know its
              products, its policies and its toughest scenarios.
            </p>
            <div className="cc-in-track"><span className="cc-in-prog" ref={progRef} /></div>
          </aside>

          {/* the live console */}
          <div className="cc-in-console floating">
            <span className="live"><i aria-hidden /> Live</span>
            <span className="fig"><b>{queue}</b><span>In queue</span></span>
            <span className="fig"><b>{active.answer}</b><span>Answered in</span></span>
            <span className="bars" aria-hidden>
              {[0.4, 0.72, 0.55, 0.94, 0.62, 0.85, 0.48].map((h, i) => (
                <i key={i} style={{ ['--h' as string]: h, ['--d' as string]: `${i * 0.1}s` }} />
              ))}
            </span>
          </div>

          {/* mobile only: the floor is retired, sectors become a tap rail */}
          <div className="cc-in-rail" role="tablist" aria-label="Choose a sector">
            {SECTORS.map((s, i) => (
              <button
                key={s.code}
                type="button"
                role="tab"
                aria-selected={i === sel}
                className={i === sel ? 'on' : undefined}
                onClick={() => pick(i)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
