import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { PhoneCall, Clock, Smile, Headphones, Globe, Heart } from 'lucide-react'
import { MaskReveal } from '../../lib/anim'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* Each stat card is a small self-contained design: tinted icon disc, label,
   big value, and a hand-tuned sparkline in its own accent colour. */
type Card = {
  key: string
  side: 'l' | 'r'
  label: string
  value: string
  unit?: string
  color: string
  tint: string
  spark: string           // polyline points in a 240x46 box
  icon: 'phone' | 'clock' | 'smile' | 'headset' | 'globe' | 'map'
}

const CARDS: Card[] = [
  { key: 'calls', side: 'l', label: "Today's calls", value: '12,548', color: '#25C07A', tint: 'rgba(37,192,122,0.13)',
    icon: 'phone', spark: '0,34 18,30 32,33 46,24 62,29 78,20 92,26 108,17 124,23 140,14 156,20 172,12 188,16 206,9 222,13 240,6' },
  { key: 'wait', side: 'l', label: 'Average wait time', value: '18', unit: 'sec', color: '#8B7FF5', tint: 'rgba(139,127,245,0.14)',
    icon: 'clock', spark: '0,24 18,28 32,20 46,27 62,18 78,26 94,21 110,30 126,19 142,25 158,16 174,24 190,18 206,27 222,20 240,23' },
  { key: 'csat', side: 'l', label: 'Customer satisfaction', value: '98.7', unit: '%', color: '#F5A524', tint: 'rgba(245,165,36,0.15)',
    icon: 'smile', spark: '0,32 18,26 34,30 50,22 66,27 82,18 98,24 114,20 130,25 146,15 162,21 178,13 194,18 210,10 226,15 240,9' },
  { key: 'agents', side: 'r', label: 'Agents online', value: '326', color: '#4C7DF0', tint: 'rgba(76,125,240,0.13)',
    icon: 'headset', spark: '0,28 18,22 32,27 48,19 64,25 80,17 96,23 112,16 128,22 144,13 160,20 176,24 192,17 208,23 224,15 240,19' },
  { key: 'langs', side: 'r', label: 'Languages', value: '18', color: '#22B8A6', tint: 'rgba(34,184,166,0.14)',
    icon: 'globe', spark: '0,26 16,30 30,22 46,28 62,20 78,27 94,19 110,26 126,18 142,25 158,17 176,24 192,19 208,27 224,21 240,24' },
  { key: 'countries', side: 'r', label: 'Countries served', value: '24', color: '#EC5F8B', tint: 'rgba(236,95,139,0.13)',
    icon: 'map', spark: '0,30 18,25 34,29 50,21 66,26 82,19 98,24 114,28 130,20 146,26 162,18 178,24 194,17 210,23 226,16 240,21' },
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
      {/* connector nub on the inner edge */}
      <span className="cc-ld-nub" aria-hidden />
    </motion.div>
  )
}

export function LiveDashboard() {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const left = CARDS.filter((c) => c.side === 'l')
  const right = CARDS.filter((c) => c.side === 'r')

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
        .cc-ld::before, .cc-ld::after { display: none; }

        /* ── header ── */
        .cc-ld-head { text-align: center; position: relative; z-index: 2; }
        .cc-ld-eye {
          display: inline-flex; align-items: center; gap: 9px;
          font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(11px, 0.85vw, 13px); letter-spacing: 3px; color: #25C07A;
        }
        .cc-ld-eye i {
          width: 8px; height: 8px; border-radius: 50%; background: #25C07A;
          box-shadow: 0 0 0 4px rgba(37,192,122,0.16);
          animation: ccLdPulse 1.9s ease-in-out infinite; will-change: transform, opacity;
        }
        .cc-ld-title {
          margin: clamp(12px, 1.4vw, 20px) 0 0;
          font-family: 'Universal Sans', sans-serif; letter-spacing: -0.02em;
          font-size: clamp(32px, 4.6vw, 68px); line-height: 1.02; color: #1B2733;
        }
        .cc-ld-rule {
          width: clamp(44px, 4vw, 64px); height: 4px; border-radius: 3px; margin: clamp(14px, 1.4vw, 20px) auto 0;
          background: linear-gradient(90deg, #25C07A, #22B8A6);
        }
        .cc-ld-sub {
          margin: clamp(14px, 1.6vw, 22px) auto 0; max-width: 44ch;
          font-family: 'Universal Sans', sans-serif; font-weight: 500;
          font-size: clamp(14px, 1.2vw, 18px); line-height: 1.5; color: #7C8BA0;
        }

        /* ── stage: left cards | blob | right cards ── */
        .cc-ld-stage {
          position: relative; z-index: 2;
          display: grid; grid-template-columns: 1fr clamp(340px, 34vw, 540px) 1fr;
          align-items: center; gap: clamp(18px, 2.4vw, 40px);
          margin-top: clamp(34px, 4.5vw, 72px);
        }
        .cc-ld-col { display: flex; flex-direction: column; gap: clamp(18px, 2vw, 32px); }

        /* connector lines behind the cards */
        .cc-ld-wires {
          position: absolute; inset: 0; width: 100%; height: 100%;
          z-index: 1; pointer-events: none; overflow: visible;
        }
        .cc-ld-wires path {
          fill: none; stroke-linecap: round; vector-effect: non-scaling-stroke;
        }
        /* wide soft ribbon that swells as it nears the photo, like flowing wind */
        .cc-ld-wireribbon path { stroke-width: 26; opacity: 0.5; }
        .cc-ld-wireglow path   { stroke-width: 11; opacity: 0.55; }
        .cc-ld-wirecore path   { stroke-width: 2.6; opacity: 0.95; }
        .cc-ld-wireribbon, .cc-ld-wireglow {
          transform-origin: 500px 207px; will-change: transform;
          animation: ccLdDrift 10s ease-in-out infinite;
        }
        .cc-ld-wireglow { animation-duration: 12.5s; animation-direction: reverse; }

        /* ── card ── */
        .cc-ld-card {
          position: relative; z-index: 2;
          display: grid; grid-template-columns: auto minmax(0,1fr);
          column-gap: clamp(14px, 1.2vw, 20px); row-gap: 8px; align-items: center;
          padding: clamp(18px, 1.6vw, 24px) clamp(22px, 2vw, 32px);
          border-radius: clamp(24px, 2.4vw, 34px);
          background: linear-gradient(165deg, #FFFFFF 0%, #EDF1F8 100%);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.95) inset,
            0 -10px 20px -14px rgba(31,44,61,0.12) inset,
            0 2px 5px rgba(31,44,61,0.05),
            0 14px 26px -18px rgba(31,44,61,0.28),
            0 34px 60px -30px rgba(31,44,61,0.32),
            inset 0 0 0 1px rgba(255,255,255,0.8);
          transition: transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s ease;
          will-change: transform;
        }
        .cc-ld-card:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.95) inset,
            0 -10px 20px -14px rgba(31,44,61,0.12) inset,
            0 3px 8px rgba(31,44,61,0.06),
            0 20px 34px -18px rgba(31,44,61,0.3),
            0 46px 78px -28px rgba(31,44,61,0.4),
            inset 0 0 0 1px rgba(255,255,255,0.85);
        }
        .cc-ld-ico {
          grid-row: 1 / 3; align-self: center;
          display: grid; place-items: center; flex: none;
          width: clamp(50px, 4vw, 64px); aspect-ratio: 1; border-radius: 50%;
          box-shadow:
            inset 0 2px 3px rgba(255,255,255,0.9),
            inset 0 -4px 7px rgba(31,44,61,0.10),
            0 6px 14px -6px rgba(31,44,61,0.22);
        }
        .cc-ld-map { width: 60%; height: auto; object-fit: contain; }
        .cc-ld-body { grid-column: 2; grid-row: 1; min-width: 0; }
        .cc-ld-label {
          display: block; font-family: 'Universal Sans', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(10px, 0.8vw, 12px); letter-spacing: 1.4px;
          color: #90A0B3; margin-bottom: 5px;
          /* "Customer satisfaction" outruns the card column on narrow viewports -
             wrap it rather than truncate, so no label ever reads half-cut */
          line-height: 1.35; overflow-wrap: break-word;
        }
        .cc-ld-val {
          display: block; font-family: 'Universal Sans', sans-serif; font-weight: 800;
          font-size: clamp(26px, 2.6vw, 40px); line-height: 1; letter-spacing: -0.02em; color: #1B2733;
        }
        .cc-ld-val em { font-style: normal; font-weight: 700; font-size: 0.5em; color: var(--c); margin-left: 4px; }
        .cc-ld-spark { grid-column: 2; grid-row: 2; width: 100%; height: clamp(26px, 2.4vw, 34px); display: block; }

        .cc-ld-nub {
          position: absolute; top: 50%; width: 13px; height: 13px; border-radius: 50%;
          background: var(--c); transform: translateY(-50%);
          box-shadow: 0 0 0 4px #FFFFFF, 0 0 0 5px rgba(31,44,61,0.06);
        }
        .cc-ld-card-l .cc-ld-nub { right: -6px; }
        .cc-ld-card-r .cc-ld-nub { left: -6px; }

        /* narrower cards pushed to the outer edge, so the connectors run longer */
        .cc-ld-card-l { width: 90%; align-self: flex-start; }
        .cc-ld-card-r { width: 90%; align-self: flex-end; }

        /* ── centre blob ── */
        .cc-ld-blob { position: relative; z-index: 2; width: 100%; aspect-ratio: 1; }
        .cc-ld-blob svg { display: block; width: 100%; height: 100%; overflow: visible; }
        .cc-ld-blobwrap {
          animation: ccLdFloat 7s ease-in-out infinite; will-change: transform;
          transform-origin: center;
        }
        /* ── caption + footer ── */
        .cc-ld-script {
          text-align: center; margin: clamp(22px, 3vw, 40px) 0 0; position: relative; z-index: 2;
          font-family: 'Universal Sans', sans-serif; font-weight: 700;
          font-size: clamp(28px, 3.4vw, 46px); line-height: 1; color: #4C7DF0;
        }
        .cc-ld-script em { font-style: normal; color: #22B8A6; }
        /* footer sits inside its own soft pill, text vertically centred */
        .cc-ld-foot {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          margin: clamp(34px, 5vw, 64px) auto 0; position: relative; z-index: 2;
          width: min(100%, 56%); min-height: 90px; padding: 0 clamp(20px, 3vw, 40px);
          border-radius: 60px; background: #FFFFFF; text-align: center;
          box-shadow: 0 40px 90px -50px rgba(31,44,61,0.18);
          font-family: 'Universal Sans', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: clamp(11px, 0.9vw, 13px); letter-spacing: 3.5px; color: #90A0B3;
        }
        .cc-ld-foot svg { color: #22B8A6; }

        @keyframes ccLdPulse { 0%,100%{ transform: scale(1); opacity:1 } 50%{ transform: scale(0.7); opacity:0.5 } }
        @keyframes ccLdFloat { 0%,100%{ transform: translateY(-6px) } 50%{ transform: translateY(6px) } }
        @keyframes ccLdDrift {
          0%,100% { transform: translate3d(0,0,0) rotate(0deg) scale(1); }
          50%     { transform: translate3d(2px,-3px,0) rotate(1.6deg) scale(1.03); }
        }

        @media (min-width: 1920px) { .cc-ld-inner { max-width: min(calc(100vw - 130px), 2020px); } }
        @media (min-width: 2560px) { .cc-ld-inner { max-width: min(calc(100vw - 150px), 2400px); } }

        /* ── stack: blob on top, all six cards in one uniform grid ── */
        @media (max-width: 980px) {
          .cc-ld-stage {
            grid-template-columns: repeat(2, minmax(0,1fr));
            gap: clamp(18px, 3vw, 24px); align-items: start;
          }
          .cc-ld-blob { grid-column: 1 / -1; order: -1; max-width: 400px; margin: 0 auto clamp(8px,2vw,20px); }
          .cc-ld-wires { display: none; }
          .cc-ld-nub { display: none; }
          .cc-ld-col { display: contents; }   /* let the 6 cards flow in the stage grid */
          .cc-ld-card-l, .cc-ld-card-r { width: 100%; align-self: stretch; }
          .cc-ld-foot { width: min(100%, 86%); }
        }
        @media (max-width: 600px) {
          .cc-ld-inner { max-width: 100%; }
          .cc-ld-stage { grid-template-columns: minmax(0,1fr); }
          .cc-ld-foot { width: 100%; min-height: 76px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-ld-eye i, .cc-ld-blobwrap,
          .cc-ld-wireribbon, .cc-ld-wireglow { animation: none; }
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

        {/* ── Stage ── */}
        <div className="cc-ld-stage">
          {/* connector wires (desktop) - anchored to the measured nub + blob-edge
             positions; viewBox aspect matches the stage so strokes stay uniform */}
          <svg className="cc-ld-wires" viewBox="0 0 1000 414" preserveAspectRatio="none" aria-hidden>
            <defs>
              {/* each connector leaves its card as a crisp line, then swells into a
                 soft wind ribbon that wraps the photo and fades into its halo */}
              <linearGradient id="ccWireGN" gradientUnits="userSpaceOnUse" x1="282" y1="62" x2="420" y2="180">
                <stop offset="0" stopColor="#25C07A" stopOpacity="0.9" />
                <stop offset="0.45" stopColor="#3FD3A0" stopOpacity="0.7" />
                <stop offset="1" stopColor="#8FE3C2" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ccWirePU" gradientUnits="userSpaceOnUse" x1="282" y1="207" x2="410" y2="275">
                <stop offset="0" stopColor="#8B7FF5" stopOpacity="0.9" />
                <stop offset="0.45" stopColor="#A79EF8" stopOpacity="0.7" />
                <stop offset="1" stopColor="#C9C4F7" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ccWireOR" gradientUnits="userSpaceOnUse" x1="282" y1="352" x2="420" y2="235">
                <stop offset="0" stopColor="#F5A524" stopOpacity="0.9" />
                <stop offset="0.45" stopColor="#F8BE5E" stopOpacity="0.66" />
                <stop offset="1" stopColor="#FBD9A5" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ccWireBL" gradientUnits="userSpaceOnUse" x1="718" y1="62" x2="580" y2="180">
                <stop offset="0" stopColor="#4C7DF0" stopOpacity="0.9" />
                <stop offset="0.45" stopColor="#7B9FF5" stopOpacity="0.7" />
                <stop offset="1" stopColor="#B7CCF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ccWireTE" gradientUnits="userSpaceOnUse" x1="718" y1="207" x2="590" y2="275">
                <stop offset="0" stopColor="#22B8A6" stopOpacity="0.9" />
                <stop offset="0.45" stopColor="#5CD0C2" stopOpacity="0.7" />
                <stop offset="1" stopColor="#9BDFD6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ccWirePK" gradientUnits="userSpaceOnUse" x1="718" y1="352" x2="580" y2="235">
                <stop offset="0" stopColor="#EC5F8B" stopOpacity="0.9" />
                <stop offset="0.45" stopColor="#F189AB" stopOpacity="0.66" />
                <stop offset="1" stopColor="#F5BFD3" stopOpacity="0" />
              </linearGradient>
              <filter id="ccWireSoft" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <filter id="ccWireHaze" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.6" />
              </filter>
            </defs>
            {/* wide, blurred wind ribbon */}
            <g className="cc-ld-wireribbon" filter="url(#ccWireSoft)">
              <path d="M282 62 C 348 58, 392 68, 418 96 C 442 122, 436 158, 414 186" stroke="url(#ccWireGN)" />
              <path d="M282 207 C 340 204, 372 212, 398 226 C 414 236, 412 260, 402 280" stroke="url(#ccWirePU)" />
              <path d="M282 352 C 348 356, 392 346, 418 318 C 440 294, 436 262, 416 238" stroke="url(#ccWireOR)" />
              <path d="M718 62 C 652 58, 608 68, 582 96 C 558 122, 564 158, 586 186" stroke="url(#ccWireBL)" />
              <path d="M718 207 C 660 204, 628 212, 602 226 C 586 236, 588 260, 598 280" stroke="url(#ccWireTE)" />
              <path d="M718 352 C 652 356, 608 346, 582 318 C 560 294, 564 262, 584 238" stroke="url(#ccWirePK)" />
            </g>
            {/* mid glow */}
            <g className="cc-ld-wireglow" filter="url(#ccWireHaze)">
              <path d="M282 62 C 348 58, 392 68, 418 96 C 442 122, 436 158, 414 186" stroke="url(#ccWireGN)" />
              <path d="M282 207 C 340 204, 372 212, 398 226 C 414 236, 412 260, 402 280" stroke="url(#ccWirePU)" />
              <path d="M282 352 C 348 356, 392 346, 418 318 C 440 294, 436 262, 416 238" stroke="url(#ccWireOR)" />
              <path d="M718 62 C 652 58, 608 68, 582 96 C 558 122, 564 158, 586 186" stroke="url(#ccWireBL)" />
              <path d="M718 207 C 660 204, 628 212, 602 226 C 586 236, 588 260, 598 280" stroke="url(#ccWireTE)" />
              <path d="M718 352 C 652 356, 608 346, 582 318 C 560 294, 564 262, 584 238" stroke="url(#ccWirePK)" />
            </g>
            {/* crisp core leaving the nub */}
            <g className="cc-ld-wirecore">
              <path d="M282 62 C 348 58, 392 68, 418 96 C 442 122, 436 158, 414 186" stroke="url(#ccWireGN)" />
              <path d="M282 207 C 340 204, 372 212, 398 226 C 414 236, 412 260, 402 280" stroke="url(#ccWirePU)" />
              <path d="M282 352 C 348 356, 392 346, 418 318 C 440 294, 436 262, 416 238" stroke="url(#ccWireOR)" />
              <path d="M718 62 C 652 58, 608 68, 582 96 C 558 122, 564 158, 586 186" stroke="url(#ccWireBL)" />
              <path d="M718 207 C 660 204, 628 212, 602 226 C 586 236, 588 260, 598 280" stroke="url(#ccWireTE)" />
              <path d="M718 352 C 652 356, 608 346, 582 318 C 560 294, 564 262, 584 238" stroke="url(#ccWirePK)" />
            </g>
          </svg>

          <div className="cc-ld-col">
            {left.map((c, i) => <StatCard key={c.key} c={c} i={i} reduce={reduce} />)}
          </div>

          {/* centre blob */}
          <motion.div className="cc-ld-blob"
            initial={reduce ? false : { opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1, ease: EASE }}>
            <svg viewBox="0 0 200 200" role="img" aria-label="A support agent smiling on a call, headset on, at the Nexa floor">
              <defs>
                <clipPath id="ccLdClip">
                  <path d="M104 12 C133 8 158 26 162 50 C165 70 180 78 176 100 C172 124 156 140 132 150 C112 158 108 178 88 180 C62 183 40 168 30 146 C22 128 6 120 10 96 C14 70 28 54 50 42 C70 31 78 16 104 12 Z" />
                </clipPath>
                <filter id="ccLdGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="5" />
                </filter>
                {/* domed fill so the halo reads as a raised 3D surface */}
                <linearGradient id="ccLdDome" x1="0.2" y1="0" x2="0.8" y2="1">
                  <stop offset="0" stopColor="#FFFFFF" />
                  <stop offset="1" stopColor="#EAEFF7" />
                </linearGradient>
                <radialGradient id="ccLdAura" cx="50%" cy="44%" r="62%">
                  <stop offset="0" stopColor="#EDF4FF" stopOpacity="0.9" />
                  <stop offset="72%" stopColor="#EDF4FF" stopOpacity="0" />
                </radialGradient>
              </defs>

              <g className="cc-ld-blobwrap">
                {/* cast shadow - grounds the blob for 3D depth */}
                <path transform="translate(2 12)"
                  d="M104 12 C133 8 158 26 162 50 C165 70 180 78 176 100 C172 124 156 140 132 150 C112 158 108 178 88 180 C62 183 40 168 30 146 C22 128 6 120 10 96 C14 70 28 54 50 42 C70 31 78 16 104 12 Z"
                  fill="#1F2C3D" opacity="0.16" filter="url(#ccLdGlow)" />

                {/* soft aura */}
                <ellipse cx="100" cy="98" rx="99" ry="99" fill="url(#ccLdAura)" />

                {/* domed white halo */}
                <path d="M104 12 C133 8 158 26 162 50 C165 70 180 78 176 100 C172 124 156 140 132 150 C112 158 108 178 88 180 C62 183 40 168 30 146 C22 128 6 120 10 96 C14 70 28 54 50 42 C70 31 78 16 104 12 Z"
                  fill="url(#ccLdDome)" filter="url(#ccLdGlow)" opacity="0.95" />

                {/* photo */}
                <image href="/images/home/live-team.webp" x="6" y="6" width="188" height="188"
                  preserveAspectRatio="xMidYMid slice" clipPath="url(#ccLdClip)" />

                {/* crisp inner rim */}
                <path d="M104 12 C133 8 158 26 162 50 C165 70 180 78 176 100 C172 124 156 140 132 150 C112 158 108 178 88 180 C62 183 40 168 30 146 C22 128 6 120 10 96 C14 70 28 54 50 42 C70 31 78 16 104 12 Z"
                  fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity="0.9" />
              </g>
            </svg>
          </motion.div>

          <div className="cc-ld-col">
            {right.map((c, i) => <StatCard key={c.key} c={c} i={i} reduce={reduce} />)}
          </div>
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
