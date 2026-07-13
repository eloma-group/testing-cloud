import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { MaskReveal, popUp, staggerParent, VIEWPORT, EASE } from '../../lib/anim'

const TEXT   = '#2E3A34'
const ACCENT = '#C6866B'
const CREAM  = '#F4F1EB'
const MUTED  = 'rgba(46,58,52,0.6)'

/* ──────────────────────────────────────────────────────────────
   Four rendered 3D icons resting on a lit shelf (3dicons.co, CC0).
   Hover or tap one and its work flies out above it as a stack of
   cut-out cards, while everything else falls back and blurs away.
   ────────────────────────────────────────────────────────────── */

const tilt = (deg: string) => ({ ['--r']: deg }) as CSSProperties

type Item = {
  n: string
  label: string
  short: string
  desc: string
  metric: string        // the number that makes the promise concrete
  glow: string          // spotlight colour behind the icon
  icon: string
  photo: string
  alt: string
  cards: ReactNode      // the cut-out cards that fly out with the photo
}

const ITEMS: Item[] = [
  {
    n: '01', label: 'Customer Care', short: 'customer care',
    desc: 'Warm, on-brand help on every call, chat and email.',
    metric: '18 sec average answer',
    glow: 'rgba(198,86,86,0.28)',
    icon: '/images/icons/headphone.png',
    photo: '/images/help/care.jpg',
    alt: 'Support agent on a call wearing a headset',
    cards: (
      <>
        <div className="cc-hw-card cc-hw-ui" style={tilt('4deg')}>
          <span className="chrome" aria-hidden><i /><i /><i /></span>
          <span className="k">Answered in</span>
          <span className="v">18 sec</span>
          <span className="bars" aria-hidden>
            <i style={{ height: '40%' }} /><i style={{ height: '75%' }} /><i style={{ height: '55%' }} />
            <i style={{ height: '95%' }} /><i style={{ height: '62%' }} /><i style={{ height: '35%' }} />
          </span>
        </div>
        <div className="cc-hw-card cc-hw-chat" style={tilt('-4deg')}>
          <span className="b in">Where is my order?</span>
          <span className="b out">Out for delivery</span>
        </div>
      </>
    ),
  },
  {
    n: '02', label: 'Technical Support', short: 'tech support',
    desc: 'Tier-1 and tier-2 fixes with tickets closed fast.',
    metric: '92% fixed first time',
    glow: 'rgba(74,160,150,0.28)',
    icon: '/images/icons/tool.png',
    photo: '/images/help/tech.jpg',
    alt: 'Technician repairing a laptop at a workbench',
    cards: (
      <>
        <div className="cc-hw-card cc-hw-ui" style={tilt('5deg')}>
          <span className="chrome" aria-hidden><i /><i /><i /></span>
          <span className="k">Ticket #4821</span>
          <span className="v sm">Login failure</span>
          <span className="tag ok">Resolved in 6 min</span>
        </div>
        <div className="cc-hw-card cc-hw-pill" style={tilt('-5deg')}>
          <span className="dot" aria-hidden /> First-fix rate 92%
        </div>
      </>
    ),
  },
  {
    n: '03', label: 'Sales & Retention', short: 'sales',
    desc: 'Follow-ups and win-backs that grow your revenue.',
    metric: '+38% more win-backs',
    glow: 'rgba(214,140,84,0.3)',
    icon: '/images/icons/target.png',
    photo: '/images/help/sales.jpg',
    alt: 'Sales agent on a headset holding a clipboard of leads',
    cards: (
      <>
        <div className="cc-hw-card cc-hw-ui" style={tilt('-5deg')}>
          <span className="chrome" aria-hidden><i /><i /><i /></span>
          <span className="k">Win-backs</span>
          <span className="v">+38%</span>
          <span className="bars up" aria-hidden>
            <i style={{ height: '30%' }} /><i style={{ height: '46%' }} /><i style={{ height: '58%' }} />
            <i style={{ height: '72%' }} /><i style={{ height: '88%' }} /><i style={{ height: '100%' }} />
          </span>
        </div>
        <div className="cc-hw-card cc-hw-pill" style={tilt('5deg')}>
          <span className="dot" aria-hidden /> 12 callbacks booked today
        </div>
      </>
    ),
  },
  {
    n: '04', label: 'Back Office', short: 'back office',
    desc: 'Orders, data and admin handled behind the scenes.',
    metric: 'Zero backlog, daily',
    glow: 'rgba(122,152,124,0.3)',
    icon: '/images/icons/folder.png',
    photo: '/images/help/backoffice.jpg',
    alt: 'Administrator working through order paperwork at a desk',
    cards: (
      <>
        <div className="cc-hw-card cc-hw-list" style={tilt('4deg')}>
          <span className="row"><i className="tick" aria-hidden />Order #10248 processed</span>
          <span className="row"><i className="tick" aria-hidden />CRM records synced</span>
          <span className="row muted"><i className="tick" aria-hidden />Refund logged</span>
        </div>
        <div className="cc-hw-card cc-hw-pill" style={tilt('-6deg')}>
          <span className="dot" aria-hidden /> 0 backlog today
        </div>
      </>
    ),
  },
]

export function HowWeHelp() {
  const reduce = useReducedMotion() ?? false
  const [active, setActive] = useState<number | null>(null)

  const rise = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { delay: d, duration: 0.7, ease: EASE },
  })

  return (
    <section className="cc-hw" id="how-we-help" aria-label="How we help">
      <style>{`
        .cc-hw {
          position: relative; isolation: isolate;
          background: ${CREAM}; color: ${TEXT};
          padding: clamp(64px, 9vw, 140px) clamp(24px, 4vw, 64px);
          text-align: center; overflow: hidden;
        }
        .cc-hw::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(70% 50% at 50% 0%, rgba(139,163,138,0.2), transparent 66%),
            radial-gradient(46% 40% at 4% 96%, rgba(198,134,107,0.14), transparent 70%);
        }
        .cc-hw-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }

        /* ── header ── */
        .cc-hw-eyebrow {
          display: inline-flex; align-items: center; gap: 12px; justify-content: center;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px;
          color: ${ACCENT}; margin: 0 0 clamp(16px, 2vw, 26px);
        }
        .cc-hw-eyebrow::before, .cc-hw-eyebrow::after {
          content: ''; width: clamp(22px, 3vw, 44px); height: 1px; background: ${ACCENT}; opacity: 0.55;
        }
        .cc-hw-title {
          font-family: 'Poppins', sans-serif; font-weight: 500;
          font-size: clamp(42px, 7vw, 104px); line-height: 1.0; letter-spacing: -0.02em;
          margin: 0 auto; color: ${TEXT};
        }
        .cc-hw-title .accent { color: ${ACCENT}; }
        .cc-hw-lead {
          font-family: 'Inter', sans-serif; font-size: clamp(15px, 1.2vw, 18px); line-height: 1.7;
          color: ${MUTED}; max-width: 56ch; margin: clamp(16px, 2vw, 26px) auto clamp(30px, 4vw, 60px);
        }

        /* ── the stage: a lit shelf the icons sit on ── */
        /* overflow stays visible so the cut-out cards can break out of the frame */
        .cc-hw-stage {
          position: relative; text-align: left;
          border-radius: clamp(22px, 2.2vw, 40px);
          background: linear-gradient(170deg, #FFFDFB 0%, #F3F0E9 58%, #EDE9E0 100%);
          box-shadow: 0 60px 120px -70px rgba(46,58,52,0.6), 0 0 0 1px rgba(46,58,52,0.07);
          padding: clamp(18px, 2vw, 34px) clamp(16px, 2vw, 36px) clamp(22px, 2.4vw, 40px);
        }
        /* fine dot grid, faded out toward the bottom */
        .cc-hw-stage::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          border-radius: inherit;
          background-image: radial-gradient(rgba(46,58,52,0.09) 1px, transparent 1px);
          background-size: 26px 26px;
          -webkit-mask-image: linear-gradient(180deg, #000, transparent 72%);
                  mask-image: linear-gradient(180deg, #000, transparent 72%);
        }
        .cc-hw-bar {
          position: relative; z-index: 2;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.72vw, 12px); letter-spacing: 2.2px;
          color: rgba(46,58,52,0.4);
          padding-bottom: clamp(10px, 1.2vw, 16px);
          border-bottom: 1px solid rgba(46,58,52,0.09);
          transition: opacity .45s ease, filter .45s ease;
        }
        /* everything around the open stack recedes */
        .cc-hw-stage.is-open .cc-hw-bar { opacity: 0.22; filter: blur(2px); }
        .cc-hw-bar .live { display: inline-flex; align-items: center; gap: 8px; color: ${ACCENT}; }
        .cc-hw-bar .live i {
          width: 7px; height: 7px; border-radius: 50%; background: ${ACCENT};
          box-shadow: 0 0 0 0 rgba(198,134,107,0.55);
          animation: cc-hw-ping 2.6s cubic-bezier(.16,1,.3,1) infinite;
        }
        @keyframes cc-hw-ping {
          0% { box-shadow: 0 0 0 0 rgba(198,134,107,0.5); }
          70%, 100% { box-shadow: 0 0 0 9px rgba(198,134,107,0); }
        }

        .cc-hw-grid {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: repeat(4, 1fr);
          /* headroom reserved for the pop-out stacks: nothing shifts on hover.
             The stacks break out over the frame edge from here. */
          padding-top: clamp(110px, 11vw, 170px);
        }
        .cc-hw-item {
          position: relative; display: flex; flex-direction: column; align-items: center;
          padding: 0 clamp(6px, 1vw, 18px) clamp(6px, 1vw, 14px);
          transition: opacity .45s ease, filter .45s ease, transform .55s cubic-bezier(.16,1,.3,1);
          will-change: transform;
        }
        /* hairline between the shelves */
        .cc-hw-item + .cc-hw-item::before {
          content: ''; position: absolute; left: 0; top: 8%; bottom: 8%; width: 1px;
          background: linear-gradient(180deg, transparent, rgba(46,58,52,0.14) 30%, rgba(46,58,52,0.14) 70%, transparent);
        }
        .cc-hw-grid.is-open .cc-hw-item:not(.is-active) { opacity: 0.28; filter: blur(3px); transform: scale(0.96); }
        .cc-hw-item.is-active { z-index: 5; }

        /* column spotlight, only under the open item */
        .cc-hw-spot {
          position: absolute; z-index: -1; left: 50%; top: 6%; width: 150%; height: 78%;
          transform: translateX(-50%) scale(0.9); opacity: 0;
          background: radial-gradient(closest-side, var(--glow), transparent 72%);
          transition: opacity .55s ease, transform .7s cubic-bezier(.16,1,.3,1);
          pointer-events: none; will-change: transform;
        }
        .cc-hw-item.is-active .cc-hw-spot { opacity: 1; transform: translateX(-50%) scale(1); }

        /* ghost numeral behind the icon */
        .cc-hw-ghost {
          position: absolute; top: clamp(-6px, 0.4vw, 8px); left: 50%; transform: translateX(-50%);
          font-family: 'Poppins', sans-serif; font-weight: 900; letter-spacing: -0.05em;
          font-size: clamp(64px, 7vw, 120px); line-height: 1;
          color: rgba(46,58,52,0.06); pointer-events: none; user-select: none;
          transition: color .5s ease;
        }
        .cc-hw-item.is-active .cc-hw-ghost { color: rgba(198,134,107,0.16); }

        .cc-hw-trigger {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center; width: 100%;
          background: none; border: 0; cursor: pointer; padding: 2px; color: inherit; font: inherit;
        }
        .cc-hw-trigger:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 6px; border-radius: 18px; }

        /* the rendered 3D icon, floating over its own contact shadow */
        .cc-hw-icon {
          position: relative; display: grid; place-items: end center;
          width: clamp(96px, 10vw, 150px); height: clamp(104px, 11vw, 164px);
        }
        .cc-hw-icon img {
          width: 100%; height: auto; display: block;
          filter: drop-shadow(0 22px 26px rgba(46,58,52,0.28));
          animation: cc-hw-float 6.5s cubic-bezier(.45,0,.55,1) infinite;
          transition: transform .6s cubic-bezier(.16,1,.3,1);
          will-change: transform;
        }
        .cc-hw-item:nth-child(2) .cc-hw-icon img { animation-delay: -1.6s; }
        .cc-hw-item:nth-child(3) .cc-hw-icon img { animation-delay: -3.2s; }
        .cc-hw-item:nth-child(4) .cc-hw-icon img { animation-delay: -4.8s; }
        @keyframes cc-hw-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        .cc-hw-item.is-active .cc-hw-icon img { transform: scale(1.08) translateY(-6px); }

        /* shelf: contact shadow + mirrored reflection */
        .cc-hw-shelf { position: relative; width: 100%; display: grid; place-items: center; }
        .cc-hw-shelf::after {
          content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 62%; height: 14px; border-radius: 50%;
          background: radial-gradient(closest-side, rgba(46,58,52,0.26), transparent);
          transition: width .55s cubic-bezier(.16,1,.3,1), opacity .5s ease;
        }
        .cc-hw-item.is-active .cc-hw-shelf::after { width: 74%; opacity: 0.85; }
        .cc-hw-reflect {
          width: clamp(96px, 10vw, 150px); height: clamp(34px, 3.6vw, 54px);
          object-fit: cover; object-position: top;
          transform: scaleY(-1); opacity: 0.16;
          -webkit-mask-image: linear-gradient(180deg, transparent 30%, #000);
                  mask-image: linear-gradient(180deg, transparent 30%, #000);
          pointer-events: none;
        }

        .cc-hw-line { width: 100%; height: 1px; background: rgba(46,58,52,0.12); margin: clamp(10px, 1.2vw, 16px) 0 clamp(16px, 1.8vw, 26px); }

        .cc-hw-label {
          font-family: 'Poppins', sans-serif; font-weight: 600; text-align: center;
          font-size: clamp(19px, 1.8vw, 30px); line-height: 1.15; letter-spacing: -0.015em;
          color: ${TEXT}; transition: color .4s ease;
        }
        .cc-hw-item.is-active .cc-hw-label { color: ${ACCENT}; }
        .cc-hw-desc {
          font-family: 'Inter', sans-serif; text-align: center;
          font-size: clamp(14px, 1.05vw, 16px); line-height: 1.6;
          color: ${MUTED}; max-width: 24ch; margin-top: clamp(6px, 0.8vw, 10px);
        }
        .cc-hw-metric {
          display: inline-flex; align-items: center; gap: 8px; margin-top: clamp(10px, 1.2vw, 16px);
          font-family: 'Inter', sans-serif; font-weight: 700;
          font-size: clamp(12px, 0.88vw, 14px); letter-spacing: 0.2px; color: rgba(46,58,52,0.75);
          padding: 7px 14px; border-radius: 100px;
          background: rgba(255,255,255,0.75); box-shadow: inset 0 0 0 1px rgba(46,58,52,0.08);
          transition: background .4s ease, box-shadow .4s ease, color .4s ease;
        }
        .cc-hw-metric::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%; background: ${ACCENT}; flex-shrink: 0;
        }
        .cc-hw-item.is-active .cc-hw-metric {
          background: #fff; color: ${TEXT}; box-shadow: 0 12px 26px -16px rgba(46,58,52,0.6);
        }

        /* the pill keeps its space at all times so nothing jumps */
        .cc-hw-view {
          display: inline-flex; align-items: center; gap: 8px;
          margin-top: clamp(12px, 1.4vw, 18px); min-height: 44px; padding: 11px 20px;
          border-radius: 100px; background: ${TEXT}; color: #fff; text-decoration: none;
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(12px, 0.9vw, 14px);
          box-shadow: 0 16px 30px -18px rgba(46,58,52,0.9);
          opacity: 0; transform: translateY(8px); pointer-events: none;
          transition: opacity .4s ease, transform .5s cubic-bezier(.16,1,.3,1), background .3s ease;
          will-change: transform;
        }
        .cc-hw-item.is-active .cc-hw-view { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .cc-hw-view:hover { background: ${ACCENT}; }

        /* ── the pop-out stack ── */
        .cc-hw-pop {
          position: absolute; z-index: 4; pointer-events: none;
          left: 50%; transform: translateX(-50%);
          bottom: calc(100% - clamp(10px, 1.2vw, 20px));
          width: clamp(240px, 24vw, 340px); height: clamp(190px, 19vw, 265px);
        }
        /* the outer stacks open inward so they never leave the stage */
        .cc-hw-item:first-child .cc-hw-pop { left: 0; transform: none; }
        .cc-hw-item:last-child  .cc-hw-pop { left: auto; right: 0; transform: none; }

        .cc-hw-card {
          position: absolute; text-align: left;
          background: #fff; border-radius: 16px;
          box-shadow: 0 26px 50px -24px rgba(46,58,52,0.55), 0 0 0 1px rgba(46,58,52,0.06);
          font-family: 'Inter', sans-serif;
          opacity: 0; transform: translateY(24px) scale(0.9) rotate(var(--r, 0deg));
          transition: opacity .45s ease, transform .7s cubic-bezier(.16,1,.3,1);
          will-change: transform;
        }
        .cc-hw-item.is-active .cc-hw-card { opacity: 1; transform: translateY(0) scale(1) rotate(var(--r, 0deg)); }
        .cc-hw-item.is-active .cc-hw-card:nth-child(2) { transition-delay: .07s; }
        .cc-hw-item.is-active .cc-hw-card:nth-child(3) { transition-delay: .13s; }

        /* photo cut-out */
        .cc-hw-photo {
          left: 0; bottom: 0; width: 45%; aspect-ratio: 3 / 4;
          overflow: hidden; padding: 0; margin: 0;
        }
        .cc-hw-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cc-hw-photo figcaption {
          position: absolute; left: 8px; bottom: 8px;
          font-size: 9px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase;
          color: #fff; background: rgba(28,36,31,0.6); padding: 4px 8px; border-radius: 100px;
        }

        /* stat / ticket card */
        .cc-hw-ui {
          right: 0; top: 10%; width: 63%;
          padding: clamp(10px, 1vw, 14px) clamp(12px, 1.1vw, 16px);
          display: flex; flex-direction: column; gap: 4px;
        }
        .cc-hw-ui .chrome { display: flex; gap: 4px; margin-bottom: 6px; }
        .cc-hw-ui .chrome i { width: 6px; height: 6px; border-radius: 50%; background: rgba(46,58,52,0.14); }
        .cc-hw-ui .k {
          font-weight: 700; text-transform: uppercase; letter-spacing: 1.4px;
          font-size: 10px; color: rgba(46,58,52,0.45);
        }
        .cc-hw-ui .v {
          font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.02em;
          font-size: clamp(19px, 1.7vw, 26px); color: ${TEXT}; line-height: 1.1;
        }
        .cc-hw-ui .v.sm { font-size: clamp(14px, 1.15vw, 17px); }
        .cc-hw-ui .bars { display: flex; align-items: flex-end; gap: 4px; height: 26px; margin-top: 6px; }
        .cc-hw-ui .bars i { flex: 1; border-radius: 3px; background: rgba(46,58,52,0.14); }
        .cc-hw-ui .bars.up i { background: linear-gradient(180deg, ${ACCENT}, rgba(198,134,107,0.3)); }
        .cc-hw-ui .tag {
          align-self: flex-start; margin-top: 8px; padding: 4px 9px; border-radius: 100px;
          font-size: 10px; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase;
        }
        .cc-hw-ui .tag.ok { background: rgba(63,122,114,0.13); color: #3F7A72; }

        /* chat card */
        .cc-hw-chat {
          left: 8%; top: 0; width: 60%;
          padding: 11px; display: flex; flex-direction: column; gap: 6px;
        }
        .cc-hw-chat .b { font-size: 11px; line-height: 1.35; padding: 7px 10px; border-radius: 11px; max-width: 92%; }
        .cc-hw-chat .in  { background: rgba(46,58,52,0.07); color: ${TEXT}; border-bottom-left-radius: 3px; }
        .cc-hw-chat .out { background: ${ACCENT}; color: #fff; align-self: flex-end; border-bottom-right-radius: 3px; }

        /* list card */
        .cc-hw-list {
          right: 0; top: 8%; width: 64%;
          padding: clamp(10px, 1vw, 13px); display: flex; flex-direction: column; gap: 7px;
        }
        .cc-hw-list .row { display: flex; align-items: center; gap: 7px; font-size: 11px; line-height: 1.3; color: ${TEXT}; }
        .cc-hw-list .row.muted { color: rgba(46,58,52,0.45); }
        .cc-hw-list .tick {
          width: 13px; height: 13px; flex-shrink: 0; border-radius: 50%;
          background: rgba(78,107,83,0.16); box-shadow: inset 0 0 0 1.5px rgba(78,107,83,0.5);
        }

        /* floating pill */
        .cc-hw-pill {
          left: 2%; top: 0; display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 14px; border-radius: 100px; white-space: nowrap;
          font-size: 11px; font-weight: 700; color: ${TEXT};
        }
        .cc-hw-pill .dot { width: 7px; height: 7px; border-radius: 50%; background: ${ACCENT}; flex-shrink: 0; }

        /* ── footer CTA ── */
          display: inline-flex; align-items: center; justify-content: center; gap: 12px;
          min-height: 54px; padding: 16px clamp(32px, 3.6vw, 52px);
          background: ${ACCENT}; color: #fff; text-decoration: none;
          font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: clamp(12px, 1vw, 14px); letter-spacing: 2.4px; border-radius: 4px;
          transition: transform .45s cubic-bezier(.16,1,.3,1), background .4s ease; will-change: transform;
        }

        @media (min-width: 1920px) { .cc-hw-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-hw-inner { max-width: 2400px; } }

        /* ── tablet / mobile: 2 x 2 ── */
        @media (max-width: 900px) {
          .cc-hw-grid {
            grid-template-columns: repeat(2, 1fr);
            row-gap: clamp(110px, 26vw, 170px);
            padding-top: clamp(120px, 32vw, 200px);
          }
          .cc-hw-item + .cc-hw-item::before { display: none; }
          .cc-hw-item:nth-child(even)::after {
            content: ''; position: absolute; left: 0; top: 10%; bottom: 10%; width: 1px;
            background: linear-gradient(180deg, transparent, rgba(46,58,52,0.13), transparent);
          }
          .cc-hw-pop { width: min(64vw, 300px); height: min(46vw, 220px); }
          .cc-hw-item:nth-child(odd) .cc-hw-pop  { left: 0; right: auto; transform: none; }
          .cc-hw-item:nth-child(even) .cc-hw-pop { left: auto; right: 0; transform: none; }
        }
        @media (max-width: 560px) {
          .cc-hw-desc { max-width: 22ch; font-size: 14px; }
          .cc-hw-pop { width: 72vw; height: 54vw; }
          .cc-hw-bar { font-size: 10px; letter-spacing: 1.6px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-hw-icon img { animation: none; }
          .cc-hw-bar .live i { animation: none; }
          .cc-hw-grid.is-open .cc-hw-item:not(.is-active) { filter: none; transform: none; }
          .cc-hw-item, .cc-hw-card, .cc-hw-view, .cc-hw-spot { transition-duration: .01ms; }
        }
      `}</style>

      <div className="cc-hw-inner">
        <motion.p className="cc-hw-eyebrow" {...rise(0)}>What We Deliver</motion.p>
        <MaskReveal as="h2" className="cc-hw-title" delay={0.05}>
          How we <span className="accent">help</span>
        </MaskReveal>
        <motion.p className="cc-hw-lead" {...rise(0.1)}>
          Four ways one dedicated team keeps your customers looked after - from the first
          hello to the admin long after the call ends.
        </motion.p>

        <motion.div className={`cc-hw-stage${active !== null ? ' is-open' : ''}`} {...rise(0.16)}>
          <div className="cc-hw-bar">
            <span>Capabilities 01 - 04</span>
            <span className="live"><i aria-hidden />Hover or tap an icon to look inside</span>
          </div>

          <motion.div
            className={`cc-hw-grid${active !== null ? ' is-open' : ''}`}
            variants={staggerParent(0.12, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            onMouseLeave={() => setActive(null)}
          >
            {ITEMS.map((it, i) => (
              <motion.div
                className={`cc-hw-item${active === i ? ' is-active' : ''}`}
                key={it.label}
                variants={popUp}
                style={{ ['--glow']: it.glow } as CSSProperties}
                onMouseEnter={() => setActive(i)}
              >
                <span className="cc-hw-spot" aria-hidden />
                <span className="cc-hw-ghost" aria-hidden>{it.n}</span>

                {/* the cut-out stack that flies out above the icon */}
                <div className="cc-hw-pop" aria-hidden>
                  <figure className="cc-hw-card cc-hw-photo" style={tilt('-7deg')}>
                    <img src={it.photo} alt="" width={700} height={900} loading="lazy" decoding="async" />
                    <figcaption>{it.short}</figcaption>
                  </figure>
                  {it.cards}
                </div>

                <button
                  type="button"
                  className="cc-hw-trigger"
                  aria-expanded={active === i}
                  onClick={() => setActive(active === i ? null : i)}
                  onFocus={() => setActive(i)}
                >
                  <span className="cc-hw-icon">
                    <img src={it.icon} alt="" width={200} height={200} decoding="async" />
                  </span>
                  <span className="cc-hw-shelf">
                    <img className="cc-hw-reflect" src={it.icon} alt="" aria-hidden decoding="async" />
                  </span>
                  <span className="cc-hw-line" aria-hidden />
                  <span className="cc-hw-label">{it.label}</span>
                  <span className="cc-hw-desc">{it.desc}</span>
                  <span className="cc-hw-metric">{it.metric}</span>
                </button>

                <a className="cc-hw-view" href="#services" tabIndex={active === i ? 0 : -1}>
                  View {it.short}
                  <ArrowUpRight size={15} strokeWidth={2.4} aria-hidden />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
