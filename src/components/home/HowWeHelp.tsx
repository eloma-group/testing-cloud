import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import {
  ArrowUpRight, Headset, MessageSquare, Clock, Wrench, Check, Ticket,
  TrendingUp, PhoneCall, Target, ClipboardCheck, Database, X,
} from 'lucide-react'
import { MaskReveal, popUp, staggerParent, VIEWPORT, EASE } from '../../lib/anim'

const TEXT   = '#2E3A34'
const ACCENT = '#D2704A'
const ACCENT_INK = '#A85434'   /* text-safe on white (5.3:1) - eyebrows, links, small labels */
const CREAM  = '#F6F2EA'
const MUTED  = '#63706A'

const GLOSS      = 'linear-gradient(168deg, #F09A72 0%, #D2704A 48%, #9C4324 100%)'
const ACCENT_RIM = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(84,34,16,0.3)'

/* ──────────────────────────────────────────────────────────────
   Four rendered 3D icons resting on a lit shelf (3dicons.co, CC0).
   Hover or tap one and the surface that capability actually runs on flies
   out above it - a phone, a laptop, a monitor, an order sheet - each built
   in CSS, posed in perspective, with its own icons orbiting in front.
   Everything else on the shelf falls back and blurs away.
   ────────────────────────────────────────────────────────────── */

/* Pose one piece of the cluster. Position comes from l/r/t/b/w so the piece
   is anchored in the pop area; the 3D lives in the custom properties, which
   the shared .cc-hw-el transform reads. */
type Pose = {
  l?: string; r?: string; t?: string; b?: string; w?: string
  rx?: number; ry?: number; rz?: number
  z?: number                                   // depth, px
  d?: number                                   // entry delay, s
}
const at = (p: Pose): CSSProperties => ({
  left: p.l, right: p.r, top: p.t, bottom: p.b, width: p.w,
  ['--rx']: `${p.rx ?? 0}deg`,
  ['--ry']: `${p.ry ?? 0}deg`,
  ['--rz']: `${p.rz ?? 0}deg`,
  ['--z']: `${p.z ?? 0}px`,
  ['--d']: `${p.d ?? 0}s`,
} as CSSProperties)

const WAVE = [0.4, 0.85, 0.55, 1, 0.7, 0.45, 0.9, 0.6, 0.35]

type Item = {
  n: string
  label: string
  short: string
  desc: string
  metric: string        // the number that makes the promise concrete
  glow: string          // spotlight colour behind the icon
  icon: string
  mock: ReactNode       // the device cluster that flies out
}

const ITEMS: Item[] = [
  {
    n: '01', label: 'Customer Care', short: 'customer care',
    desc: 'Warm, on-brand help on every call, chat and email.',
    metric: '18 sec average answer',
    glow: 'rgba(198,86,86,0.28)',
    icon: '/images/icons/headphone.png',
    mock: (
      <>
        {/* a phone, mid-call */}
        <div className="cc-hw-el cc-hw-phone" style={at({ l: '34%', b: '0%', w: '31%', rx: 6, ry: 11, rz: -4, z: 20 })}>
          <span className="notch" aria-hidden />
          <span className="scr">
            <span className="av" aria-hidden />
            <b>Incoming call</b>
            <span className="ln dim" style={{ width: '48%' }} />
            <span className="wave" aria-hidden>
              {WAVE.map((h, i) => <i key={i} style={{ height: `${h * 100}%` }} />)}
            </span>
            <span className="acts" aria-hidden>
              <i className="no"><X size={11} strokeWidth={2.6} /></i>
              <i className="yes"><PhoneCall size={11} strokeWidth={2.4} /></i>
            </span>
          </span>
        </div>

        <span className="cc-hw-el cc-hw-ico" style={at({ l: '1%', t: '15%', rx: 4, ry: 14, rz: -8, z: 70, d: 0.1 })}>
          <Headset size={17} strokeWidth={2.2} />
        </span>
        <span className="cc-hw-el cc-hw-ico ghost" style={at({ r: '4%', t: '4%', rx: 4, ry: -13, rz: 7, z: 60, d: 0.16 })}>
          <MessageSquare size={16} strokeWidth={2.1} />
        </span>
        <span className="cc-hw-el cc-hw-ico ghost" style={at({ r: '0%', b: '14%', rx: 3, ry: -15, rz: -5, z: 85, d: 0.22 })}>
          <Clock size={16} strokeWidth={2.1} />
        </span>
      </>
    ),
  },
  {
    n: '02', label: 'Technical Support', short: 'tech support',
    desc: 'Tier-1 and tier-2 fixes with tickets closed fast.',
    metric: '92% fixed first time',
    glow: 'rgba(74,160,150,0.28)',
    icon: '/images/icons/tool.png',
    mock: (
      <>
        {/* a laptop running the ticket queue */}
        <div className="cc-hw-el cc-hw-lap" style={at({ l: '19%', b: '9%', w: '61%', rx: 9, ry: -9, rz: 2, z: 20 })}>
          <span className="lid">
            <span className="scr">
              <span className="chrome" aria-hidden><i /><i /><i /></span>
              <span className="row"><b>Ticket #4821</b><span className="tag">open</span></span>
              <span className="row"><s>Login failure</s><span className="tag ok">fixed</span></span>
              <span className="row"><s>Sync error</s><span className="tag ok">fixed</span></span>
            </span>
          </span>
          <span className="deck" aria-hidden><i /></span>
        </div>

        <span className="cc-hw-el cc-hw-ico" style={at({ l: '0%', t: '10%', rx: 4, ry: 14, rz: -8, z: 75, d: 0.1 })}>
          <Wrench size={16} strokeWidth={2.2} />
        </span>
        <span className="cc-hw-el cc-hw-ico ghost" style={at({ r: '3%', t: '1%', rx: 4, ry: -13, rz: 8, z: 60, d: 0.16 })}>
          <Ticket size={16} strokeWidth={2.1} />
        </span>
        <span className="cc-hw-el cc-hw-ico ghost" style={at({ r: '0%', b: '4%', rx: 3, ry: -15, rz: -6, z: 85, d: 0.22 })}>
          <Check size={17} strokeWidth={3} />
        </span>
      </>
    ),
  },
  {
    n: '03', label: 'Sales & Retention', short: 'sales',
    desc: 'Follow-ups and win-backs that grow your revenue.',
    metric: '+38% more win-backs',
    glow: 'rgba(214,140,84,0.3)',
    icon: '/images/icons/target.png',
    mock: (
      <>
        {/* a monitor on its stand, showing the win-back board */}
        <div className="cc-hw-el cc-hw-mon" style={at({ l: '20%', b: '2%', w: '59%', rx: 8, ry: -9, rz: 2, z: 20 })}>
          <span className="bez">
            <span className="scr">
              <span className="kk">Win-backs</span>
              <span className="big">+38%</span>
              <span className="bars" aria-hidden>
                <i style={{ height: '28%' }} /><i style={{ height: '42%' }} /><i style={{ height: '54%' }} />
                <i className="on" style={{ height: '70%' }} />
                <i className="on" style={{ height: '86%' }} />
                <i className="on" style={{ height: '100%' }} />
              </span>
            </span>
          </span>
          <span className="neck" aria-hidden />
          <span className="foot" aria-hidden />
        </div>

        <span className="cc-hw-el cc-hw-ico" style={at({ l: '0%', b: '6%', rx: 4, ry: 14, rz: -8, z: 75, d: 0.1 })}>
          <TrendingUp size={17} strokeWidth={2.3} />
        </span>
        <span className="cc-hw-el cc-hw-ico ghost" style={at({ l: '2%', t: '2%', rx: 4, ry: 13, rz: 6, z: 60, d: 0.16 })}>
          <PhoneCall size={16} strokeWidth={2.1} />
        </span>
        <span className="cc-hw-el cc-hw-ico ghost" style={at({ r: '0%', t: '8%', rx: 3, ry: -14, rz: -5, z: 85, d: 0.22 })}>
          <Target size={16} strokeWidth={2.1} />
        </span>
      </>
    ),
  },
  {
    n: '04', label: 'Back Office', short: 'back office',
    desc: 'Orders, data and admin handled behind the scenes.',
    metric: 'Zero backlog, daily',
    glow: 'rgba(122,152,124,0.3)',
    icon: '/images/icons/folder.png',
    mock: (
      <>
        {/* the order sheet, worked and stamped */}
        <div className="cc-hw-el cc-hw-doc" style={at({ l: '28%', b: '2%', w: '45%', rx: 7, ry: 10, rz: -3, z: 20 })}>
          <span className="head"><b>Order #10248</b></span>
          <span className="body">
            <span className="row"><i className="tick"><Check size={8} strokeWidth={4} /></i><span className="ln" style={{ width: '66%' }} /></span>
            <span className="row"><i className="tick"><Check size={8} strokeWidth={4} /></i><span className="ln dim" style={{ width: '48%' }} /></span>
            <span className="row"><i className="tick"><Check size={8} strokeWidth={4} /></i><span className="ln dim" style={{ width: '58%' }} /></span>
            <span className="stamp">Cleared</span>
          </span>
        </div>

        <span className="cc-hw-el cc-hw-ico" style={at({ r: '0%', t: '8%', rx: 4, ry: -14, rz: 7, z: 75, d: 0.1 })}>
          <ClipboardCheck size={17} strokeWidth={2.2} />
        </span>
        <span className="cc-hw-el cc-hw-ico ghost" style={at({ l: '0%', t: '1%', rx: 4, ry: 13, rz: -7, z: 60, d: 0.16 })}>
          <Database size={16} strokeWidth={2.1} />
        </span>
        <span className="cc-hw-el cc-hw-ico ghost" style={at({ l: '2%', b: '10%', rx: 3, ry: 15, rz: 5, z: 85, d: 0.22 })}>
          <Check size={17} strokeWidth={3} />
        </span>
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
        /* runs the other way: cream at the head, opening out to white, so the
           shelf below sits on the brightest part of the page */
        .cc-hw {
          position: relative; isolation: isolate;
          background: linear-gradient(180deg, ${CREAM} 0%, #FCFAF6 38%, #FFFFFF 100%);
          color: ${TEXT};
          padding: clamp(64px, 9vw, 140px) clamp(24px, 4vw, 64px);
          text-align: center; overflow: hidden;
        }
        .cc-hw::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(50% 42% at 6% 96%, rgba(210,112,74,0.10), transparent 70%);
        }
        .cc-hw-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }

        /* ── header ── */
        .cc-hw-eyebrow {
          display: inline-flex; align-items: center; gap: 12px; justify-content: center;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px;
          color: ${ACCENT_INK}; margin: 0 0 clamp(16px, 2vw, 26px);
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
          background: linear-gradient(170deg, #FFFFFF 0%, #FDFBF8 52%, #F7F3EC 100%);
          box-shadow:
            inset 0 0 0 1px rgba(20,20,22,0.07),
            0 1px 3px rgba(20,20,22,0.05),
            0 18px 40px -22px rgba(20,20,22,0.16),
            0 48px 88px -52px rgba(20,20,22,0.20);
          padding: clamp(18px, 2vw, 34px) clamp(16px, 2vw, 36px) clamp(22px, 2.4vw, 40px);
        }
        /* the sheen that runs across the top of the shelf - painted over the
           dot grid but under the content, which all sits at z-index 1 and up */
        .cc-hw-stage::after {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          border-radius: inherit;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.95) 0%,
            rgba(255,255,255,0.32) 3%,
            rgba(255,255,255,0.06) 9%,
            rgba(255,255,255,0) 16%
          );
        }
        /* fine dot grid, faded out toward the bottom */
        .cc-hw-stage::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          border-radius: inherit;
          background-image: radial-gradient(rgba(26,33,29,0.09) 1px, transparent 1px);
          background-size: 26px 26px;
          -webkit-mask-image: linear-gradient(180deg, #000, transparent 72%);
                  mask-image: linear-gradient(180deg, #000, transparent 72%);
        }
        .cc-hw-bar {
          position: relative; z-index: 2;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.72vw, 12px); letter-spacing: 2.2px;
          color: rgba(26,33,29,0.4);
          padding-bottom: clamp(10px, 1.2vw, 16px);
          border-bottom: 1px solid rgba(26,33,29,0.09);
          transition: opacity .45s ease, filter .45s ease;
        }
        /* everything around the open stack recedes */
        .cc-hw-stage.is-open .cc-hw-bar { opacity: 0.22; filter: blur(2px); }
        .cc-hw-bar .live { display: inline-flex; align-items: center; gap: 8px; color: ${ACCENT_INK}; }
        .cc-hw-bar .live i {
          width: 7px; height: 7px; border-radius: 50%; background: ${ACCENT};
          box-shadow: 0 0 0 0 rgba(210,112,74,0.55);
          animation: cc-hw-ping 2.6s cubic-bezier(.16,1,.3,1) infinite;
        }
        @keyframes cc-hw-ping {
          0% { box-shadow: 0 0 0 0 rgba(210,112,74,0.5); }
          70%, 100% { box-shadow: 0 0 0 9px rgba(210,112,74,0); }
        }

        .cc-hw-grid {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: repeat(4, 1fr);
          /* headroom reserved for the device clusters: nothing shifts on hover.
             They break out over the frame edge from here. */
          padding-top: clamp(150px, 16vw, 240px);
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
          background: linear-gradient(180deg, transparent, rgba(26,33,29,0.14) 30%, rgba(26,33,29,0.14) 70%, transparent);
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
          color: rgba(26,33,29,0.06); pointer-events: none; user-select: none;
          transition: color .5s ease;
        }
        .cc-hw-item.is-active .cc-hw-ghost { color: rgba(210,112,74,0.16); }

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
          filter: drop-shadow(0 22px 26px rgba(26,33,29,0.28));
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
          background: radial-gradient(closest-side, rgba(26,33,29,0.26), transparent);
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

        .cc-hw-line { width: 100%; height: 1px; background: rgba(26,33,29,0.12); margin: clamp(10px, 1.2vw, 16px) 0 clamp(16px, 1.8vw, 26px); }

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
          font-size: clamp(12px, 0.88vw, 14px); letter-spacing: 0.2px; color: ${TEXT};
          padding: 7px 14px; border-radius: 100px;
          background: linear-gradient(168deg, rgba(255,255,255,0.95), rgba(255,255,255,0.62));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            inset 0 0 0 1px rgba(26,33,29,0.08),
            0 6px 14px -10px rgba(26,33,29,0.5);
          transition: background .4s ease, box-shadow .4s ease, color .4s ease;
        }
        .cc-hw-metric::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
          background: radial-gradient(circle at 32% 28%, #F5BB9C, ${ACCENT} 60%, #9C4324);
        }
        .cc-hw-item.is-active .cc-hw-metric {
          background: linear-gradient(168deg, #FFFFFF, #F7F5F0);
          color: ${TEXT};
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            inset 0 0 0 1px rgba(26,33,29,0.06),
            0 14px 28px -14px rgba(26,33,29,0.55);
        }

        /* the pill keeps its space at all times so nothing jumps */
        .cc-hw-view {
          display: inline-flex; align-items: center; gap: 8px;
          margin-top: clamp(12px, 1.4vw, 18px); min-height: 44px; padding: 11px 20px;
          border-radius: 100px; color: #fff; text-decoration: none;
          background: linear-gradient(168deg, #38423B 0%, #262F29 55%, #1A211D 100%);
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(12px, 0.9vw, 14px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 0 -1px 0 rgba(0,0,0,0.4),
            0 2px 4px rgba(26,33,29,0.3),
            0 16px 30px -16px rgba(26,33,29,0.85);
          opacity: 0; transform: translateY(8px); pointer-events: none;
          transition: opacity .4s ease, transform .5s cubic-bezier(.16,1,.3,1),
                      background .3s ease, box-shadow .3s ease;
          will-change: transform;
        }
        .cc-hw-item.is-active .cc-hw-view { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .cc-hw-view:hover {
          background: ${GLOSS};
          box-shadow: ${ACCENT_RIM}, 0 18px 34px -16px rgba(156,67,36,0.8);
        }

        /* ── the device cluster that flies out ── */
        .cc-hw-pop {
          position: absolute; z-index: 4; pointer-events: none;
          left: 50%; transform: translateX(-50%);
          bottom: calc(100% - clamp(10px, 1.2vw, 20px));
          width: clamp(300px, 29vw, 430px); height: clamp(240px, 23vw, 330px);
          perspective: 1100px;
        }
        /* the outer clusters open inward so they never leave the stage */
        .cc-hw-item:first-child .cc-hw-pop { left: 0; transform: none; }
        .cc-hw-item:last-child  .cc-hw-pop { left: auto; right: 0; transform: none; }
        .cc-hw-3d { position: absolute; inset: 0; transform-style: preserve-3d; }

        /* One transform for every piece. The entry offset is applied first, in the
           parent's space, so pieces slide straight up rather than along their own
           tilted axis. Only transform and opacity ever change. */
        .cc-hw-el {
          position: absolute;
          transform:
            translateY(var(--in, 44px))
            translateZ(var(--z, 0px))
            rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) rotateZ(var(--rz, 0deg))
            scale(var(--s, 0.88));
          opacity: 0;
          transition: opacity .45s ease, transform .75s cubic-bezier(.16,1,.3,1);
          will-change: transform, opacity;
        }
        .cc-hw-item.is-active .cc-hw-el {
          --in: 0px; --s: 1; opacity: 1;
          transition-delay: var(--d, 0s);       /* stagger on the way in, not out */
        }

        /* An all-light device on a cream stage has no silhouette - it dissolves
           into the shelf. So every device is an INK shell around a LIGHT screen:
           the dark frame draws the shape, the bright screen carries the content.
           That is also why each one is a different object - phone, laptop,
           monitor, order sheet - rather than four variations of a rounded box. */
        /* the ink shells */
        .cc-hw-phone,
        .cc-hw-lap .lid,
        .cc-hw-mon .bez {
          background: linear-gradient(168deg, #3E4941 0%, #262F29 52%, #161C19 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.22),
            inset 0 -1px 0 rgba(0,0,0,0.5),
            inset 0 0 0 1px rgba(255,255,255,0.08),
            0 3px 8px rgba(26,33,29,0.34),
            0 30px 56px -24px rgba(26,33,29,0.7);
        }
        /* the bright screens inside them */
        .cc-hw-phone .scr,
        .cc-hw-lap .scr,
        .cc-hw-mon .scr {
          background: linear-gradient(168deg, #FFFFFF 0%, #F5F2EB 100%);
          box-shadow: inset 0 0 0 1px rgba(26,33,29,0.1), inset 0 2px 5px rgba(26,33,29,0.08);
        }

        /* 01 - the phone */
        .cc-hw-phone { aspect-ratio: 1 / 2; border-radius: 20px; padding: 5px; }
        .cc-hw-phone .notch {
          position: absolute; top: 10px; left: 50%; transform: translateX(-50%); z-index: 2;
          width: 26%; height: 4px; border-radius: 100px; background: rgba(0,0,0,0.5);
        }
        .cc-hw-phone .scr {
          position: relative; height: 100%; border-radius: 16px; overflow: hidden;
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 19px 9px 9px;
        }
        .cc-hw-phone .av {
          width: 32px; height: 32px; border-radius: 50%; flex: none; margin-bottom: 3px;
          background: radial-gradient(circle at 34% 28%, #F5BB9C, ${ACCENT} 58%, #9C4324);
          box-shadow: inset 0 -1px 2px rgba(84,34,16,0.5), 0 0 0 4px rgba(210,112,74,0.16);
        }
        .cc-hw-phone .wave { display: flex; align-items: center; gap: 2px; height: 20px; width: 100%; margin-top: auto; }
        .cc-hw-phone .wave i { flex: 1; border-radius: 100px; background: rgba(210,112,74,0.8); }
        .cc-hw-phone .acts { display: flex; gap: 10px; justify-content: center; margin-top: 8px; }
        .cc-hw-phone .acts i { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; }
        .cc-hw-phone .acts i.yes { background: ${GLOSS}; color: #fff; box-shadow: ${ACCENT_RIM}; }
        .cc-hw-phone .acts i.no {
          background: linear-gradient(168deg, #FFFFFF, #E4E0D6); color: rgba(26,33,29,0.55);
          box-shadow: inset 0 0 0 1px rgba(26,33,29,0.14);
        }

        /* 02 - the laptop. The deck being wider than the lid is the whole tell. */
        .cc-hw-lap { display: flex; flex-direction: column; align-items: center; }
        .cc-hw-lap .lid { width: 100%; border-radius: 10px 10px 3px 3px; padding: 7px 7px 8px; }
        .cc-hw-lap .scr {
          display: flex; flex-direction: column; gap: 5px;
          border-radius: 5px; padding: 9px 10px 10px; text-align: left;
        }
        .cc-hw-lap .deck {
          position: relative; width: 114%; height: 10px; border-radius: 2px 2px 8px 8px;
          background: linear-gradient(180deg, #47524A 0%, #232C27 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.24),
            inset 0 0 0 1px rgba(255,255,255,0.07),
            0 8px 16px -8px rgba(26,33,29,0.6);
        }
        .cc-hw-lap .deck i {
          position: absolute; left: 50%; top: 2px; transform: translateX(-50%);
          width: 20%; height: 3px; border-radius: 100px; background: rgba(0,0,0,0.4);
        }

        /* 03 - the monitor on its stand */
        .cc-hw-mon { display: flex; flex-direction: column; align-items: center; }
        .cc-hw-mon .bez { width: 100%; border-radius: 10px; padding: 8px 8px 14px; }
        .cc-hw-mon .scr {
          display: flex; flex-direction: column; gap: 1px;
          border-radius: 5px; padding: 10px 11px 11px; text-align: left;
        }
        .cc-hw-mon .neck {
          width: 16%; height: 14px;
          background: linear-gradient(90deg, #232C27, #3E4941 50%, #232C27);
          box-shadow: 0 4px 10px -4px rgba(26,33,29,0.6);
        }
        .cc-hw-mon .foot {
          width: 42%; height: 6px; border-radius: 3px;
          background: linear-gradient(180deg, #47524A, #1D2521);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.2),
            0 10px 20px -8px rgba(26,33,29,0.65);
        }

        /* 04 - the order sheet. Paper, so it stays light - but the ink header
           strip gives it the edge the others get from their shells. */
        .cc-hw-doc {
          aspect-ratio: 3 / 3.7; border-radius: 10px; overflow: hidden;
          display: flex; flex-direction: column;
          background: linear-gradient(168deg, #FFFFFF 0%, #F7F5EF 60%, #EDE9E0 100%);
          box-shadow:
            inset 0 0 0 1px rgba(26,33,29,0.12),
            0 3px 8px rgba(26,33,29,0.2),
            0 28px 52px -22px rgba(26,33,29,0.6);
        }
        .cc-hw-doc .head {
          flex: none; padding: 9px 11px;
          background: linear-gradient(168deg, #3E4941, #232C27);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.16);
        }
        .cc-hw-doc .head b {
          font-family: 'Inter', sans-serif; font-weight: 800;
          font-size: 10px; letter-spacing: 0.6px; color: ${CREAM};
        }
        .cc-hw-doc .body {
          flex: 1; display: flex; flex-direction: column; gap: 8px;
          padding: 11px; text-align: left;
        }
        .cc-hw-doc .tick {
          width: 14px; height: 14px; flex: none; border-radius: 50%;
          display: grid; place-items: center;
          background: rgba(94,140,110,0.18); color: #4C7C5F;
          box-shadow: inset 0 0 0 1px rgba(94,140,110,0.45);
        }
        /* the stamp lands over the sheet, slightly off-square, like a real one */
        .cc-hw-doc .stamp {
          align-self: flex-end; margin-top: auto; transform: rotate(-7deg);
          padding: 4px 10px; border-radius: 4px;
          font-family: 'Inter', sans-serif; font-weight: 900; text-transform: uppercase;
          font-size: 9px; letter-spacing: 1.6px; color: ${ACCENT_INK};
          box-shadow: inset 0 0 0 2px rgba(210,112,74,0.55);
        }

        /* the icons orbiting the device */
        .cc-hw-ico {
          width: clamp(36px, 3.5vw, 48px); aspect-ratio: 1; border-radius: 13px;
          display: grid; place-items: center; color: #fff;
          background: ${GLOSS};
          box-shadow: ${ACCENT_RIM},
            0 2px 5px rgba(156,67,36,0.35),
            0 16px 28px -12px rgba(156,67,36,0.6);
        }
        .cc-hw-ico.ghost {
          color: ${TEXT};
          background: linear-gradient(168deg, #FFFFFF 0%, #FAF8F4 50%, #EAE5DA 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            inset 0 0 0 1px rgba(26,33,29,0.12),
            0 1px 3px rgba(20,20,22,0.06),
            0 16px 28px -12px rgba(26,33,29,0.55);
        }

        /* shared screen furniture */
        .cc-hw-pop .chrome { display: flex; gap: 4px; margin-bottom: 2px; }
        .cc-hw-pop .chrome i { width: 5px; height: 5px; border-radius: 50%; background: rgba(26,33,29,0.18); }
        .cc-hw-pop .chrome i:first-child { background: rgba(210,112,74,0.85); }
        .cc-hw-pop .ln { display: block; height: 5px; border-radius: 100px; background: rgba(26,33,29,0.26); }
        .cc-hw-pop .ln.dim { background: rgba(26,33,29,0.14); }
        .cc-hw-pop .row { display: flex; align-items: center; gap: 7px; }
        .cc-hw-pop .row b, .cc-hw-pop .row s {
          font-family: 'Inter', sans-serif; font-size: 10px; line-height: 1.3;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cc-hw-pop .row b { font-weight: 700; color: ${TEXT}; }
        .cc-hw-pop .row s { font-weight: 500; color: rgba(26,33,29,0.42); text-decoration: none; }
        .cc-hw-pop .tag {
          margin-left: auto; flex: none; padding: 3px 6px; border-radius: 100px;
          font-family: 'Inter', sans-serif;
          font-size: 8px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase;
          background: rgba(210,112,74,0.2); color: #A85434;
        }
        .cc-hw-pop .tag.ok { background: rgba(94,140,110,0.18); color: #4C7C5F; }
        .cc-hw-pop b.big, .cc-hw-pop .big {
          font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.02em;
          font-size: 26px; line-height: 1.15; color: ${TEXT};
        }
        .cc-hw-pop .kk {
          font-family: 'Inter', sans-serif;
          font-size: 9px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase;
          color: rgba(26,33,29,0.42);
        }
        .cc-hw-phone .scr b {
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: 10px; color: ${TEXT};
        }
        .cc-hw-pop .bars { display: flex; align-items: flex-end; gap: 4px; height: 38px; margin-top: 5px; }
        .cc-hw-pop .bars i { flex: 1; border-radius: 3px 3px 2px 2px; background: rgba(26,33,29,0.14); }
        .cc-hw-pop .bars i.on { background: linear-gradient(180deg, #F09A72, ${ACCENT}); }

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
            background: linear-gradient(180deg, transparent, rgba(26,33,29,0.13), transparent);
          }
          .cc-hw-pop { width: min(72vw, 330px); height: min(54vw, 250px); }
          .cc-hw-item:nth-child(odd) .cc-hw-pop  { left: 0; right: auto; transform: none; }
          .cc-hw-item:nth-child(even) .cc-hw-pop { left: auto; right: 0; transform: none; }
        }
        @media (max-width: 560px) {
          .cc-hw-desc { max-width: 22ch; font-size: 14px; }
          .cc-hw-pop { width: 82vw; height: 62vw; }
          .cc-hw-bar { font-size: 10px; letter-spacing: 1.6px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-hw-icon img { animation: none; }
          .cc-hw-bar .live i { animation: none; }
          .cc-hw-grid.is-open .cc-hw-item:not(.is-active) { filter: none; transform: none; }
          .cc-hw-item, .cc-hw-el, .cc-hw-view, .cc-hw-spot { transition-duration: .01ms; }
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

                {/* the device cluster that flies out above the icon */}
                <div className="cc-hw-pop" aria-hidden>
                  <div className="cc-hw-3d">{it.mock}</div>
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
