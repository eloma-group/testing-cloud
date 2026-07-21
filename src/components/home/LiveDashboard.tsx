import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { PhoneCall, Clock, Smile, Headphones, Globe, Heart } from 'lucide-react'
import { MaskReveal } from '../../lib/anim'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* Each stat card is a small self-contained design: tinted icon disc, label,
   big value, and a hand-tuned sparkline in its own accent colour.
   `dx` is the exact fraction (0-1) of this card's connector-dot OUTER edge inside
   the hub image, and `dy` its centre; the card's inner edge is anchored straight
   onto that outer edge so every card just touches its dot with the same zero gap
   on both sides - the photo, lines and cards read as one. */
type Card = {
  key: string
  side: 'l' | 'r'
  label: string
  value: string
  unit?: string
  color: string
  tint: string
  dx: number
  dy: number
  spark: string           // polyline points in a 240x46 box
  icon: 'phone' | 'clock' | 'smile' | 'headset' | 'globe' | 'map'
}

/* order is interleaved (l, r, l, r, ...) so the stacked mobile grid reads in
   tidy rows; on desktop the cards are absolutely placed so order is cosmetic */
const CARDS: Card[] = [
  { key: 'calls', side: 'l', label: "Today's calls", value: '12,548', color: '#25C07A', tint: 'rgba(37,192,122,0.13)',
    dx: 0.2518, dy: 0.2282, icon: 'phone', spark: '0,34 18,30 32,33 46,24 62,29 78,20 92,26 108,17 124,23 140,14 156,20 172,12 188,16 206,9 222,13 240,6' },
  { key: 'agents', side: 'r', label: 'Agents online', value: '326', color: '#4C7DF0', tint: 'rgba(76,125,240,0.13)',
    dx: 0.7398, dy: 0.2278, icon: 'headset', spark: '0,28 18,22 32,27 48,19 64,25 80,17 96,23 112,16 128,22 144,13 160,20 176,24 192,17 208,23 224,15 240,19' },
  { key: 'wait', side: 'l', label: 'Average wait time', value: '18', unit: 'sec', color: '#8B7FF5', tint: 'rgba(139,127,245,0.14)',
    dx: 0.1836, dy: 0.4719, icon: 'clock', spark: '0,24 18,28 32,20 46,27 62,18 78,26 94,21 110,30 126,19 142,25 158,16 174,24 190,18 206,27 222,20 240,23' },
  { key: 'langs', side: 'r', label: 'Languages', value: '18', color: '#22B8A6', tint: 'rgba(34,184,166,0.14)',
    dx: 0.8074, dy: 0.4765, icon: 'globe', spark: '0,26 16,30 30,22 46,28 62,20 78,27 94,19 110,26 126,18 142,25 158,17 176,24 192,19 208,27 224,21 240,24' },
  { key: 'csat', side: 'l', label: 'Customer satisfaction', value: '98.7', unit: '%', color: '#F5A524', tint: 'rgba(245,165,36,0.15)',
    dx: 0.2153, dy: 0.7289, icon: 'smile', spark: '0,32 18,26 34,30 50,22 66,27 82,18 98,24 114,20 130,25 146,15 162,21 178,13 194,18 210,10 226,15 240,9' },
  { key: 'countries', side: 'r', label: 'Countries served', value: '24', color: '#EC5F8B', tint: 'rgba(236,95,139,0.13)',
    dx: 0.7763, dy: 0.7324, icon: 'map', spark: '0,30 18,25 34,29 50,21 66,26 82,19 98,24 114,28 130,20 146,26 162,18 178,24 194,17 210,23 226,16 240,21' },
]

function Sparkline({ color, points }: { color: string; points: string }) {
  return (
    <svg className="cc-ld-spark" viewBox="0 0 240 46" preserveAspectRatio="none" aria-hidden>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.4"
        strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function CardIcon({ icon, color }: { icon: Card['icon']; color: string }) {
  const p = { size: 26, strokeWidth: 2.1, color, 'aria-hidden': true } as const
  switch (icon) {
    case 'phone':   return <PhoneCall {...p} />
    case 'clock':   return <Clock {...p} />
    case 'smile':   return <Smile {...p} />
    case 'headset': return <Headphones {...p} />
    case 'globe':   return <Globe {...p} />
    case 'map':     return <img className="cc-ld-map" src="/images/home/worldmap-pink.webp"
                      alt="" width={52} height={24} loading="lazy" decoding="async" />
  }
}

function StatCard({ c, i, reduce }: { c: Card; i: number; reduce: boolean }) {
  return (
    /* slot handles the absolute placement + vertical centring on the dot;
       the inner motion card is free to run its own entry transform */
    <div className={`cc-ld-slot cc-ld-slot-${c.side}`}
      style={{ ['--dx' as string]: c.dx, ['--dy' as string]: c.dy }}>
      <motion.div
        className={`cc-ld-card cc-ld-card-${c.side}`}
        style={{ ['--c' as string]: c.color }}
        initial={reduce ? false : { opacity: 0, x: c.side === 'l' ? -28 : 28, y: 8 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ delay: 0.15 + i * 0.09, duration: 0.75, ease: EASE }}
      >
        <span className="cc-ld-ico" style={{ background: c.tint }}>
          <CardIcon icon={c.icon} color={c.color} />
        </span>
        <div className="cc-ld-body">
          <span className="cc-ld-label">{c.label}</span>
          <span className="cc-ld-val">{c.value}{c.unit && <em>{c.unit}</em>}</span>
        </div>
        <Sparkline color={c.color} points={c.spark} />
      </motion.div>
    </div>
  )
}

export function LiveDashboard() {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section className="cc-ld" aria-label="Live operations dashboard">
      <style>{`
        .cc-ld {
          position: relative; overflow: hidden;
          background: #FFFFFF;
        }
        .cc-ld-inner {
          position: relative; z-index: 1;
          max-width: min(calc(100vw - 100px), 1780px); margin: 0 auto;
          padding: clamp(64px, 9vw, 140px) clamp(24px, 4vw, 72px) clamp(56px, 7vw, 112px);
        }

        /* ── header ── */
        .cc-ld-head { text-align: center; position: relative; z-index: 2; }
        .cc-ld-eye {
          display: inline-flex; align-items: center; gap: 9px;
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(11px, 0.85vw, 13px); letter-spacing: 3px; color: #25C07A;
        }
        .cc-ld-eye i {
          width: 8px; height: 8px; border-radius: 50%; background: #25C07A;
          box-shadow: 0 0 0 4px rgba(37,192,122,0.16);
          animation: ccLdPulse 1.9s ease-in-out infinite; will-change: transform, opacity;
        }
        .cc-ld-title {
          margin: clamp(12px, 1.4vw, 20px) 0 0;
          font-family: 'Eloma Sans', sans-serif; letter-spacing: -0.02em;
          font-size: clamp(32px, 4.6vw, 68px); line-height: 1.02; color: #1B2733;
        }
        .cc-ld-rule {
          width: clamp(44px, 4vw, 64px); height: 4px; border-radius: 3px; margin: clamp(14px, 1.4vw, 20px) auto 0;
          background: linear-gradient(90deg, #25C07A, #22B8A6);
        }
        .cc-ld-sub {
          margin: clamp(14px, 1.6vw, 22px) auto 0; max-width: 44ch;
          font-family: 'Eloma Sans', sans-serif; font-weight: 500;
          font-size: clamp(14px, 1.2vw, 18px); line-height: 1.5; color: #7C8BA0;
        }

        /* ── stage: full-width hub image with cards pinned to its line dots ── */
        .cc-ld-stage {
          position: relative; z-index: 2;
          width: 100%; margin-top: clamp(30px, 4vw, 60px);
          aspect-ratio: 1672 / 941;
        }
        .cc-ld-hub {
          position: absolute; inset: 0; z-index: 1;
          width: 100%; height: 100%; object-fit: contain;
          display: block; pointer-events: none;
        }

        /* ── card slot: absolute placement anchored to the dot ──
           left slot's right edge = dot x; right slot's left edge = dot x.
           width grows to the stage edge on smaller screens (tight bezel) but
           caps on huge screens so cards never get oversized. */
        .cc-ld-slot {
          position: absolute; z-index: 2;
          top: calc(var(--dy) * 100%); transform: translateY(-50%);
        }
        /* dx already IS the dot's outer edge, so the card's inner edge lands
           exactly on it - identical zero gap on both sides, no overlap */
        .cc-ld-slot-l {
          right: calc((1 - var(--dx)) * 100%);
          width: min(calc(var(--dx) * 100% - 12px), 480px);
        }
        .cc-ld-slot-r {
          left: calc(var(--dx) * 100%);
          width: min(calc((1 - var(--dx)) * 100% - 12px), 480px);
        }

        /* ── card ── */
        .cc-ld-card {
          position: relative; z-index: 2; width: 100%;
          display: grid; grid-template-columns: auto minmax(0,1fr);
          column-gap: clamp(14px, 1.2vw, 20px); row-gap: 8px; align-items: center;
          padding: clamp(18px, 1.7vw, 26px) clamp(26px, 2.4vw, 44px);
          /* full capsule - fat pill ends on the left and right */
          border-radius: 999px;
          background: linear-gradient(158deg, #FFFFFF 0%, #F1F4FA 52%, #E4EAF4 100%);
          box-shadow:
            inset 0 2px 1px rgba(255,255,255,0.95),
            inset 0 -16px 26px -18px rgba(31,44,61,0.16),
            inset 0 0 0 1px rgba(255,255,255,0.9),
            0 2px 4px rgba(31,44,61,0.06),
            0 12px 22px -14px rgba(31,44,61,0.28),
            0 30px 52px -26px rgba(31,44,61,0.32),
            0 54px 84px -44px rgba(31,44,61,0.26);
          transition: transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s ease;
          will-change: transform;
        }
        .cc-ld-card:hover {
          transform: translateY(-7px) scale(1.02);
          box-shadow:
            inset 0 2px 1px rgba(255,255,255,0.95),
            inset 0 -16px 26px -18px rgba(31,44,61,0.16),
            inset 0 0 0 1px rgba(255,255,255,0.95),
            0 3px 8px rgba(31,44,61,0.07),
            0 20px 34px -16px rgba(31,44,61,0.32),
            0 44px 72px -26px rgba(31,44,61,0.42),
            0 74px 110px -50px rgba(31,44,61,0.32);
        }
        .cc-ld-ico {
          grid-row: 1 / 3; align-self: center;
          display: grid; place-items: center; flex: none;
          width: clamp(48px, 3.6vw, 64px); aspect-ratio: 1; border-radius: 50%;
          box-shadow:
            inset 0 2px 3px rgba(255,255,255,0.9),
            inset 0 -4px 7px rgba(31,44,61,0.10),
            0 6px 14px -6px rgba(31,44,61,0.22);
        }
        .cc-ld-map { width: 60%; height: auto; object-fit: contain; }
        .cc-ld-body { grid-column: 2; grid-row: 1; min-width: 0; }
        .cc-ld-label {
          display: block; font-family: 'Eloma Sans', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(10px, 0.8vw, 12px); letter-spacing: 1.4px;
          color: #90A0B3; margin-bottom: 5px;
          line-height: 1.35; overflow-wrap: break-word;
        }
        .cc-ld-val {
          display: block; font-family: 'Eloma Sans', sans-serif; font-weight: 800;
          font-size: clamp(24px, 2.4vw, 40px); line-height: 1; letter-spacing: -0.02em; color: #1B2733;
        }
        .cc-ld-val em { font-style: normal; font-weight: 700; font-size: 0.5em; color: var(--c); margin-left: 4px; }
        .cc-ld-spark { grid-column: 2; grid-row: 2; width: 100%; height: clamp(24px, 2.2vw, 34px); display: block; }

        /* ── caption + footer ── */
        .cc-ld-script {
          text-align: center; margin: clamp(22px, 3vw, 40px) 0 0; position: relative; z-index: 2;
          font-family: 'Eloma Sans', sans-serif; font-weight: 700;
          font-size: clamp(28px, 3.4vw, 46px); line-height: 1; color: #4C7DF0;
        }
        .cc-ld-script em { font-style: normal; color: #22B8A6; }
        .cc-ld-foot {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          margin: clamp(34px, 5vw, 64px) auto 0; position: relative; z-index: 2;
          width: min(100%, 56%); min-height: 90px; padding: 0 clamp(20px, 3vw, 40px);
          border-radius: 60px; background: #FFFFFF; text-align: center;
          box-shadow: 0 40px 90px -50px rgba(31,44,61,0.18);
          font-family: 'Eloma Sans', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: clamp(11px, 0.9vw, 13px); letter-spacing: 3.5px; color: #90A0B3;
        }
        .cc-ld-foot svg { color: #22B8A6; }

        @keyframes ccLdPulse { 0%,100%{ transform: scale(1); opacity:1 } 50%{ transform: scale(0.7); opacity:0.5 } }

        @media (min-width: 1920px) { .cc-ld-inner { max-width: min(calc(100vw - 130px), 2020px); } }
        @media (min-width: 2560px) { .cc-ld-inner { max-width: min(calc(100vw - 150px), 2400px); } }

        /* ── stack: hub on top, all six cards in a uniform grid below ── */
        @media (max-width: 1200px) {
          .cc-ld-stage {
            aspect-ratio: auto;
            display: grid; grid-template-columns: repeat(2, minmax(0,1fr));
            gap: clamp(16px, 3vw, 26px); align-items: start;
            margin-top: clamp(28px, 4vw, 48px);
          }
          .cc-ld-hub {
            position: static; grid-column: 1 / -1; order: -1;
            width: 100%; max-width: 660px; height: auto;
            margin: 0 auto clamp(6px, 2vw, 18px);
          }
          .cc-ld-slot {
            position: static; transform: none; width: auto;
          }
          .cc-ld-foot { width: min(100%, 86%); }
        }
        @media (max-width: 600px) {
          .cc-ld-inner { max-width: 100%; }
          .cc-ld-stage { grid-template-columns: minmax(0,1fr); }
          .cc-ld-foot { width: 100%; min-height: 76px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-ld-eye i { animation: none; }
          .cc-ld-card { transition: none; }
        }
      `}</style>

      <div className="cc-ld-inner" ref={ref}>
        {/* ── Header ── */}
        <div className="cc-ld-head">
          <MaskReveal as="span" className="cc-ld-eye" duration={0.9}>
            <i aria-hidden />Live
          </MaskReveal>
          <MaskReveal as="h2" className="cc-ld-title" duration={1} delay={0.06}>
            Live Operations Dashboard
          </MaskReveal>
          <motion.div className="cc-ld-rule"
            initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }} transition={{ delay: 0.25, duration: 0.7, ease: EASE }} />
          <motion.p className="cc-ld-sub"
            initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }} transition={{ delay: 0.3, duration: 0.7, ease: EASE }}>
            Real people. Real conversations. Real time.
          </motion.p>
        </div>

        {/* ── Stage: hub image + cards pinned to its line dots ── */}
        <div className="cc-ld-stage">
          <motion.img className="cc-ld-hub"
            src="/images/home/live-hub.webp"
            alt="Support agents on live calls at the Nexa floor, linked to real-time metrics"
            width={1672} height={941} decoding="async" loading="lazy"
            initial={reduce ? false : { opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1, ease: EASE }} />

          {CARDS.map((c, i) => <StatCard key={c.key} c={c} i={i} reduce={reduce} />)}
        </div>

        <motion.p className="cc-ld-script"
          initial={reduce ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }} transition={{ delay: 0.2, duration: 0.8, ease: EASE }}>
          Connecting every <em>moment.</em>
        </motion.p>

        <motion.div className="cc-ld-foot"
          initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }} transition={{ delay: 0.15, duration: 0.9, ease: EASE }}>
          Powered by people. Driven by purpose.
          <Heart size={15} strokeWidth={2.2} fill="currentColor" aria-hidden />
        </motion.div>
      </div>
    </section>
  )
}
