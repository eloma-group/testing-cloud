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
          background:
            radial-gradient(120% 80% at 50% -10%, #FFFFFF 0%, #F5F7FB 46%, #EEF1F7 100%);
        }
        .cc-ld-inner {
          position: relative; z-index: 1;
          max-width: min(calc(100vw - 100px), 1780px); margin: 0 auto;
          padding: clamp(64px, 9vw, 140px) clamp(24px, 4vw, 72px) clamp(56px, 7vw, 112px);
        }
        /* soft ambient panels behind, like the reference's faint rounded shadows */
        .cc-ld::before, .cc-ld::after {
          content: ''; position: absolute; pointer-events: none; z-index: 0;
          border-radius: 60px; background: #FFFFFF;
          box-shadow: 0 40px 90px -50px rgba(31,44,61,0.18);
        }
        .cc-ld::before { top: 8%; left: 12%; right: 12%; height: 44%; opacity: 0.5; }
        .cc-ld::after  { bottom: 3%; left: 22%; right: 22%; height: 90px; opacity: 0.7; }

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
          font-family: 'Universal Sans', sans-serif; font-weight: 800; letter-spacing: -0.02em;
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
        .cc-ld-wireglow path { stroke-width: 9; opacity: 0.4; }
        .cc-ld-wirecore path { stroke-width: 3; opacity: 0.95; }

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
          color: #90A0B3; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
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

        /* ── centre blob ── */
        .cc-ld-blob { position: relative; z-index: 2; width: 100%; aspect-ratio: 1; }
        .cc-ld-blob svg { display: block; width: 100%; height: 100%; overflow: visible; }
        .cc-ld-blobwrap {
          animation: ccLdFloat 7s ease-in-out infinite; will-change: transform;
          transform-origin: center;
        }
        /* soft flowing "wind" streams that weave around the photo */
        .cc-ld-stream {
          fill: none; stroke-linecap: round; stroke-width: 7;
          transform-origin: 100px 98px; will-change: transform;
          animation: ccLdDrift 9s ease-in-out infinite;
        }
        .cc-ld-stream.s1 { opacity: 0.7;  animation-duration: 8.4s;  animation-delay: -0.4s; }
        .cc-ld-stream.s2 { opacity: 0.62; animation-duration: 10.2s; animation-delay: -3.1s; animation-direction: reverse; }
        .cc-ld-stream.s3 { opacity: 0.66; animation-duration: 9.1s;  animation-delay: -1.8s; }
        .cc-ld-stream.s4 { opacity: 0.6;  animation-duration: 11s;   animation-delay: -5.4s; animation-direction: reverse; }
        .cc-ld-stream.s5 { opacity: 0.58; animation-duration: 9.7s;  animation-delay: -2.5s; }

        /* ── caption + footer ── */
        .cc-ld-script {
          text-align: center; margin: clamp(22px, 3vw, 40px) 0 0; position: relative; z-index: 2;
          font-family: 'Dancing Script', cursive; font-weight: 700;
          font-size: clamp(28px, 3.4vw, 46px); line-height: 1; color: #4C7DF0;
        }
        .cc-ld-script em { font-style: normal; color: #22B8A6; }
        .cc-ld-foot {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          margin: clamp(34px, 5vw, 64px) 0 0; position: relative; z-index: 2;
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
        }
        @media (max-width: 600px) {
          .cc-ld-inner { max-width: 100%; }
          .cc-ld-stage { grid-template-columns: minmax(0,1fr); }
          .cc-ld::before, .cc-ld::after { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-ld-eye i, .cc-ld-blobwrap, .cc-ld-stream { animation: none; }
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
              {/* each connector fades from its card colour into the blob's glow */}
              <linearGradient id="ccWireGN" gradientUnits="userSpaceOnUse" x1="312" y1="0" x2="402" y2="0">
                <stop offset="0" stopColor="#25C07A" stopOpacity="0.85" />
                <stop offset="1" stopColor="#25C07A" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ccWirePU" gradientUnits="userSpaceOnUse" x1="312" y1="0" x2="398" y2="0">
                <stop offset="0" stopColor="#8B7FF5" stopOpacity="0.85" />
                <stop offset="1" stopColor="#8B7FF5" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ccWireOR" gradientUnits="userSpaceOnUse" x1="312" y1="0" x2="402" y2="0">
                <stop offset="0" stopColor="#F5A524" stopOpacity="0.85" />
                <stop offset="1" stopColor="#F5A524" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ccWireBL" gradientUnits="userSpaceOnUse" x1="688" y1="0" x2="598" y2="0">
                <stop offset="0" stopColor="#4C7DF0" stopOpacity="0.85" />
                <stop offset="1" stopColor="#4C7DF0" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ccWireTE" gradientUnits="userSpaceOnUse" x1="688" y1="0" x2="602" y2="0">
                <stop offset="0" stopColor="#22B8A6" stopOpacity="0.85" />
                <stop offset="1" stopColor="#22B8A6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ccWirePK" gradientUnits="userSpaceOnUse" x1="688" y1="0" x2="598" y2="0">
                <stop offset="0" stopColor="#EC5F8B" stopOpacity="0.85" />
                <stop offset="1" stopColor="#EC5F8B" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* soft wide glow layer */}
            <g className="cc-ld-wireglow">
              <path d="M312 62 C 372 58, 356 120, 402 120" stroke="url(#ccWireGN)" />
              <path d="M312 207 C 352 204, 360 210, 398 207" stroke="url(#ccWirePU)" />
              <path d="M312 352 C 372 356, 356 296, 402 296" stroke="url(#ccWireOR)" />
              <path d="M688 62 C 628 58, 644 120, 598 120" stroke="url(#ccWireBL)" />
              <path d="M688 207 C 648 204, 640 210, 602 207" stroke="url(#ccWireTE)" />
              <path d="M688 352 C 628 356, 644 296, 598 296" stroke="url(#ccWirePK)" />
            </g>
            {/* crisp core layer */}
            <g className="cc-ld-wirecore">
              <path d="M312 62 C 372 58, 356 120, 402 120" stroke="url(#ccWireGN)" />
              <path d="M312 207 C 352 204, 360 210, 398 207" stroke="url(#ccWirePU)" />
              <path d="M312 352 C 372 356, 356 296, 402 296" stroke="url(#ccWireOR)" />
              <path d="M688 62 C 628 58, 644 120, 598 120" stroke="url(#ccWireBL)" />
              <path d="M688 207 C 648 204, 640 210, 602 207" stroke="url(#ccWireTE)" />
              <path d="M688 352 C 628 356, 644 296, 598 296" stroke="url(#ccWirePK)" />
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
                <filter id="ccLdSoft" x="-45%" y="-45%" width="190%" height="190%">
                  <feGaussianBlur stdDeviation="2.6" />
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

                {/* wind streams BEHIND the photo - short flowing wisps, not a closed ring */}
                <g filter="url(#ccLdSoft)">
                  <path className="cc-ld-stream s1" d="M40 40 C 66 16, 104 12, 142 24" stroke="#8FE3C2" />
                  <path className="cc-ld-stream s2" d="M172 42 C 192 62, 196 92, 186 116" stroke="#9BDFD6" />
                  <path className="cc-ld-stream s3" d="M152 168 C 118 187, 76 189, 44 172" stroke="#B7CCF7" />
                </g>

                {/* domed white halo */}
                <path d="M104 12 C133 8 158 26 162 50 C165 70 180 78 176 100 C172 124 156 140 132 150 C112 158 108 178 88 180 C62 183 40 168 30 146 C22 128 6 120 10 96 C14 70 28 54 50 42 C70 31 78 16 104 12 Z"
                  fill="url(#ccLdDome)" filter="url(#ccLdGlow)" opacity="0.95" />

                {/* photo */}
                <image href="/images/home/live-team.webp" x="6" y="6" width="188" height="188"
                  preserveAspectRatio="xMidYMid slice" clipPath="url(#ccLdClip)" />

                {/* wind streams IN FRONT, weaving over the left edge - open gaps kept */}
                <g filter="url(#ccLdSoft)">
                  <path className="cc-ld-stream s4" d="M20 122 C 6 98, 10 66, 28 46" stroke="#C9C4F7" />
                  <path className="cc-ld-stream s5" d="M42 160 C 28 148, 21 132, 22 114" stroke="#F5BFD3" />
                </g>

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
