import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { MaskReveal, fadeUp, VIEWPORT, EASE } from '../../lib/anim'

const TEXT   = '#2E3A34'
const ACCENT = '#C6866B'
const DARK   = '#3E4A42'
const CREAM  = '#F4F1EB'
const MUTED  = 'rgba(46,58,52,0.55)'

/* ──────────────────────────────────────────────────────────────
   Editorial collage showcase. One service at a time, presented
   as a print-style spread: photo tiles, oversized two-tone
   display type, micro-copy columns and a rotating seal.
   ────────────────────────────────────────────────────────────── */

type Tone = 'm' | 's' | 'a'          // muted / solid / accent
type Word = { t: string; tone: Tone }

type Service = {
  n: string
  tag: string
  nav: string
  title: string                       // plain-text title (screen readers, tab rail)
  head: Word[]                        // display type
  caption: string
  colA: string
  colB: string
  img: { main: string; mid: string; side: string }
  alt: { main: string; mid: string; side: string }
}

const SERVICES: Service[] = [
  {
    n: '01', tag: 'Voice', nav: 'Inbound Voice',
    title: 'Inbound Call Handling',
    head: [{ t: 'INBOUND', tone: 'm' }, { t: 'CALL', tone: 's' }, { t: 'HANDLING', tone: 'm' }],
    caption: 'Answered in seconds, in your brand name, by agents trained on your product.',
    colA: 'Every incoming call is picked up by a trained agent, so no customer waits in a queue or lands in a voicemail black hole.',
    colB: 'Scripts, tone of voice and escalation rules are built around your brand before the first call is ever taken.',
    img: { main: '/images/services/s1-main.jpg', mid: '/images/services/s1-mid.jpg', side: '/images/services/s1-side.jpg' },
    alt: {
      main: 'Call centre agent wearing a headset speaking with a customer',
      mid: 'Headset resting on a laptop at an agent workstation',
      side: 'Two call centre agents taking calls on headsets at a shared desk',
    },
  },
  {
    n: '02', tag: 'Digital', nav: 'Live Chat & Email',
    title: 'Live Chat and Email',
    head: [{ t: 'LIVE', tone: 'm' }, { t: 'CHAT', tone: 's' }, { t: '&', tone: 'a' }, { t: 'EMAIL', tone: 'm' }],
    caption: 'First response in seconds across web chat, email and social inboxes.',
    colA: 'Real-time chat coverage on your website and app, with replies that read exactly like your own team wrote them.',
    colB: 'Inbox triage, follow-ups and tagging handled for you, so nothing sits unread overnight or slips past an SLA.',
    img: { main: '/images/services/s2-main.jpg', mid: '/images/services/s2-mid.jpg', side: '/images/services/s2-side.jpg' },
    alt: {
      main: 'Support agent with a headset typing a chat reply at a desk',
      mid: 'Laptop with a headset set up for live chat support',
      side: 'Customer support agent working on a laptop in a bright office',
    },
  },
  {
    n: '03', tag: 'Support', nav: 'Technical Helpdesk',
    title: 'Technical Helpdesk',
    head: [{ t: 'TECHNICAL', tone: 'm' }, { t: 'HELPDESK', tone: 's' }],
    caption: 'Tier-1 and tier-2 troubleshooting, logged, escalated and resolved.',
    colA: 'Tickets are raised, diagnosed and escalated with a clear trail, so product issues never stall halfway through a fix.',
    colB: 'Your engineers only see what genuinely needs them. Everything else is closed before it ever reaches their queue.',
    img: { main: '/images/services/s3-main.jpg', mid: '/images/services/s3-mid.jpg', side: '/images/services/s3-side.jpg' },
    alt: {
      main: 'Helpdesk agent with a headset troubleshooting on a laptop',
      mid: 'Network cables patched into a server rack',
      side: 'Technical support team working at computers with headsets',
    },
  },
  {
    n: '04', tag: 'Global', nav: '24/7 Multilingual',
    title: '24/7 Multilingual Support',
    head: [{ t: '24/7', tone: 'a' }, { t: 'MULTILINGUAL', tone: 's' }, { t: 'SUPPORT', tone: 'm' }],
    caption: 'Real, fluent people on shift while your market sleeps.',
    colA: 'Round-the-clock cover across time zones, weekends and public holidays, with no drop in tone, accuracy or patience.',
    colB: 'Native and near-native agents, so every customer is answered in the language they reached out in.',
    img: { main: '/images/services/s4-main.jpg', mid: '/images/services/s4-mid.jpg', side: '/images/services/s4-side.jpg' },
    alt: {
      main: 'Diverse team of multilingual support agents on headsets',
      mid: 'Office building at night with lit windows and people still working',
      side: 'Agent taking a call late at night at a lit desk',
    },
  },
  {
    n: '05', tag: 'Growth', nav: 'Outbound Sales',
    title: 'Outbound and Telesales',
    head: [{ t: 'OUTBOUND', tone: 'm' }, { t: '&', tone: 'a' }, { t: 'TELESALES', tone: 's' }],
    caption: 'Warm leads followed up, called back and closed.',
    colA: 'Proactive callbacks, renewals and win-backs run to a script you approve, measured and coached call by call.',
    colB: 'Every outcome is logged and reported, so you can see exactly what pipeline the calls actually created.',
    img: { main: '/images/services/s5-main.jpg', mid: '/images/services/s5-mid.jpg', side: '/images/services/s5-side.jpg' },
    alt: {
      main: 'Confident telesales agent with a headset on an outbound call',
      mid: 'Agent reviewing notes while on a call at a desk',
      side: 'Two agents making outbound calls in a bright office',
    },
  },
  {
    n: '06', tag: 'Operations', nav: 'Back-Office',
    title: 'Back-Office and Orders',
    head: [{ t: 'BACK', tone: 's' }, { t: 'OFFICE', tone: 'm' }, { t: '& ORDERS', tone: 'm' }],
    caption: 'The admin behind the calls, cleared the same day.',
    colA: 'Order processing, data entry and CRM hygiene handled off your plate, with the accuracy and speed the work demands.',
    colB: 'After-call paperwork never piles up, so your front line stays free to do the thing you hired them for: talking to customers.',
    img: { main: '/images/services/s6-main.jpg', mid: '/images/services/s6-mid.jpg', side: '/images/services/s6-side.jpg' },
    alt: {
      main: 'Back-office administrator processing order paperwork at a desk',
      mid: 'Reports and charts spread across a desk beside a laptop',
      side: 'Desk with laptop, documents and order boxes ready for dispatch',
    },
  },
]

/* Rotating seal — circular text on a path, spinning on the compositor. */
function Seal() {
  return (
    <Link className="cc-sv-seal" to="/contact" aria-label="Get in touch about our services">
      <svg className="cc-sv-seal-ring" viewBox="0 0 120 120" aria-hidden focusable="false">
        <defs>
          <path id="cc-sv-seal-path" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" />
        </defs>
        <text>
          <textPath href="#cc-sv-seal-path" startOffset="0">
            GET IN TOUCH • GET IN TOUCH •
          </textPath>
        </text>
      </svg>
      <svg className="cc-sv-seal-star" viewBox="0 0 24 24" aria-hidden focusable="false">
        <path
          d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        />
      </svg>
    </Link>
  )
}

export function Services() {
  const reduce = useReducedMotion() ?? false
  const [active, setActive] = useState(0)
  const cur = SERVICES[active]
  const warmed = useRef(false)

  /* Warm the image cache for the other slides once the section is in
     view, so switching services never shows an empty tile. */
  const preload = useCallback(() => {
    if (warmed.current) return
    warmed.current = true
    const run = () => {
      for (const s of SERVICES) {
        for (const src of [s.img.main, s.img.mid, s.img.side]) {
          const im = new Image()
          im.src = src
        }
      }
    }
    const idle: typeof window.requestIdleCallback | undefined = window.requestIdleCallback
    if (idle) idle(run, { timeout: 2500 })
    else window.setTimeout(run, 1200)
  }, [])

  const slide = reduce
    ? {}
    : {
        initial: { opacity: 0, scale: 1.04 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.99 },
        transition: { duration: 0.6, ease: EASE },
      }

  return (
    <section className="cc-sv" id="services" aria-label="Our services">
      <style>{`
        .cc-sv {
          position: relative; isolation: isolate;
          background: ${CREAM}; color: ${TEXT};
          padding: clamp(64px, 8vw, 140px) clamp(24px, 4vw, 64px);
          overflow: hidden;
        }
        .cc-sv::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(80% 55% at 50% 0%, rgba(139,163,138,0.20), transparent 68%),
            radial-gradient(55% 45% at 100% 100%, rgba(198,134,107,0.12), transparent 70%);
        }
        .cc-sv-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }

        /* ── section header ── */
        .cc-sv-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px;
          color: ${ACCENT}; margin: 0 0 clamp(14px, 1.6vw, 22px);
        }
        .cc-sv-eyebrow::before { content: ''; width: clamp(26px, 4vw, 54px); height: 1px; background: ${ACCENT}; opacity: 0.6; }
        .cc-sv-head {
          display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between;
          gap: clamp(20px, 3vw, 48px); margin-bottom: clamp(28px, 3.4vw, 54px);
        }
        .cc-sv-h2 {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: clamp(36px, 5.4vw, 84px); line-height: 1.0; letter-spacing: -0.025em;
          margin: 0; color: ${TEXT}; max-width: 15ch;
        }
        .cc-sv-h2 .accent { color: ${ACCENT}; }
        .cc-sv-lead {
          font-family: 'Inter', sans-serif;
          font-size: clamp(15px, 1.2vw, 18px); line-height: 1.75;
          color: ${MUTED}; margin: 0; max-width: 40ch; padding-bottom: 6px;
        }

        /* ── canvas: white frame + inner stage (the "spread") ── */
        .cc-sv-canvas {
          position: relative;
          border-radius: clamp(22px, 2.2vw, 38px);
          background: #FFFFFF;
          padding: clamp(8px, 0.8vw, 14px);
          box-shadow: 0 50px 110px -60px rgba(46,58,52,0.55), 0 0 0 1px rgba(46,58,52,0.06);
        }
        .cc-sv-stage {
          position: relative; overflow: hidden;
          border-radius: clamp(16px, 1.6vw, 28px);
          background: #EFEDE6;
          padding: clamp(10px, 1vw, 16px);
        }

        .cc-sv-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: clamp(150px, 17vw, 280px) auto;
          gap: clamp(8px, 0.9vw, 14px);
        }

        /* photo tiles */
        .cc-sv-tile { position: relative; overflow: hidden; border-radius: clamp(12px, 1.3vw, 22px); background: #E2DFD7; }
        .cc-sv-tile img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transform: scale(1.001); /* kills sub-pixel seams on scale-in */
        }
        .cc-sv-main { grid-column: 1 / 6; grid-row: 1 / 3; }
        .cc-sv-mid  { grid-column: 6 / 9; grid-row: 1 / 2; }
        .cc-sv-side { grid-column: 9 / 13; grid-row: 1 / 2; }
        .cc-sv-copy {
          grid-column: 6 / 13; grid-row: 2 / 3;
          display: flex; flex-direction: column; gap: clamp(18px, 2vw, 30px);
          padding: clamp(10px, 1.2vw, 20px) clamp(4px, 0.6vw, 10px) clamp(2px, 0.4vw, 6px);
        }

        /* main tile furniture: tag pill, caption scrim, arrow */
        .cc-sv-pill {
          position: absolute; top: clamp(12px, 1.2vw, 20px); left: clamp(12px, 1.2vw, 20px); z-index: 2;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.75vw, 12px); letter-spacing: 2px; color: ${TEXT};
          padding: 8px 14px; border-radius: 100px; background: rgba(255,255,255,0.92);
        }
        .cc-sv-scrim {
          position: absolute; inset: auto 0 0 0; z-index: 1; height: 62%; pointer-events: none;
          background: linear-gradient(to top, rgba(28,36,31,0.86), rgba(28,36,31,0.34) 45%, rgba(28,36,31,0));
        }
        .cc-sv-cap {
          position: absolute; z-index: 2;
          left: clamp(14px, 1.4vw, 24px); right: clamp(64px, 7vw, 92px); bottom: clamp(14px, 1.4vw, 24px);
          font-family: 'Inter', sans-serif; font-weight: 500;
          font-size: clamp(14px, 1.05vw, 16px); line-height: 1.5; color: rgba(255,255,255,0.94);
          margin: 0; text-wrap: balance;
        }
        .cc-sv-arrow {
          position: absolute; z-index: 2; right: clamp(14px, 1.4vw, 22px); bottom: clamp(14px, 1.4vw, 22px);
          width: 46px; height: 46px; border-radius: 100px; border: 0; cursor: pointer;
          display: grid; place-items: center; color: ${TEXT}; background: ${CREAM}; text-decoration: none;
          transition: transform .5s cubic-bezier(.16,1,.3,1), background-color .3s ease, color .3s ease;
          will-change: transform;
        }
        .cc-sv-arrow:hover { transform: translate(3px, -3px); background: ${ACCENT}; color: #fff; }

        /* rotating seal, straddling the mid / side tiles */
        .cc-sv-seal {
          grid-column: 8 / 10; grid-row: 1 / 2; place-self: center; z-index: 3;
          position: relative; display: grid; place-items: center; text-decoration: none;
          width: clamp(92px, 9.6vw, 138px); height: clamp(92px, 9.6vw, 138px);
          border-radius: 100px; background: ${TEXT}; color: #fff;
          box-shadow: 0 18px 40px -18px rgba(28,36,31,0.7);
          transition: transform .5s cubic-bezier(.16,1,.3,1), background-color .35s ease;
          will-change: transform;
        }
        .cc-sv-seal:hover { transform: scale(1.05); background: ${DARK}; }
        .cc-sv-seal-ring {
          position: absolute; inset: 0; width: 100%; height: 100%;
          animation: cc-sv-spin 22s linear infinite; will-change: transform;
        }
        .cc-sv-seal-ring text {
          font-family: 'Inter', sans-serif; font-size: 10.5px; font-weight: 800;
          letter-spacing: 2.6px; fill: #fff;
        }
        .cc-sv-seal-star { position: relative; width: 34%; height: 34%; color: ${ACCENT}; }
        @keyframes cc-sv-spin { to { transform: rotate(360deg); } }

        /* copy column: micro paragraphs + oversized display type */
        .cc-sv-micro {
          display: grid; grid-template-columns: 1fr 1fr auto;
          gap: clamp(14px, 1.6vw, 30px); align-items: start;
        }
        .cc-sv-micro p {
          font-family: 'Inter', sans-serif; margin: 0;
          font-size: clamp(14px, 0.95vw, 16px); line-height: 1.6; color: rgba(46,58,52,0.62);
          max-width: 34ch;
        }
        .cc-sv-count {
          font-family: 'Poppins', sans-serif; font-weight: 600; white-space: nowrap;
          font-size: clamp(13px, 0.95vw, 15px); letter-spacing: 1px; color: rgba(46,58,52,0.38);
        }
        .cc-sv-count b { color: ${TEXT}; font-size: clamp(20px, 1.9vw, 30px); font-weight: 700; letter-spacing: -0.03em; }

        .cc-sv-display {
          font-family: 'Poppins', sans-serif; font-weight: 900; text-transform: uppercase;
          font-size: clamp(30px, 4.5vw, 86px); line-height: 0.94; letter-spacing: -0.045em;
          margin: 0; display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 0.24em;
        }
        .cc-sv-display .w { display: inline-block; will-change: transform; }
        /* last word + mark travel together so the mark never wraps alone */
        .cc-sv-display .last { display: inline-flex; align-items: baseline; gap: 0.2em; white-space: nowrap; }
        .cc-sv-display .m { color: rgba(46,58,52,0.34); }
        .cc-sv-display .s { color: ${TEXT}; }
        .cc-sv-display .a { color: ${ACCENT}; }
        .cc-sv-mark { width: 0.42em; height: 0.42em; align-self: center; color: ${TEXT}; flex-shrink: 0; }

        /* ── service index: lives in the dead space under the display type ── */
        .cc-sv-index { margin-top: auto; padding-top: clamp(14px, 1.6vw, 24px); }
        .cc-sv-index-label {
          display: flex; align-items: center; gap: 12px; margin: 0 0 clamp(6px, 0.7vw, 10px);
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.72vw, 12px); letter-spacing: 2.2px; color: rgba(46,58,52,0.42);
        }
        .cc-sv-index-label::after { content: ''; flex: 1; height: 1px; background: rgba(46,58,52,0.14); }
        .cc-sv-tabs {
          display: grid; grid-template-columns: 1fr 1fr;
          column-gap: clamp(10px, 1.2vw, 24px);
        }
        .cc-sv-tab {
          position: relative; isolation: isolate; overflow: hidden;
          display: flex; align-items: center; gap: clamp(10px, 0.9vw, 14px);
          width: 100%; min-height: 48px; text-align: left; cursor: pointer;
          background: none; border: 0; border-radius: clamp(8px, 0.7vw, 12px);
          padding: clamp(10px, 0.9vw, 14px) clamp(10px, 0.9vw, 15px);
          box-shadow: inset 0 -1px 0 rgba(46,58,52,0.13);
          transition: box-shadow .35s ease;
        }
        /* terracotta wipe, left to right */
        .cc-sv-tab::before {
          content: ''; position: absolute; inset: 0; z-index: 0; border-radius: inherit;
          background: ${ACCENT}; transform: scaleX(0); transform-origin: left;
          transition: transform .55s cubic-bezier(.16,1,.3,1); will-change: transform;
        }
        .cc-sv-tab > * { position: relative; z-index: 1; }
        .cc-sv-tab:hover::before, .cc-sv-tab.is-active::before { transform: scaleX(1); }
        .cc-sv-tab:hover, .cc-sv-tab.is-active { box-shadow: inset 0 -1px 0 rgba(46,58,52,0); }

        .cc-sv-tab-n {
          font-family: 'Inter', sans-serif; font-weight: 800; letter-spacing: 1.6px;
          font-size: clamp(10px, 0.75vw, 12px); color: rgba(46,58,52,0.38);
          transition: color .3s ease;
        }
        .cc-sv-tab-t {
          font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.015em;
          font-size: clamp(14px, 1.05vw, 18px); line-height: 1.25; color: rgba(46,58,52,0.58);
          transition: color .3s ease;
        }
        .cc-sv-tab-a {
          margin-left: auto; flex-shrink: 0; color: rgba(255,255,255,0.9);
          opacity: 0; transform: translateX(-6px);
          transition: opacity .35s ease, transform .5s cubic-bezier(.16,1,.3,1); will-change: transform;
        }
        .cc-sv-tab:hover .cc-sv-tab-n, .cc-sv-tab.is-active .cc-sv-tab-n { color: rgba(255,255,255,0.72); }
        .cc-sv-tab:hover .cc-sv-tab-t, .cc-sv-tab.is-active .cc-sv-tab-t { color: #fff; }
        .cc-sv-tab:hover .cc-sv-tab-a, .cc-sv-tab.is-active .cc-sv-tab-a { opacity: 1; transform: translateX(0); }
        .cc-sv-tab:focus-visible { outline: 2px solid ${TEXT}; outline-offset: -3px; }

        @media (min-width: 1920px) { .cc-sv-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-sv-inner { max-width: 2400px; } }

        /* ── tablet: seal drops out of the tile gutter, type shrinks ── */
        @media (max-width: 1100px) {
          .cc-sv-grid { grid-template-rows: clamp(140px, 20vw, 220px) auto; }
          .cc-sv-display { font-size: clamp(30px, 5.4vw, 60px); }
          .cc-sv-micro { grid-template-columns: 1fr 1fr; }
          .cc-sv-count { grid-column: 1 / 3; order: -1; }
        }

        /* ── mobile: single column spread ── */
        @media (max-width: 900px) {
          .cc-sv-grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: auto auto auto; }
          .cc-sv-main { grid-column: 1 / 3; grid-row: 1 / 2; aspect-ratio: 4 / 5; }
          .cc-sv-mid  { grid-column: 1 / 2; grid-row: 2 / 3; aspect-ratio: 1 / 1; }
          .cc-sv-side { grid-column: 2 / 3; grid-row: 2 / 3; aspect-ratio: 1 / 1; }
          .cc-sv-copy { grid-column: 1 / 3; grid-row: 3 / 4; padding: clamp(12px, 3vw, 18px) 2px 4px; }
          .cc-sv-seal {
            grid-column: 2 / 3; grid-row: 1 / 2; place-self: end;
            margin: 0 clamp(12px, 3vw, 18px) clamp(12px, 3vw, 18px) 0;
            width: clamp(88px, 24vw, 116px); height: clamp(88px, 24vw, 116px);
          }
          .cc-sv-arrow { display: none; }            /* the seal is the CTA here */
          .cc-sv-cap { right: clamp(96px, 30vw, 140px); }
          .cc-sv-display { font-size: clamp(34px, 9vw, 58px); }
          .cc-sv-index { padding-top: clamp(16px, 4vw, 24px); }
          .cc-sv-tabs { column-gap: clamp(8px, 2.4vw, 18px); }
        }

        @media (max-width: 560px) {
          .cc-sv-micro { grid-template-columns: 1fr; }
          .cc-sv-micro p { max-width: none; }
          .cc-sv-count { grid-column: 1 / -1; }
          .cc-sv-cap { right: clamp(90px, 34vw, 130px); font-size: 14px; }
          .cc-sv-tabs { grid-template-columns: 1fr; }   /* full-width rows: bigger tap targets */
          .cc-sv-tab { min-height: 52px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-sv-seal-ring { animation: none; }
          .cc-sv-arrow, .cc-sv-seal, .cc-sv-tab::before { transition: none; }
        }
      `}</style>

      <motion.div className="cc-sv-inner" onViewportEnter={preload} viewport={{ once: true, margin: '200px' }}>
        <div className="cc-sv-head">
          <div>
            <motion.p className="cc-sv-eyebrow" variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
              What We Handle
            </motion.p>
            <MaskReveal as="h2" className="cc-sv-h2" delay={0.05}>
              Your whole support desk, <span className="accent">under your brand</span>
            </MaskReveal>
          </div>
          <motion.p
            className="cc-sv-lead"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            transition={{ delay: 0.15, duration: 0.85, ease: EASE }}
          >
            One trained team covering every way your customers reach out - so you never
            hire, train or manage support staff again.
          </motion.p>
        </div>

        <motion.div className="cc-sv-canvas" variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          <div className="cc-sv-stage">
            <div className="cc-sv-grid" aria-label={`${cur.title} - service ${cur.n} of 06`}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.figure key={`main-${active}`} className="cc-sv-tile cc-sv-main" style={{ margin: 0 }} {...slide}>
                  <img src={cur.img.main} alt={cur.alt.main} width={1100} height={1400} decoding="async" />
                  <span className="cc-sv-pill">{cur.tag}</span>
                  <span className="cc-sv-scrim" aria-hidden />
                  <figcaption className="cc-sv-cap">{cur.caption}</figcaption>
                  <Link className="cc-sv-arrow" to="/contact" aria-label={`Talk to us about ${cur.title}`}>
                    <ArrowUpRight size={20} strokeWidth={2.2} aria-hidden />
                  </Link>
                </motion.figure>
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={`mid-${active}`} className="cc-sv-tile cc-sv-mid" {...slide}>
                  <img src={cur.img.mid} alt={cur.alt.mid} width={800} height={640} decoding="async" />
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={`side-${active}`} className="cc-sv-tile cc-sv-side" {...slide}>
                  <img src={cur.img.side} alt={cur.alt.side} width={800} height={1000} decoding="async" />
                </motion.div>
              </AnimatePresence>

              <Seal />

              <div className="cc-sv-copy">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`copy-${active}`}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2vw, 30px)' }}
                  >
                    <div className="cc-sv-micro">
                      <p>{cur.colA}</p>
                      <p>{cur.colB}</p>
                      <span className="cc-sv-count"><b>{cur.n}</b> / 06</span>
                    </div>

                    <h3 className="cc-sv-display">
                      {cur.head.map((w, i) => {
                        const word = (
                          <motion.span
                            className={`w ${w.tone}`}
                            initial={reduce ? false : { opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease: EASE }}
                          >
                            {w.t}
                          </motion.span>
                        )
                        if (i < cur.head.length - 1) return <span key={w.t}>{word}</span>
                        return (
                          <span className="last" key={w.t}>
                            {word}
                            <svg className="cc-sv-mark" viewBox="0 0 24 24" aria-hidden focusable="false">
                              <path d="M2 22 L22 22 L22 2 Z" fill="currentColor" />
                            </svg>
                          </span>
                        )
                      })}
                    </h3>
                  </motion.div>
                </AnimatePresence>

                <div className="cc-sv-index">
                  <p className="cc-sv-index-label">All services</p>
                  <div className="cc-sv-tabs" aria-label="Choose a service">
                    {SERVICES.map((s, i) => (
                      <button
                        key={s.title}
                        type="button"
                        id={`cc-sv-tab-${i}`}
                        className={`cc-sv-tab${active === i ? ' is-active' : ''}`}
                        aria-pressed={active === i}
                        onClick={() => setActive(i)}
                        onFocus={() => setActive(i)}
                      >
                        <span className="cc-sv-tab-n">{s.n}</span>
                        <span className="cc-sv-tab-t">{s.nav}</span>
                        <ArrowUpRight className="cc-sv-tab-a" size={17} strokeWidth={2.2} aria-hidden />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
