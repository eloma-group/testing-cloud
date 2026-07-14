import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { MaskReveal, fadeUp, VIEWPORT, EASE } from '../../lib/anim'

const TEXT   = '#2E3A34'
const ACCENT = '#D2704A'
const ACCENT_INK = '#A85434'   /* text-safe on white (5.3:1) - eyebrows, links, small labels */
const DARK   = '#3E4A42'
const CREAM  = '#F6F2EA'
const MUTED  = '#63706A'   // opaque: the old rgba(...,0.55) sat under AA on cream

const GLOSS       = 'linear-gradient(168deg, #F09A72 0%, #D2704A 48%, #9C4324 100%)'
const ACCENT_RIM  = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(84,34,16,0.3)'

/* ──────────────────────────────────────────────────────────────
   Editorial collage showcase. One service at a time, presented
   as a print-style spread: photo tiles, an oval seal, three rows
   of oversized display type with a note set beside the middle row.
   ────────────────────────────────────────────────────────────── */

type Tone = 'm' | 's' | 'a'          // muted / solid / accent
type Word = { t: string; tone: Tone }

type Service = {
  n: string
  tag: string
  nav: string
  title: string                       // plain-text title (screen readers, dot labels)
  /* Display type is always three rows - the note sits beside the middle one
     and the mark closes the last one, so the shape has to be fixed. */
  head: [Word[], Word[], Word[]]
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
    head: [
      [{ t: 'INBOUND', tone: 'm' }],
      [{ t: 'CALL', tone: 's' }],
      [{ t: 'HANDLING', tone: 'm' }],
    ],
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
    head: [
      [{ t: 'LIVE', tone: 'm' }],
      [{ t: 'CHAT', tone: 's' }, { t: '&', tone: 'a' }],
      [{ t: 'EMAIL', tone: 'm' }],
    ],
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
    head: [
      [{ t: 'TECHNICAL', tone: 'm' }],
      [{ t: 'HELP', tone: 's' }],
      [{ t: 'DESK', tone: 'm' }],
    ],
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
    head: [
      [{ t: '24/7', tone: 'a' }],
      [{ t: 'MULTILINGUAL', tone: 's' }],
      [{ t: 'SUPPORT', tone: 'm' }],
    ],
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
    head: [
      [{ t: 'OUTBOUND', tone: 'm' }],
      [{ t: 'AND', tone: 'a' }],
      [{ t: 'TELESALES', tone: 's' }],
    ],
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
    head: [
      [{ t: 'BACK', tone: 's' }],
      [{ t: 'OFFICE', tone: 'm' }],
      [{ t: 'AND ORDERS', tone: 'm' }],
    ],
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

/* A still oval seal: the type is set on its side, the asterisk sits under it.
   Nothing spins - the reference reads as a printed stamp, not a widget. */
function Seal() {
  return (
    <Link className="cc-sv-seal" to="/contact#write" aria-label="Get in touch about our services">
      <span className="cc-sv-seal-text" aria-hidden>
        Get in
        <br />
        touch
      </span>
      <svg className="cc-sv-seal-star" viewBox="0 0 24 24" aria-hidden focusable="false">
        <path
          d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        />
      </svg>
    </Link>
  )
}

const AUTOPLAY_MS = 3000

export function Services() {
  const reduce = useReducedMotion() ?? false
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false)
  const cur = SERVICES[active]
  const warmed = useRef(false)

  /* The spread advances on its own, but only while it is on screen and nobody
     is reading it - hovering or tabbing into the section holds the current
     service. `active` is a dependency so a manual pick restarts the clock
     rather than being cut short by a tick already in flight. */
  useEffect(() => {
    if (reduce || paused || !inView) return
    const id = window.setInterval(
      () => setActive(i => (i + 1) % SERVICES.length),
      AUTOPLAY_MS,
    )
    return () => window.clearInterval(id)
  }, [reduce, paused, inView, active])

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
        /* White at the top, drifting into cream at the foot. The section under
           this one starts at white again, so the seam reads as a soft band
           rather than a colour change - that is the whole rhythm. */
        .cc-sv {
          position: relative; isolation: isolate;
          background: linear-gradient(180deg, #FFFFFF 0%, #FDFBF7 42%, ${CREAM} 78%, #EFE8DC 100%);
          color: ${TEXT};
          padding: clamp(68px, 8.4vw, 148px) clamp(24px, 4vw, 64px);
          overflow: hidden;
        }
        /* One hue. A single soft terracotta bloom, felt rather than seen. */
        .cc-sv::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(58% 46% at 96% 96%, rgba(210,112,74,0.10), transparent 70%);
        }
        .cc-sv-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }

        /* ── section header ── */
        .cc-sv-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px;
          color: ${ACCENT_INK}; margin: 0 0 clamp(14px, 1.6vw, 22px);
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

        /* ── canvas: glossy frame + inner stage (the "spread") ── */
        /* The card is white, on a wash that is not. That difference is the
           contrast - not a heavy drop shadow. The shadow is here only to say
           the card is resting on the page, and you should have to look for it. */
        .cc-sv-canvas {
          position: relative;
          border-radius: clamp(22px, 2.2vw, 38px);
          background: #FFFFFF;
          padding: clamp(8px, 0.8vw, 14px);
          box-shadow:
            inset 0 0 0 1px rgba(20,20,22,0.07),
            0 1px 3px rgba(20,20,22,0.05),
            0 18px 40px -22px rgba(20,20,22,0.16),
            0 46px 84px -50px rgba(20,20,22,0.20);
        }
        .cc-sv-canvas::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          border-radius: inherit;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.9) 0%,
            rgba(255,255,255,0.24) 3%,
            rgba(255,255,255,0) 14%
          );
        }
        /* the inner stage carries the cream, so the photo tiles read as lit */
        .cc-sv-stage {
          position: relative; overflow: hidden;
          border-radius: clamp(16px, 1.6vw, 28px);
          background: linear-gradient(168deg, #FBF8F3 0%, ${CREAM} 60%, #EFE8DC 100%);
          box-shadow: inset 0 0 0 1px rgba(20,20,22,0.05);
          padding: clamp(10px, 1vw, 16px);
        }

        .cc-sv-grid {
          display: grid;
          /* minmax(0, 1fr), not 1fr. A bare 1fr is minmax(auto, 1fr), and that
             auto minimum grows the track to its item's min-content - so the seal's
             own width was inflating its column to fit, and it could never overflow
             onto the tiles beside it. Flooring the minimum at 0 pins the columns
             to their share of the grid and lets the seal spill out of its cell. */
          grid-template-columns: repeat(12, minmax(0, 1fr));
          /* Both rows are given a real height. The copy row can then hand that
             height to the display type, which spreads its three lines across it
             instead of bunching them at the bottom and leaving dead cream above. */
          grid-template-rows: clamp(225px, 23.5vw, 390px) clamp(200px, 21vw, 355px);
          gap: clamp(8px, 0.9vw, 14px);
        }

        /* photo tiles */
        .cc-sv-tile { position: relative; overflow: hidden; border-radius: clamp(12px, 1.3vw, 22px); background: #E2DFD7; }
        .cc-sv-tile img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transform: scale(1.001); /* kills sub-pixel seams on scale-in */
        }
        /* The seal has a column of its own but bleeds a little into the tiles on
           either side, and the stack is deliberately uneven: the seal rides over
           the mid tile, while the side tile rides over the seal. That is what
           gives the group depth instead of reading as three flat panes. */
        .cc-sv-main { grid-column: 1 / 6;   grid-row: 1 / 3; }
        .cc-sv-mid  { grid-column: 6 / 9;   grid-row: 1 / 2; z-index: 1; }
        .cc-sv-side { grid-column: 10 / 13; grid-row: 1 / 2; z-index: 4; }
        .cc-sv-copy {
          grid-column: 6 / 13; grid-row: 2 / 3;
          display: flex;
          padding: clamp(10px, 1.2vw, 20px) clamp(4px, 0.6vw, 10px) clamp(2px, 0.4vw, 6px);
        }

        /* main tile furniture: tag pill, caption scrim, arrow */
        .cc-sv-pill {
          position: absolute; top: clamp(12px, 1.2vw, 20px); left: clamp(12px, 1.2vw, 20px); z-index: 2;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.75vw, 12px); letter-spacing: 2px; color: ${TEXT};
          padding: 8px 14px; border-radius: 100px;
          background: linear-gradient(168deg, rgba(255,255,255,0.98), rgba(255,255,255,0.82));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            inset 0 0 0 1px rgba(255,255,255,0.6),
            0 6px 16px -8px rgba(28,36,31,0.5);
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
          display: grid; place-items: center; color: ${TEXT}; text-decoration: none;
          background: linear-gradient(168deg, #FFFFFF, ${CREAM} 60%, #E6E2D9);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            0 8px 18px -8px rgba(28,36,31,0.55);
          transition: transform .5s cubic-bezier(.16,1,.3,1), background .35s ease,
                      color .3s ease, box-shadow .35s ease;
          will-change: transform;
        }
        .cc-sv-arrow:hover {
          transform: translate(3px, -3px); color: #fff;
          background: ${GLOSS};
          box-shadow: ${ACCENT_RIM}, 0 12px 24px -10px rgba(156,67,36,0.7);
        }

        /* The oval seal stands as tall as the tiles beside it and is deliberately
           wider than its column, so it laps onto both neighbours.

           The width has to be an explicit length. A centred grid item is sized by
           fit-content, which clamps to the column - so an aspect-ratio width was
           being capped at the column and never overflowed. An explicit width is
           always honoured and overflows. Both this and the row height are driven
           off vw, so the ellipse keeps its proportion as the grid scales. */
        .cc-sv-seal {
          grid-column: 9 / 10; grid-row: 1 / 2; place-self: center; z-index: 3;
          position: relative; text-decoration: none;
          height: 88%; width: clamp(142px, 14.6vw, 242px);
          border-radius: 50%;                 /* an ellipse, not a disc */
          color: #fff;
          /* a polished stone: highlight off the top-left, shadow rolling away */
          background: radial-gradient(ellipse at 34% 24%, #5E6B62 0%, ${DARK} 38%, ${TEXT} 66%, #1A211D 100%);
          box-shadow:
            inset 0 2px 1px rgba(255,255,255,0.22),
            inset 0 -2px 6px rgba(0,0,0,0.35),
            0 3px 6px rgba(28,36,31,0.3),
            0 18px 40px -18px rgba(28,36,31,0.75);
          transition: transform .5s cubic-bezier(.16,1,.3,1), box-shadow .35s ease;
          will-change: transform;
        }
        .cc-sv-seal:hover {
          transform: scale(1.05);
          box-shadow:
            inset 0 2px 1px rgba(255,255,255,0.3),
            inset 0 -2px 6px rgba(0,0,0,0.35),
            0 3px 6px rgba(28,36,31,0.35),
            0 26px 52px -18px rgba(28,36,31,0.8);
        }
        /* the label is set on its side, reading bottom to top */
        .cc-sv-seal-text {
          position: absolute; top: 42%; left: 50%;
          transform: translate(-50%, -50%) rotate(-90deg);
          font-family: 'Inter', sans-serif; font-weight: 900; text-transform: uppercase;
          font-size: clamp(16px, 1.45vw, 23px); letter-spacing: 3.4px; line-height: 1.28;
          text-align: center; white-space: nowrap; color: #fff;
        }
        .cc-sv-seal-star {
          position: absolute; left: 50%; bottom: 10%;
          transform: translateX(-50%);
          width: 34%; max-width: 58px; height: auto; aspect-ratio: 1;
          color: #fff; transition: color .35s ease;
        }
        .cc-sv-seal:hover .cc-sv-seal-star { color: ${ACCENT}; }

        /* ── the spread's bottom-right: three rows of display type, the note
              sitting beside the middle row, the mark closing the last one.
              The three rows are equal height, so centring the note against the
              block lands it exactly on row two - no magic offsets. ── */
        .cc-sv-spread {
          flex: 1; min-height: 0;
          display: flex; align-items: stretch; gap: clamp(18px, 2.4vw, 44px);
          width: 100%;
        }
        /* centred against the full block, so it lands in the gap between the
           first row and the third - level with the middle row */
        .cc-sv-note {
          flex: 0 0 clamp(180px, 19.5vw, 300px);
          display: flex; flex-direction: column; justify-content: center;
          gap: clamp(8px, 0.8vw, 12px);
        }
        .cc-sv-note p {
          font-family: 'Inter', sans-serif; margin: 0;
          font-size: clamp(15px, 1.15vw, 18px); line-height: 1.62; color: ${MUTED};
        }

        /* space-between is what makes the three rows own the whole height */
        .cc-sv-display {
          flex: 1; min-width: 0; margin: 0;
          display: flex; flex-direction: column;
          align-items: flex-end; justify-content: space-between;
          font-family: 'Poppins', sans-serif; font-weight: 900; text-transform: uppercase;
          font-size: clamp(30px, 4.5vw, 86px); line-height: 0.94; letter-spacing: -0.045em;
        }
        .cc-sv-line {
          display: flex; align-items: baseline; gap: 0.2em;
          white-space: nowrap; max-width: 100%;
        }
        .cc-sv-line .w { display: inline-block; will-change: transform; }
        .cc-sv-display .m { color: #9AA39D; }
        .cc-sv-display .s { color: ${TEXT}; }
        .cc-sv-display .a { color: ${ACCENT}; }
        .cc-sv-mark {
          width: 0.42em; height: 0.42em; align-self: center; flex-shrink: 0;
          color: ${TEXT}; margin-left: 0.12em;
        }

        /* ── service navigation, under the card ──
              Bare dots were near-invisible on the cream foot of the section and
              said nothing about where you were going. These are labelled tabs
              sitting in a raised rail: the rail gives the inactive tabs an edge
              to read against, the active one takes the terracotta gloss. ── */
        .cc-sv-nav {
          display: flex; flex-direction: column; align-items: center;
          gap: clamp(10px, 1vw, 15px);
          margin-top: clamp(24px, 2.8vw, 44px);
        }
        .cc-sv-tabs {
          display: flex; align-items: center; justify-content: center;
          flex-wrap: wrap; gap: clamp(3px, 0.35vw, 6px);
          padding: clamp(4px, 0.45vw, 7px); border-radius: 100px; max-width: 100%;
          background: linear-gradient(168deg, #FFFFFF 0%, #F3EEE4 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            inset 0 0 0 1px rgba(26,33,29,0.12),
            0 10px 24px -16px rgba(28,36,31,0.5);
        }
        .cc-sv-tab {
          display: inline-flex; align-items: center; gap: 9px;
          min-height: 44px; padding: 0 clamp(12px, 1.1vw, 18px);
          border: 0; border-radius: 100px; cursor: pointer; background: transparent;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(11px, 0.78vw, 13px); letter-spacing: 1.6px;
          color: #5C6863;              /* opaque, ~5.9:1 on the rail - readable at rest */
          white-space: nowrap;
          transition: color .3s ease, background .35s ease, box-shadow .35s ease;
        }
        .cc-sv-tab em {
          font-style: normal; font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: clamp(13px, 0.95vw, 16px); letter-spacing: -0.02em;
          color: #8B948F; transition: color .3s ease;
        }
        .cc-sv-tab:hover {
          color: ${TEXT}; background: #FFFFFF;
          box-shadow: inset 0 0 0 1px rgba(26,33,29,0.10), 0 4px 10px -6px rgba(28,36,31,0.45);
        }
        .cc-sv-tab:hover em { color: ${ACCENT_INK}; }
        .cc-sv-tab.is-active {
          color: #FFFFFF; background: ${GLOSS};
          box-shadow: ${ACCENT_RIM}, 0 8px 18px -8px rgba(156,67,36,0.65);
        }
        .cc-sv-tab.is-active em { color: rgba(255,255,255,0.78); }
        .cc-sv-tab:focus-visible { outline: 2px solid ${ACCENT_INK}; outline-offset: 2px; }

        /* the counter is the fallback label once the tabs collapse to numbers */
        .cc-sv-nav-label {
          margin: 0; display: none; align-items: baseline; gap: 10px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(11px, 0.78vw, 13px); letter-spacing: 2.2px; color: #6C7873;
        }
        .cc-sv-nav-label b {
          font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: clamp(15px, 1.05vw, 18px); letter-spacing: -0.02em; color: ${TEXT};
        }
        .cc-sv-nav-label span { color: ${TEXT}; }

        @media (min-width: 1920px) { .cc-sv-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-sv-inner { max-width: 2400px; } }

        /* ── tablet: seal drops out of the tile gutter, type shrinks ── */
        @media (max-width: 1100px) {
          .cc-sv-grid { grid-template-rows: clamp(200px, 27vw, 320px) clamp(185px, 25vw, 300px); }
          .cc-sv-display { font-size: clamp(30px, 5.4vw, 60px); }
          .cc-sv-note { flex-basis: clamp(150px, 24vw, 220px); }
        }

        /* Below ~1280 the six names stop fitting on one rail, so the tabs fall
           back to their numbers and the counter underneath carries the label. */
        @media (max-width: 1279px) {
          .cc-sv-tab { padding: 0; width: 44px; justify-content: center; gap: 0; }
          .cc-sv-tab span { display: none; }
          .cc-sv-tab em { font-size: 15px; }
          .cc-sv-nav-label { display: inline-flex; }
        }

        /* ── mobile: single column spread, note stacks over the type ── */
        @media (max-width: 900px) {
          .cc-sv-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: auto auto auto; }
          .cc-sv-main { grid-column: 1 / 3; grid-row: 1 / 2; aspect-ratio: 4 / 5; }
          .cc-sv-mid  { grid-column: 1 / 2; grid-row: 2 / 3; aspect-ratio: 1 / 1; }
          .cc-sv-side { grid-column: 2 / 3; grid-row: 2 / 3; aspect-ratio: 1 / 1; }
          .cc-sv-copy { grid-column: 1 / 3; grid-row: 3 / 4; padding: clamp(12px, 3vw, 18px) 2px 4px; }
          .cc-sv-seal {
            grid-column: 2 / 3; grid-row: 1 / 2; place-self: end;
            margin: 0 clamp(12px, 3vw, 18px) clamp(12px, 3vw, 18px) 0;
            width: clamp(84px, 22vw, 112px); height: clamp(112px, 29vw, 150px);
          }
          .cc-sv-arrow { display: none; }            /* the seal is the CTA here */
          .cc-sv-cap { right: clamp(96px, 30vw, 140px); }
          /* the row heights go back to auto here, so the type stops spreading
             and simply stacks */
          .cc-sv-spread { flex-direction: column; align-items: stretch; gap: clamp(14px, 3vw, 22px); }
          .cc-sv-note { flex: none; justify-content: flex-start; }
          .cc-sv-display {
            font-size: clamp(34px, 9vw, 58px);
            align-items: flex-start; justify-content: flex-start;
            gap: 0;
          }
        }

        @media (max-width: 560px) {
          .cc-sv-cap { right: clamp(90px, 34vw, 130px); font-size: 14px; }
          .cc-sv-tab { width: 46px; }        /* stays over the 44px touch target */
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-sv-arrow, .cc-sv-seal, .cc-sv-tab { transition: none; }
        }
      `}</style>

      <motion.div
        className="cc-sv-inner"
        viewport={{ amount: 0.2, margin: '120px' }}
        onViewportEnter={() => { preload(); setInView(true) }}
        onViewportLeave={() => setInView(false)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
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
                  <Link className="cc-sv-arrow" to="/contact#write" aria-label={`Talk to us about ${cur.title}`}>
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
                    className="cc-sv-spread"
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <div className="cc-sv-note">
                      <p>{cur.colA}</p>
                      <p>{cur.colB}</p>
                    </div>

                    <h3 className="cc-sv-display">
                      {cur.head.map((line, li) => (
                        <span className="cc-sv-line" key={li}>
                          {line.map((w, wi) => (
                            <motion.span
                              key={w.t}
                              className={`w ${w.tone}`}
                              initial={reduce ? false : { opacity: 0, y: 18 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.08 + (li * 2 + wi) * 0.06, duration: 0.6, ease: EASE }}
                            >
                              {w.t}
                            </motion.span>
                          ))}
                          {li === 2 && (
                            <svg className="cc-sv-mark" viewBox="0 0 24 24" aria-hidden focusable="false">
                              <path d="M2 22 L22 22 L22 2 Z" fill="currentColor" />
                            </svg>
                          )}
                        </span>
                      ))}
                    </h3>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── navigation: the six services, under the card ── */}
        <motion.div className="cc-sv-nav" variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          <div className="cc-sv-tabs">
            {SERVICES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                className={`cc-sv-tab${active === i ? ' is-active' : ''}`}
                aria-pressed={active === i}
                aria-label={`${s.n} - ${s.title}`}
                onClick={() => setActive(i)}
              >
                <em aria-hidden>{s.n}</em>
                <span aria-hidden>{s.nav}</span>
              </button>
            ))}
          </div>
          <p className="cc-sv-nav-label" aria-live="polite">
            <b>{cur.n}</b> / 06 <span>{cur.nav}</span>
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
