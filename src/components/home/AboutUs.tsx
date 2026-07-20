import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Users, Clock } from 'lucide-react'
import { MaskReveal, useParallax } from '../../lib/anim'

const TEXT   = '#16141F'
const ACCENT = '#998EFF'
const WASH  = '#F4F2FD'
const MUTED  = '#5E5B6B'
const INK    = '#14111F'
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const GLOSS      = 'linear-gradient(168deg, #C3BCFF 0%, #998EFF 46%, #4A3DBF 100%)'
const ACCENT_RIM = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(40,32,100,0.3)'

/* What the board shows, mapped to plain words - each row ties the copy to a
   region of the live dashboard beside it. */
const BOARD = [
  'Calls answered and customers connected',
  'Wait times and the live queue, per second',
  'Satisfaction, tracked right through the day',
]

const STATS = [
  { v: '10+',  l: 'Years running support floors' },
  { v: '3.2M', l: 'Conversations handled a year' },
  { v: '24/7', l: 'Cover across every time zone' },
]

/* Digit shuffle - the figures land one character at a time, left to right, the way a
   board does when it first pulls its data. Writes straight to the node rather than
   through state, so an 800ms burst never costs a React render per frame. */
function Scramble({ value, run, delay = 0 }: { value: string; run: boolean; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!run) { el.textContent = value; return }
    const chars = value.split('')
    const DUR = 820
    let raf = 0
    let start = 0
    const step = (now: number) => {
      if (!start) start = now
      const p = (now - start - delay) / DUR
      if (p >= 1) { el.textContent = value; return }
      el.textContent = chars
        .map((c, i) => (!/\d/.test(c) || p >= (i + 1) / chars.length ? c : String((Math.random() * 10) | 0)))
        .join('')
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [run, value, delay])
  return <span ref={ref}>{value}</span>
}

/* A real, ticking Sydney clock - the site sells the Australian market, so the
   floor clock reading live seconds is the honest "this is live" signal. */
function useSydneyClock(active: boolean) {
  const [t, setT] = useState('--:--:--')
  useEffect(() => {
    if (!active) return
    const fmt = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit',
      second: '2-digit', hour12: false,
    })
    const tick = () => setT(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [active])
  return t
}

export function AboutUs() {
  const reduce = useReducedMotion() ?? false
  const stageRef = useRef<HTMLDivElement>(null)
  const heroY = useParallax(stageRef, 22)
  const clock = useSydneyClock(!reduce)
  /* the board only powers on once it is actually looked at - and again on every reload */
  const [built, setBuilt] = useState(false)
  const [footIn, setFootIn] = useState(false)

  const fade = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { delay: d, duration: 0.85, ease: EASE },
  })

  return (
    <section className="cc-au" id="about" aria-label="Live operations">
      <style>{`
        .cc-au {
          position: relative;
          background: linear-gradient(180deg, #FFFFFF 0%, #FBFAFE 44%, ${WASH} 82%, #E3DEF8 100%);
          overflow: hidden;
        }
        .cc-au-inner {
          position: relative;
          max-width: min(calc(100vw - 140px), 1760px);
          margin: 0 auto;
          padding: clamp(56px, 8vw, 130px) clamp(24px, 4vw, 64px) clamp(48px, 6vw, 96px);
        }

        /* ── stage: copy | live board ── */
        .cc-au-stage {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.32fr);
          column-gap: clamp(30px, 4vw, 84px);
          align-items: center;
        }

        /* ── eyebrow ── */
        .cc-au-eye {
          display: inline-flex; align-items: center; gap: 11px; margin: 0 0 clamp(20px, 2vw, 30px);
          font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(11px, 0.82vw, 13px); letter-spacing: 2.4px; color: ${MUTED};
        }
        .cc-au-eye .live {
          position: relative; width: 9px; height: 9px; flex: none;
        }
        .cc-au-eye .live b {
          position: absolute; inset: 0; border-radius: 50%; background: #23B26D;
        }
        .cc-au-eye .live::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          border: 1.5px solid #23B26D;
          animation: ccAuPing 2s cubic-bezier(0,.2,.3,1) infinite; will-change: transform, opacity;
        }

        /* ── headline ── */
        .cc-au-head { margin: 0; }
        .cc-au-h {
          display: block;
          font-family: 'Universal Sans', sans-serif; text-transform: uppercase;
          font-size: clamp(52px, 6.6vw, 118px); line-height: 0.9; letter-spacing: -0.045em;
          color: ${TEXT}; margin: 0;
        }
        .cc-au-h-row {
          display: flex; align-items: baseline; flex-wrap: wrap;
          gap: clamp(12px, 1.4vw, 24px); margin-top: clamp(2px, 0.4vw, 8px);
        }
        .cc-au-h-note {
          font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.78vw, 13px); letter-spacing: 2.2px; line-height: 1.7;
          color: ${MUTED}; margin: 0; max-width: 16ch; align-self: center;
        }
        .cc-au-h-accent {
          font-family: 'Universal Sans', sans-serif; text-transform: none;
          font-size: clamp(48px, 6vw, 104px); line-height: 0.92; letter-spacing: -0.02em;
          color: ${ACCENT};
        }

        /* ── paragraph on a hairline rule ── */
        .cc-au-lede {
          display: flex; gap: clamp(14px, 1.4vw, 22px);
          margin: clamp(26px, 3.2vw, 44px) 0 0; max-width: 46ch;
        }
        .cc-au-lede i {
          flex: none; width: 2px; border-radius: 2px;
          background: linear-gradient(180deg, ${ACCENT}, rgba(153,142,255,0));
          transform-origin: top; will-change: transform;
        }
        .cc-au-lede p {
          font-family: 'Universal Sans', sans-serif; font-weight: 400;
          font-size: clamp(14px, 1.15vw, 17px); line-height: 1.8; color: ${MUTED}; margin: 0;
        }

        /* ── board legend ── */
        .cc-au-legend {
          list-style: none; margin: clamp(26px, 3vw, 40px) 0 0; padding: 0;
          display: flex; flex-direction: column; gap: clamp(12px, 1.3vw, 18px);
        }
        .cc-au-legend li {
          display: flex; align-items: center; gap: 14px;
          font-family: 'Universal Sans', sans-serif; font-weight: 600;
          font-size: clamp(14px, 1.05vw, 16px); line-height: 1.4; color: ${TEXT};
        }
        .cc-au-legend i {
          flex: none; width: 22px; height: 22px; border-radius: 7px;
          background: rgba(153,142,255,0.16); position: relative;
        }
        .cc-au-legend i::after {
          content: ''; position: absolute; inset: 0; margin: auto;
          width: 8px; height: 8px; border-radius: 50%; background: ${GLOSS};
          box-shadow: ${ACCENT_RIM};
        }

        /* ── CTAs ── */
        .cc-au-ctas {
          display: flex; align-items: center; flex-wrap: wrap;
          gap: clamp(14px, 1.8vw, 28px); margin-top: clamp(30px, 3.4vw, 48px);
        }
        .cc-au-cta {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          min-height: 52px; padding: 15px clamp(24px, 2.4vw, 36px);
          background: linear-gradient(168deg, #38324F 0%, ${TEXT} 48%, ${INK} 100%);
          color: #FAF9FE; text-decoration: none; border-radius: 4px;
          font-family: 'Universal Sans', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: clamp(12px, 0.9vw, 14px); letter-spacing: 1.5px;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 0 -1px 0 rgba(0,0,0,0.28),
            0 2px 4px rgba(22,20,31,0.22),
            0 14px 26px -12px rgba(22,20,31,0.5);
          transition: transform .45s cubic-bezier(.16,1,.3,1), background .35s ease, box-shadow .35s ease;
          will-change: transform;
        }
        .cc-au-cta:hover {
          background: ${GLOSS}; color: #FFFFFF; transform: translateY(-3px);
          box-shadow: ${ACCENT_RIM}, 0 3px 6px rgba(74,61,191,0.4), 0 18px 32px -12px rgba(74,61,191,0.72);
        }
        .cc-au-cta svg { transition: transform .45s cubic-bezier(.16,1,.3,1); will-change: transform; }
        .cc-au-cta:hover svg { transform: translateX(4px); }
        .cc-au-ghost {
          display: inline-flex; align-items: center; gap: 12px;
          min-height: 52px; padding: 4px; background: none; border: 0;
          color: ${TEXT}; text-decoration: none;
          font-family: 'Universal Sans', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: clamp(12px, 0.9vw, 14px); letter-spacing: 1.5px;
        }
        .cc-au-ghost i {
          display: grid; place-items: center; flex: none;
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--gl-pane); box-shadow: var(--rim-light), var(--sh-1); color: ${TEXT};
          transition: transform .45s cubic-bezier(.16,1,.3,1), background .35s ease, color .35s ease;
          will-change: transform;
        }
        .cc-au-ghost:hover i {
          background: ${GLOSS}; color: #FFFFFF; transform: translate(2px, -2px) scale(1.06);
          box-shadow: ${ACCENT_RIM}, 0 10px 20px -8px rgba(74,61,191,0.65);
        }

        /* ════ the live board ════ */
        .cc-au-board { position: relative; }

        /* breathing violet pool the board is lit by */
        .cc-au-board::before {
          content: ''; position: absolute; z-index: 0; pointer-events: none;
          inset: -14% -10% -18%;
          background: radial-gradient(52% 46% at 62% 42%, rgba(153,142,255,0.34), transparent 70%);
          animation: ccAuBreathe 7s ease-in-out infinite; will-change: opacity, transform;
        }
        /* control-room sonar: rings pulsing out from behind the board */
        .cc-au-sonar {
          position: absolute; z-index: 0; left: 58%; top: 44%; width: 46%; aspect-ratio: 1;
          transform: translate(-50%, -50%); pointer-events: none;
        }
        .cc-au-sonar span {
          position: absolute; inset: 0; border-radius: 50%;
          border: 1px solid rgba(153,142,255,0.5);
          animation: ccAuSonar 4.6s cubic-bezier(0,.3,.4,1) infinite; will-change: transform, opacity;
        }
        .cc-au-sonar span:nth-child(2) { animation-delay: 2.3s; }

        .cc-au-screen { position: relative; z-index: 2; width: 100%; will-change: transform; }
        .cc-au-screen img {
          display: block; width: 100%; height: auto; pointer-events: none;
          filter: drop-shadow(0 36px 62px rgba(30,22,70, 0.36))
                  drop-shadow(0 6px 14px rgba(22,20,31, 0.16));
        }
        .cc-au-screen::after {
          content: ''; position: absolute; left: 8%; right: 8%; bottom: -4%; height: 12%;
          background: radial-gradient(closest-side, rgba(30,22,70,0.3), transparent 74%);
          filter: blur(6px); pointer-events: none; z-index: -1;
        }
        /* screen power-on light sweep, clipped to the display area of the cutout */
        .cc-au-sweep {
          position: absolute; inset: 0; z-index: 3; pointer-events: none; overflow: hidden;
          clip-path: polygon(4.6% 6%, 96% 6.4%, 95.8% 93%, 4.4% 92%);
          -webkit-clip-path: polygon(4.6% 6%, 96% 6.4%, 95.8% 93%, 4.4% 92%);
        }
        .cc-au-sweep b {
          position: absolute; top: -20%; left: -70%; width: 55%; height: 140%;
          background: linear-gradient(105deg, transparent, rgba(199,188,255,0.6), transparent);
          transform: translateX(0) skewX(-14deg); mix-blend-mode: screen;
          animation: ccAuSweep 6s cubic-bezier(.55,0,.45,1) infinite; will-change: transform;
        }

        /* ── power-on build: the board paints itself in from the left ──
           a veil the colour of the screen retracts to the right, with a bright
           violet front edge riding on it, so the panels and the chart appear to
           be drawn left to right. Compositor-only: scaleX + opacity, nothing else. */
        .cc-au-build {
          position: absolute; inset: 0; z-index: 4; pointer-events: none; overflow: hidden;
          clip-path: polygon(4.6% 6%, 96% 6.4%, 95.8% 93%, 4.4% 92%);
          -webkit-clip-path: polygon(4.6% 6%, 96% 6.4%, 95.8% 93%, 4.4% 92%);
        }
        /* the second pass is clipped to the "Calls per hour" panel only, and runs
           late, so the graph is the last thing to draw itself across */
        .cc-au-build.chart {
          clip-path: inset(40.4% 41.2% 11.2% 6.6% round 1.4%);
          -webkit-clip-path: inset(40.4% 41.2% 11.2% 6.6% round 1.4%);
        }
        .cc-au-build .veil, .cc-au-build .edge {
          position: absolute; inset: 0; will-change: transform;
        }
        .cc-au-build .veil {
          background: linear-gradient(118deg, #1C1833 0%, #16122A 52%, #110E20 100%);
          transform-origin: right center; transform: scaleX(1);
          transition: transform 1.15s cubic-bezier(.16,1,.3,1);
        }
        .cc-au-build .edge {
          transform-origin: left center; transform: scaleX(0);
          background: linear-gradient(90deg,
            rgba(153,142,255,0) 88%, rgba(153,142,255,0.34) 97%,
            rgba(214,208,255,0.85) 99.6%, rgba(240,238,255,0.95) 100%);
          transition: transform 1.15s cubic-bezier(.16,1,.3,1), opacity .3s ease .95s;
        }
        .cc-au-build.chart .veil { transition-duration: 1.05s; transition-delay: .62s; }
        .cc-au-build.chart .edge { transition-duration: 1.05s; transition-delay: .62s, 1.42s; }
        .cc-au-board.on .cc-au-build .veil { transform: scaleX(0); }
        .cc-au-board.on .cc-au-build .edge { transform: scaleX(1); opacity: 0; }

        /* wrapper is transparent to layout on desktop, so chips position
           absolutely against the board; it becomes a flex row on mobile */
        .cc-au-chiprow { display: contents; }
        /* floating context chips */
        .cc-au-chip {
          position: absolute; z-index: 5; display: flex; align-items: center; gap: 13px;
          padding: 13px 20px 13px 13px; border-radius: 16px;
          background: rgba(255,255,255,0.94);
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.6),
            0 2px 5px rgba(22,20,31,0.09),
            0 24px 42px -16px rgba(30,22,70,0.42);
          animation: ccAuFloat 5s cubic-bezier(.45,.05,.55,.95) infinite alternate; will-change: transform;
        }
        .cc-au-chip-a { top: -6%; left: -6%; }
        .cc-au-chip-b { bottom: -5%; right: -5%; animation-duration: 5.8s; animation-delay: .7s; }
        .cc-au-chip i {
          display: grid; place-items: center; flex: none;
          width: 38px; height: 38px; border-radius: 12px;
          background: ${GLOSS}; box-shadow: ${ACCENT_RIM}; color: #FFFFFF;
        }
        .cc-au-chip small {
          display: block; font-family: 'Universal Sans', sans-serif; font-weight: 800;
          text-transform: uppercase; font-size: 10px; letter-spacing: 1.8px; color: ${MUTED};
        }
        .cc-au-chip b {
          display: block; margin-top: 3px;
          font-family: 'Universal Sans', sans-serif; font-weight: 800;
          font-size: clamp(18px, 1.5vw, 24px); letter-spacing: -0.02em; color: ${TEXT};
          font-variant-numeric: tabular-nums;
        }

        /* ── stats strip ── */
        .cc-au-foot {
          position: relative; z-index: 1; margin-top: clamp(48px, 6vw, 100px);
          padding-top: clamp(26px, 3vw, 44px); border-top: 1px solid rgba(22,20,31,0.13);
          display: grid; grid-template-columns: auto repeat(3, minmax(0, 1fr));
          gap: clamp(20px, 3vw, 56px); align-items: center;
        }
        .cc-au-floortag {
          display: inline-flex; align-items: center; gap: 9px;
          font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.78vw, 12px); letter-spacing: 2px; color: ${TEXT};
          white-space: nowrap;
        }
        .cc-au-floortag i { width: 8px; height: 8px; border-radius: 50%; background: #23B26D;
          box-shadow: 0 0 0 4px rgba(35,178,109,0.16);
          animation: ccAuPulse 1.9s ease-in-out infinite; will-change: opacity, transform; }
        .cc-au-stat b {
          display: block; font-family: 'Universal Sans', sans-serif; font-weight: 800;
          font-size: clamp(30px, 2.5vw, 46px); line-height: 1; letter-spacing: -0.02em; color: ${TEXT};
          font-variant-numeric: tabular-nums;
        }
        .cc-au-stat span {
          display: block; margin-top: 8px;
          font-family: 'Universal Sans', sans-serif; font-weight: 600; font-size: clamp(13px, 0.95vw, 15px);
          line-height: 1.6; color: ${MUTED};
        }

        /* ── keyframes ── */
        @keyframes ccAuPing {
          0% { transform: scale(1); opacity: 0.9; }
          70%, 100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes ccAuPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.72); opacity: 0.5; }
        }
        @keyframes ccAuBreathe {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes ccAuSonar {
          0% { transform: scale(0.4); opacity: 0.7; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes ccAuSweep {
          0%, 48% { transform: translateX(0) skewX(-14deg); }
          100% { transform: translateX(300%) skewX(-14deg); }
        }
        @keyframes ccAuFloat {
          from { transform: translateY(-5px); }
          to { transform: translateY(5px); }
        }

        @media (min-width: 1920px) { .cc-au-inner { max-width: min(calc(100vw - 140px), 1900px); } }
        @media (min-width: 2560px) { .cc-au-inner { max-width: min(calc(100vw - 160px), 2400px); } }

        @media (max-width: 1024px) {
          .cc-au-stage { grid-template-columns: minmax(0, 1fr); row-gap: clamp(56px, 9vw, 84px); }
          .cc-au-board { max-width: 660px; margin: 0 auto; width: 100%; }
          .cc-au-lede { max-width: 60ch; }
          .cc-au-foot { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .cc-au-floortag { display: none; }
        }
        /* on narrow screens the board is too small to overhang - dock the chips
           into a static row beneath it so nothing covers the dashboard */
        @media (max-width: 720px) {
          .cc-au-chiprow {
            display: flex; flex-wrap: wrap; justify-content: center;
            gap: clamp(10px, 3vw, 16px); margin-top: clamp(18px, 4vw, 26px);
          }
          .cc-au-chip { position: static; inset: auto; animation: none; }
        }
        @media (max-width: 640px) {
          .cc-au-foot { grid-template-columns: minmax(0, 1fr); gap: 20px; }
          .cc-au-stat { display: flex; align-items: baseline; gap: 16px; }
          .cc-au-stat b { min-width: 3.4ch; }
          .cc-au-stat span { margin-top: 0; }
        }
        @media (max-width: 540px) {
          .cc-au-h-note { max-width: 100%; }
          .cc-au-ctas { gap: 14px; }
          .cc-au-cta { width: 100%; }
        }
        @media (max-width: 380px) {
          .cc-au-chiprow { flex-direction: column; align-items: stretch; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-au-cta, .cc-au-ghost i { transition: none; }
          .cc-au-eye .live::after, .cc-au-board::before, .cc-au-sonar span,
          .cc-au-sweep b, .cc-au-chip, .cc-au-floortag i { animation: none; }
          .cc-au-sonar, .cc-au-sweep, .cc-au-build { display: none; }
        }
      `}</style>

      <div className="cc-au-inner">
        <div className="cc-au-stage" ref={stageRef}>
          {/* ── Copy ── */}
          <div className="cc-au-copy">
            <MaskReveal as="span" className="cc-au-eye" duration={0.9}>
              <span className="live" aria-hidden><b /></span>Live operations
            </MaskReveal>

            <h2 className="cc-au-head">
              <MaskReveal as="span" className="cc-au-h" duration={1}>Every call</MaskReveal>
              <MaskReveal as="span" className="cc-au-h-row" duration={1} delay={0.08}>
                <span className="cc-au-h">On one</span>
                <span className="cc-au-h-accent">board</span>
                <span className="cc-au-h-note">Calls, agents and queue in real time</span>
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
                This is the operations board our team runs on - the same view behind your account.
                Calls answered, customers connected, wait times and satisfaction, all moving live. Nothing
                on your support floor happens out of sight.
              </p>
            </motion.div>

            <motion.ul className="cc-au-legend" {...fade(0.24)}>
              {BOARD.map((b) => (<li key={b}><i aria-hidden />{b}</li>))}
            </motion.ul>

            <motion.div className="cc-au-ctas" {...fade(0.32)}>
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

          {/* ── Live board ── */}
          <motion.div
            className={`cc-au-board${built ? ' on' : ''}`}
            initial={reduce ? false : { opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            onViewportEnter={() => setBuilt(true)}
            transition={{ duration: 1.1, ease: EASE }}
          >
            {!reduce && (
              <div className="cc-au-sonar" aria-hidden><span /><span /></div>
            )}

            <motion.div className="cc-au-screen" style={reduce ? undefined : { y: heroY }}>
              <img
                src="/images/about/live-console.webp"
                alt="Nexa live operations board on a monitor: 2,847 calls today, 1,932 customers connected, an 8 second average answer time and 98% satisfaction, with the live call queue beside it"
                width={1368} height={815} loading="lazy" decoding="async"
              />
              {!reduce && (
                <>
                  <div className="cc-au-build" aria-hidden><span className="veil" /><span className="edge" /></div>
                  <div className="cc-au-build chart" aria-hidden><span className="veil" /><span className="edge" /></div>
                  <div className="cc-au-sweep" aria-hidden><b /></div>
                </>
              )}
            </motion.div>

            <div className="cc-au-chiprow">
              <div className="cc-au-chip cc-au-chip-a">
                <i aria-hidden><Users size={18} strokeWidth={2.2} /></i>
                <span>
                  <small>On the floor now</small>
                  <b><Scramble value="214 agents" run={built && !reduce} delay={520} /></b>
                </span>
              </div>
              <div className="cc-au-chip cc-au-chip-b">
                <i aria-hidden><Clock size={18} strokeWidth={2.2} /></i>
                <span>
                  <small>Sydney floor</small>
                  <b>{clock}</b>
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Floor status strip ── */}
        <motion.div className="cc-au-foot" {...fade(0.14)} onViewportEnter={() => setFootIn(true)}>
          <span className="cc-au-floortag"><i aria-hidden />Floor status</span>
          {STATS.map((s, i) => (
            <div className="cc-au-stat" key={s.v}>
              <b><Scramble value={s.v} run={footIn && !reduce} delay={220 + i * 130} /></b>
              <span>{s.l}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
