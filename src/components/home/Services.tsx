import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { MaskReveal, fadeUp, VIEWPORT, EASE } from '../../lib/anim'

const TEXT   = '#16141F'
const ACCENT = '#998EFF'
const ACCENT_INK = '#6A5BE8'   /* text-safe on white (5.3:1) - eyebrows, links, small labels */
const WASH  = '#F4F2FD'
const MUTED  = '#5E5B6B'   // opaque: the old rgba(...,0.55) sat under AA on the wash

const GLOSS       = 'linear-gradient(168deg, #C3BCFF 0%, #998EFF 48%, #4A3DBF 100%)'
const ACCENT_RIM  = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(40,32,100,0.3)'

/* ──────────────────────────────────────────────────────────────
   Full-bleed editorial spread - no card, no frame. The object owns
   the middle of the section at full height; the heading runs to its
   left and is deliberately passed over by it. Down the left, three
   photo tiles ride an arc with the live service lowest and largest,
   the note reading off their right. To the right of the object: the
   service's own shot, captioned under it. The count closes the
   bottom-right corner.
   ────────────────────────────────────────────────────────────── */

type Service = {
  n: string
  tag: string
  nav: string
  title: string
  lede: string        // set beside the arc, under the service title
  caption: string     // set under the shot on the right
  img: { tile: string; shot: string }
  alt: { tile: string; shot: string }
}

const SERVICES: Service[] = [
  {
    n: '01', tag: 'Voice', nav: 'Inbound Voice',
    title: 'Inbound Call Handling',
    lede: 'Every incoming call is picked up by a trained agent, in your brand name - so no customer waits in a queue or lands in a voicemail black hole.',
    caption: 'Scripts, tone of voice and escalation rules are built around your brand before the first call is ever taken.',
    img: { tile: '/images/services/s1-main.jpg', shot: '/images/services/s1-side.jpg' },
    alt: {
      tile: 'Call centre agent wearing a headset speaking with a customer',
      shot: 'Two call centre agents taking calls on headsets at a shared desk',
    },
  },
  {
    n: '02', tag: 'Digital', nav: 'Live Chat & Email',
    title: 'Live Chat and Email',
    lede: 'Real-time chat cover on your website and app, with replies that read exactly like your own team wrote them.',
    caption: 'Inbox triage, follow-ups and tagging handled for you, so nothing sits unread overnight or slips past an SLA.',
    img: { tile: '/images/services/s2-main.jpg', shot: '/images/services/s2-side.jpg' },
    alt: {
      tile: 'Support agent with a headset typing a chat reply at a desk',
      shot: 'Customer support agent working on a laptop in a bright office',
    },
  },
  {
    n: '03', tag: 'Support', nav: 'Technical Helpdesk',
    title: 'Technical Helpdesk',
    lede: 'Tickets are raised, diagnosed and escalated with a clear trail, so product issues never stall halfway through a fix.',
    caption: 'Your engineers only see what genuinely needs them. Everything else is closed before it reaches their queue.',
    img: { tile: '/images/services/s3-main.jpg', shot: '/images/services/s3-side.jpg' },
    alt: {
      tile: 'Helpdesk agent with a headset troubleshooting on a laptop',
      shot: 'Technical support team working at computers with headsets',
    },
  },
  {
    n: '04', tag: 'Global', nav: '24/7 Multilingual',
    title: '24/7 Multilingual Support',
    lede: 'Round-the-clock cover across time zones, weekends and public holidays, with no drop in tone, accuracy or patience.',
    caption: 'Native and near-native agents, so every customer is answered in the language they reached out in.',
    img: { tile: '/images/services/s4-main.jpg', shot: '/images/services/s4-side.jpg' },
    alt: {
      tile: 'Diverse team of multilingual support agents on headsets',
      shot: 'Agent taking a call late at night at a lit desk',
    },
  },
  {
    n: '05', tag: 'Growth', nav: 'Outbound Sales',
    title: 'Outbound and Telesales',
    lede: 'Proactive callbacks, renewals and win-backs run to a script you approve, measured and coached call by call.',
    caption: 'Every outcome is logged and reported, so you can see exactly what pipeline the calls actually created.',
    img: { tile: '/images/services/s5-main.jpg', shot: '/images/services/s5-side.jpg' },
    alt: {
      tile: 'Confident telesales agent with a headset on an outbound call',
      shot: 'Two agents making outbound calls in a bright office',
    },
  },
  {
    n: '06', tag: 'Operations', nav: 'Back-Office',
    title: 'Back-Office and Orders',
    lede: 'Order processing, data entry and CRM hygiene handled off your plate, with the accuracy and speed the work demands.',
    caption: 'After-call paperwork never piles up, so your front line stays free to do what you hired them for: talking to customers.',
    img: { tile: '/images/services/s6-main.jpg', shot: '/images/services/s6-side.jpg' },
    alt: {
      tile: 'Back-office administrator processing order paperwork at a desk',
      shot: 'Desk with laptop, documents and order boxes ready for dispatch',
    },
  },
]

/* Where a tile sits once it is 0, 1 or 2 steps from the front. Offsets are a
   percentage of the tile's own box, so the arc holds its shape at every size.
   Anything further back parks off the arc at zero opacity. */
const SLOTS = [
  { x: '0%',   y: '0%',    scale: 1,    rotate: -2,  opacity: 1, zIndex: 3 },
  { x: '-15%', y: '-54%',  scale: 0.78, rotate: -7,  opacity: 1, zIndex: 2 },
  { x: '-42%', y: '-98%',  scale: 0.60, rotate: -13, opacity: 1, zIndex: 1 },
]
const PARKED = { x: '-62%', y: '-132%', scale: 0.44, rotate: -18, opacity: 0, zIndex: 0 }

const AUTOPLAY_MS = 3600

export function Services() {
  const reduce = useReducedMotion() ?? false
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false)
  const cur = SERVICES[active]
  const warmed = useRef(false)

  /* The object drifts against the scroll - transform only, driven off
     useScroll, so it never touches layout. */
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const objectY = useTransform(scrollYProgress, [0, 1], [26, -26])

  /* The arc advances on its own, but only while it is on screen and nobody is
     reading it - hovering or tabbing into the section holds the current
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

  /* Warm the image cache once the section is in view, so a tile riding onto
     the arc never arrives empty. */
  const preload = useCallback(() => {
    if (warmed.current) return
    warmed.current = true
    const run = () => {
      for (const s of SERVICES) {
        for (const src of [s.img.tile, s.img.shot]) {
          const im = new Image()
          im.src = src
        }
      }
    }
    const idle: typeof window.requestIdleCallback | undefined = window.requestIdleCallback
    if (idle) idle(run, { timeout: 2500 })
    else window.setTimeout(run, 1200)
  }, [])

  const swap = {
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: reduce ? {} : { opacity: 1, y: 0 },
    exit: reduce ? {} : { opacity: 0, y: -10 },
    transition: { duration: reduce ? 0 : 0.5, ease: EASE },
  }

  return (
    <section className="cc-sv" id="services" aria-label="Our services" ref={ref}>
      <style>{`
        /* White at the top, drifting into the wash at the foot. The section under
           this one starts at white again, so the seam reads as a soft band
           rather than a colour change - that is the whole rhythm. */
        .cc-sv {
          position: relative; isolation: isolate;
          background: linear-gradient(180deg, #FFFFFF 0%, #FBFAFE 42%, ${WASH} 78%, #E3DEF8 100%);
          color: ${TEXT};
          padding: clamp(68px, 8.4vw, 148px) clamp(24px, 4vw, 64px);
          overflow: hidden;
        }
        /* One hue. A single soft violet bloom, felt rather than seen. */
        .cc-sv::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(58% 46% at 96% 96%, rgba(153,142,255,0.10), transparent 70%);
        }
        /* Nothing frames the spread - it runs to the section's own edges, the
           way the block below it does. The three columns simply sit on the
           wash, and the object holds the middle of them. */
        .cc-sv-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }
        /* the spread itself: everything the object has to stay centred against */
        .cc-sv-stage { position: relative; min-height: clamp(560px, 56vw, 900px); }
        .cc-sv-grid {
          position: relative; z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.92fr) minmax(0, 0.8fr);
          gap: clamp(16px, 2vw, 40px);
          min-height: inherit;
        }

        /* ── the object: dead centre, at full height ──
              It passes over the display type on purpose - the type running
              behind it is what gives the spread its depth. Decorative, so it
              never takes a hit during scroll.

              Centred by the grid, never by translate(-50%): the parallax writes
              an inline transform, and an inline transform beats the stylesheet -
              so a transform used for layout here would be wiped the moment the
              section scrolls. */
        .cc-sv-object {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          display: grid; place-items: center;
        }
        .cc-sv-object-p { width: clamp(300px, 46vw, 900px); will-change: transform; }
        .cc-sv-object-float {
          position: relative; display: block; width: 100%;
          will-change: transform;
          animation: cc-sv-drift 9s cubic-bezier(.45,.05,.55,.95) infinite;
        }
        .cc-sv-object img {
          display: block; width: 100%; height: auto;
          filter: drop-shadow(0 40px 52px rgba(22,20,31,0.28));
        }
        /* the pool of light it stands in */
        .cc-sv-object-glow {
          position: absolute; z-index: -1; left: 50%; top: 50%;
          width: 118%; aspect-ratio: 5 / 3; transform: translate(-50%, -46%);
          background: radial-gradient(closest-side, rgba(153,142,255,0.32), rgba(153,142,255,0) 70%);
        }
        @keyframes cc-sv-drift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -16px, 0); }
        }

        /* ── left column: eyebrow, display heading, then the arc ── */
        .cc-sv-left { position: relative; display: flex; flex-direction: column; }
        /* the heading is the one thing the object is allowed to cross */
        .cc-sv-head { position: relative; z-index: 1; }
        .cc-sv-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px;
          color: ${ACCENT_INK}; margin: 0 0 clamp(12px, 1.4vw, 20px);
        }
        .cc-sv-eyebrow::before { content: ''; width: clamp(26px, 4vw, 54px); height: 1px; background: ${ACCENT}; opacity: 0.6; }
        .cc-sv-h2 {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: clamp(36px, 4.9vw, 78px); line-height: 1.0; letter-spacing: -0.028em;
          margin: 0; color: ${TEXT}; max-width: 12ch;
        }
        .cc-sv-h2 .accent { color: ${ACCENT_INK}; }

        /* The arc and the note that reads it, sitting under the heading.
           The back tile rides ~0.8 of a tile-height above the arc box, so the
           padding has to clear that or it lands in the heading. */
        .cc-sv-row {
          position: relative; z-index: 4;
          display: flex; align-items: flex-end; gap: clamp(18px, 2.2vw, 40px);
          margin-top: auto;                          /* pinned to the foot of the column */
          padding-top: clamp(152px, 15vw, 234px);    /* headroom for the tiles that ride up */
          padding-bottom: clamp(0px, 2vw, 40px);
        }
        /* the middle column is the object's ground - it holds space, nothing else */
        .cc-sv-gap { pointer-events: none; }
        /* nudged in from the column edge, so the tile at the back of the arc -
           which rides up and to the left - still lands inside the section */
        .cc-sv-arc {
          position: relative; flex: none;
          margin-left: clamp(30px, 3.4vw, 68px);
          width: clamp(124px, 12.4vw, 190px); aspect-ratio: 3 / 4;
        }
        .cc-sv-tile {
          position: absolute; inset: 0; padding: 0; border: 0; cursor: pointer;
          background: #DFDCF6; overflow: hidden;
          border-radius: clamp(10px, 1vw, 16px);
          box-shadow:
            0 2px 6px rgba(26,22,44,0.12),
            0 18px 34px -18px rgba(26,22,44,0.45);
          will-change: transform;
        }
        .cc-sv-tile img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transform: scale(1.001);      /* kills sub-pixel seams under scale */
        }
        .cc-sv-tile::after {            /* the rim, so a light photo still has an edge */
          content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5), inset 0 0 0 2px rgba(26,22,44,0.06);
        }
        .cc-sv-tile.is-front::after {
          box-shadow: inset 0 0 0 2px rgba(255,255,255,0.85), inset 0 0 0 3px ${ACCENT};
        }
        .cc-sv-tile:focus-visible { outline: 2px solid ${ACCENT_INK}; outline-offset: 3px; }

        .cc-sv-note { flex: 1; min-width: 0; padding-bottom: clamp(2px, 0.5vw, 8px); }
        .cc-sv-note-n {
          display: block; font-family: 'Inter', sans-serif; font-weight: 800;
          font-size: clamp(10px, 0.78vw, 12px); letter-spacing: 2.4px; text-transform: uppercase;
          color: ${ACCENT_INK}; margin: 0 0 clamp(6px, 0.7vw, 10px);
        }
        .cc-sv-note h3 {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: clamp(20px, 1.85vw, 30px); line-height: 1.14; letter-spacing: -0.022em;
          color: ${TEXT}; margin: 0 0 clamp(8px, 0.9vw, 14px);
        }
        .cc-sv-note p {
          font-family: 'Inter', sans-serif; margin: 0;
          font-size: clamp(14px, 1.05vw, 17px); line-height: 1.68; color: ${MUTED};
          max-width: 34ch;
        }
        /* the drop cap is what makes the block read as a printed note */
        .cc-sv-note p::first-letter {
          float: left; font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: 3.1em; line-height: 0.78; padding: 0.04em 0.1em 0 0; color: ${TEXT};
        }

        /* ── right column: the service's own shot, captioned under it.
              Sits on the object's eye-line, not at the top of the column. ── */
        .cc-sv-right {
          position: relative; z-index: 4;
          display: flex; flex-direction: column; justify-content: center;
          gap: clamp(12px, 1.3vw, 20px);
          padding-bottom: clamp(40px, 5vw, 90px);
        }
        .cc-sv-shot {
          position: relative; overflow: hidden; margin: 0;
          width: 100%; aspect-ratio: 4 / 5;
          border-radius: clamp(10px, 1vw, 16px); background: #DFDCF6;
          box-shadow:
            0 2px 6px rgba(26,22,44,0.12),
            0 20px 38px -20px rgba(26,22,44,0.45),
            inset 0 0 0 1px rgba(255,255,255,0.5);
        }
        .cc-sv-shot img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cc-sv-shot-pill {
          position: absolute; top: 10px; left: 10px; z-index: 2;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(9px, 0.68vw, 11px); letter-spacing: 1.8px; color: ${TEXT};
          padding: 6px 12px; border-radius: 100px;
          background: linear-gradient(168deg, rgba(255,255,255,0.98), rgba(255,255,255,0.84));
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), 0 6px 16px -8px rgba(22,20,31,0.5);
        }
        .cc-sv-shot-cap {
          font-family: 'Inter', sans-serif; margin: 0;
          font-size: clamp(14px, 1vw, 16px); line-height: 1.66; color: ${MUTED};
        }
        .cc-sv-shot-cap::first-letter {
          float: left; font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: 2.9em; line-height: 0.8; padding: 0.04em 0.1em 0 0; color: ${ACCENT_INK};
        }

        /* ── the round CTA, riding the object's left shoulder ── */
        .cc-sv-cta {
          position: absolute; z-index: 5; left: 37%; top: 52%;
          transform: translate(-50%, -50%);
          width: clamp(78px, 7.4vw, 112px); height: clamp(78px, 7.4vw, 112px);
          border-radius: 100px; text-decoration: none;
          display: grid; place-items: center; gap: 2px;
          color: #fff; background: ${GLOSS};
          box-shadow: ${ACCENT_RIM}, 0 6px 14px -6px rgba(74,61,191,0.5), 0 22px 44px -20px rgba(74,61,191,0.75);
          transition: transform .5s cubic-bezier(.16,1,.3,1), box-shadow .35s ease;
          will-change: transform;
        }
        .cc-sv-cta:hover {
          transform: translate(-50%, -50%) scale(1.07);
          box-shadow: ${ACCENT_RIM}, 0 8px 18px -6px rgba(74,61,191,0.55), 0 30px 60px -22px rgba(74,61,191,0.85);
        }
        .cc-sv-cta span {
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(8px, 0.62vw, 10px); letter-spacing: 1.6px; text-align: center;
          line-height: 1.25;
        }
        .cc-sv-cta:focus-visible { outline: 2px solid ${ACCENT_INK}; outline-offset: 4px; }

        /* ── the counter, closing the bottom-right corner ── */
        .cc-sv-count {
          position: absolute; z-index: 4; right: 0; bottom: 0;
          display: flex; align-items: baseline; gap: 6px; margin: 0;
          font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.03em;
          color: #B4AFC6;
        }
        .cc-sv-count b { font-weight: 600; font-size: clamp(38px, 4.4vw, 76px); line-height: 1; color: ${TEXT}; }
        .cc-sv-count i { font-style: normal; font-size: clamp(14px, 1.2vw, 20px); }

        /* ── the six services, under the spread ── */
        .cc-sv-nav {
          display: flex; flex-direction: column; align-items: center;
          gap: clamp(10px, 1vw, 15px);
          margin-top: clamp(36px, 3.6vw, 58px);
        }
        .cc-sv-tabs {
          display: flex; align-items: center; justify-content: center;
          flex-wrap: wrap; gap: clamp(3px, 0.35vw, 6px);
          padding: clamp(4px, 0.45vw, 7px); border-radius: 100px; max-width: 100%;
          background: linear-gradient(168deg, #FFFFFF 0%, #EFECFB 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            inset 0 0 0 1px rgba(22,20,31,0.12),
            0 10px 24px -16px rgba(22,20,31,0.5);
        }
        .cc-sv-tab {
          display: inline-flex; align-items: center; gap: 9px;
          min-height: 44px; padding: 0 clamp(12px, 1.1vw, 18px);
          border: 0; border-radius: 100px; cursor: pointer; background: transparent;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(11px, 0.78vw, 13px); letter-spacing: 1.6px;
          color: #5C5869;              /* opaque, ~5.9:1 on the rail - readable at rest */
          white-space: nowrap;
          transition: color .3s ease, background .35s ease, box-shadow .35s ease;
        }
        .cc-sv-tab em {
          font-style: normal; font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: clamp(13px, 0.95vw, 16px); letter-spacing: -0.02em;
          color: #94909F; transition: color .3s ease;
        }
        .cc-sv-tab:hover {
          color: ${TEXT}; background: #FFFFFF;
          box-shadow: inset 0 0 0 1px rgba(22,20,31,0.10), 0 4px 10px -6px rgba(22,20,31,0.45);
        }
        .cc-sv-tab:hover em { color: ${ACCENT_INK}; }
        .cc-sv-tab.is-active {
          color: #FFFFFF; background: ${GLOSS};
          box-shadow: ${ACCENT_RIM}, 0 8px 18px -8px rgba(74,61,191,0.65);
        }
        .cc-sv-tab.is-active em { color: rgba(255,255,255,0.78); }
        .cc-sv-tab:focus-visible { outline: 2px solid ${ACCENT_INK}; outline-offset: 2px; }

        /* the counter under the rail is the label once the tabs collapse to numbers */
        .cc-sv-nav-label {
          margin: 0; display: none; align-items: baseline; gap: 10px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(11px, 0.78vw, 13px); letter-spacing: 2.2px; color: #6E6A7C;
        }
        .cc-sv-nav-label b {
          font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: clamp(15px, 1.05vw, 18px); letter-spacing: -0.02em; color: ${TEXT};
        }
        .cc-sv-nav-label span { color: ${TEXT}; }

        @media (min-width: 1920px) { .cc-sv-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-sv-inner { max-width: 2400px; } }

        /* ── tablet landscape: the object gives ground to the columns ── */
        @media (max-width: 1180px) {
          .cc-sv-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 0.6fr) minmax(0, 0.82fr); }
          .cc-sv-object-p { width: clamp(280px, 40vw, 420px); }
          .cc-sv-row { padding-top: clamp(146px, 16vw, 200px); }
          .cc-sv-cta { left: 34%; }
        }

        /* Below ~1280 the six names stop fitting on one rail, so the tabs fall
           back to their numbers and the counter underneath carries the label. */
        @media (max-width: 1279px) {
          .cc-sv-tab { padding: 0; width: 44px; justify-content: center; gap: 0; }
          .cc-sv-tab span { display: none; }
          .cc-sv-tab em { font-size: 15px; }
          .cc-sv-nav-label { display: inline-flex; }
        }

        /* ── tablet portrait and below: the spread unstacks ──
              The object stops holding a middle column that no longer exists -
              it goes back into the flow at the top, and the heading, arc and
              shot stack under it. ── */
        @media (max-width: 980px) {
          .cc-sv-stage { min-height: 0; }
          .cc-sv-grid { grid-template-columns: minmax(0, 1fr); gap: clamp(26px, 5vw, 44px); }
          .cc-sv-object {
            position: relative; inset: auto;
            display: block; width: clamp(230px, 56vw, 400px);
            margin: 0 auto clamp(4px, 2vw, 20px);
          }
          .cc-sv-object-p { width: 100%; }
          .cc-sv-gap { display: none; }
          .cc-sv-row { margin-top: 0; padding-top: clamp(136px, 21vw, 180px); padding-bottom: 0; }
          .cc-sv-arc { margin-left: clamp(46px, 7vw, 64px); }
          .cc-sv-h2 { max-width: 16ch; }
          .cc-sv-right { justify-content: flex-start; padding-bottom: 0; }
          .cc-sv-shot { aspect-ratio: 16 / 10; }
          .cc-sv-cta {
            position: relative; left: auto; top: auto; transform: none;
            justify-self: center; margin: 0 auto;
          }
          .cc-sv-cta:hover { transform: scale(1.07); }
          .cc-sv-count { position: static; justify-content: flex-end; margin-top: -8px; }
        }

        /* ── phones: the arc gets tighter so it never crowds the note ── */
        @media (max-width: 560px) {
          .cc-sv-row { flex-direction: column; align-items: stretch; gap: clamp(18px, 5vw, 26px); }
          .cc-sv-arc { width: clamp(112px, 34vw, 150px); margin-left: clamp(34px, 12vw, 54px); }
          .cc-sv-note p { max-width: 100%; }
          .cc-sv-shot { aspect-ratio: 4 / 3; }
          .cc-sv-tab { width: 46px; }        /* stays over the 44px touch target */
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-sv-object-float { animation: none; }
          .cc-sv-cta, .cc-sv-tab, .cc-sv-tile { transition: none; }
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
        <div className="cc-sv-stage">
          {/* ── the object: dead centre, passing over the heading ── */}
          <div className="cc-sv-object" aria-hidden>
            <motion.div className="cc-sv-object-p" style={reduce ? undefined : { y: objectY }}>
              <div className="cc-sv-object-float">
                <span className="cc-sv-object-glow" />
                <img
                  src="/images/services/center-phone.webp"
                  alt=""
                  width={1500}
                  height={1266}
                  decoding="async"
                  fetchPriority="low"
                />
              </div>
            </motion.div>
          </div>

          <div className="cc-sv-grid">
            {/* ── left: heading, then the arc and its note ── */}
            <div className="cc-sv-left">
              <div className="cc-sv-head">
                <motion.p className="cc-sv-eyebrow" variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                  What We Handle
                </motion.p>
                <MaskReveal as="h2" className="cc-sv-h2" delay={0.05}>
                  Your whole support desk, <span className="accent">under your brand</span>
                </MaskReveal>
              </div>

              <div className="cc-sv-row">
                <div className="cc-sv-arc" role="group" aria-label="Service tiles">
                  {SERVICES.map((s, i) => {
                    const step = (i - active + SERVICES.length) % SERVICES.length
                    const slot = step < SLOTS.length ? SLOTS[step] : PARKED
                    return (
                      <motion.button
                        key={s.title}
                        type="button"
                        className={`cc-sv-tile${step === 0 ? ' is-front' : ''}`}
                        aria-label={`${s.n} - ${s.title}`}
                        aria-hidden={step >= SLOTS.length}
                        tabIndex={step >= SLOTS.length ? -1 : 0}
                        onClick={() => setActive(i)}
                        initial={false}
                        animate={slot}
                        transition={reduce ? { duration: 0 } : { duration: 0.75, ease: EASE }}
                      >
                        <img src={s.img.tile} alt={s.alt.tile} width={600} height={800} decoding="async" />
                      </motion.button>
                    )
                  })}
                </div>

                <div className="cc-sv-note">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={active} {...swap}>
                      <span className="cc-sv-note-n">{cur.n} / 06 - {cur.tag}</span>
                      <h3>{cur.title}</h3>
                      <p>{cur.lede}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* the middle column is the object's own ground - nothing else lives here */}
            <div className="cc-sv-gap" aria-hidden />

            {/* ── right: the service's shot, captioned ── */}
            <div className="cc-sv-right">
              <AnimatePresence mode="wait" initial={false}>
                <motion.figure key={active} className="cc-sv-shot" {...swap}>
                  <img src={cur.img.shot} alt={cur.alt.shot} width={800} height={1000} decoding="async" />
                  <figcaption className="cc-sv-shot-pill">{cur.tag}</figcaption>
                </motion.figure>
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={active} className="cc-sv-shot-cap" {...swap}>
                  {cur.caption}
                </motion.p>
              </AnimatePresence>
            </div>

          </div>

          <Link className="cc-sv-cta" to="/contact#write" aria-label="Get in touch about our services">
            <ArrowUpRight size={20} strokeWidth={2.2} aria-hidden />
            <span aria-hidden>Get in<br />touch</span>
          </Link>

          <p className="cc-sv-count" aria-live="polite">
            <b>{cur.n}</b> <i>/ 06</i>
          </p>
        </div>

        {/* ── navigation: the six services, under the spread ── */}
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
          <p className="cc-sv-nav-label">
            <b>{cur.n}</b> / 06 <span>{cur.nav}</span>
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
