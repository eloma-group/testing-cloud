import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Phone, MessageCircle, Mail, MessageSquare, Headset, CheckCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { MaskReveal, staggerParent, popUp, VIEWPORT } from '../../lib/anim'

const MotionLink = motion.create(Link)

const TEXT   = '#2E3A34'
const ACCENT = '#C6866B'
const CREAM  = '#F4F1EB'
const MUTED  = 'rgba(46,58,52,0.6)'
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* channel tiles that light up one after another on the left screen */
const CHANNELS: { Icon: LucideIcon; label: string }[] = [
  { Icon: Phone,         label: 'Voice' },
  { Icon: MessageCircle, label: 'Live chat' },
  { Icon: MessageSquare, label: 'WhatsApp and SMS' },
  { Icon: Mail,          label: 'Email' },
]

const WAVE = [0.34, 0.62, 0.9, 0.5, 0.76, 1, 0.44, 0.82, 0.58, 0.96, 0.4, 0.7, 0.52, 0.86]

/* ──────────────────────────────────────────────────────────────
   Two hands reach in from either edge, each holding out a phone.
   The drawings are traced from photographs of a real hand gripping
   a phone (fingers curling over the top edge, thumb underneath),
   so the anatomy is right: line art, one pencil-grey, one ink.
   A live console is laid into the phone's screen, whose rectangle
   was measured off the trace - see SCREEN below. Everything inside
   the screen is sized in container units (cqw/cqh) so it scales
   with the drawing at every breakpoint.
   ────────────────────────────────────────────────────────────── */

/* the phone screen inside the drawing, as a % of the image box */
const SCREEN = { x: 9.86, y: 18.03, w: 54.57, h: 45.86 }

/* left screen: the channel queue, each tile lighting up in turn */
function ChannelsScreen() {
  return (
    <div className="cc-oc-app" aria-hidden>
      <div className="cc-oc-appbar">
        <span className="cc-oc-live"><i /></span>
        <span className="cc-oc-sk" style={{ width: '26%' }} />
        <span className="cc-oc-sk faint" style={{ width: '14%' }} />
        <span className="cc-oc-appbar-dots"><i /><i /><i /></span>
      </div>

      <div className="cc-oc-tiles">
        {CHANNELS.map(({ Icon, label }, i) => (
          <div className="cc-oc-tile" key={label} style={{ ['--i' as string]: i }}>
            <div className="cc-oc-tile-box">
              <Icon className="ic off" strokeWidth={1.8} aria-hidden />
              <Icon className="ic on" strokeWidth={1.8} aria-hidden />
            </div>
            <span className="cc-oc-sk tile-line" />
          </div>
        ))}
      </div>

      <div className="cc-oc-track"><span /></div>
    </div>
  )
}

/* right screen: a call in progress - pulse rings, live waveform, resolved chip */
function VoiceScreen() {
  return (
    <div className="cc-oc-app voice" aria-hidden>
      <div className="cc-oc-orb">
        <span className="ring" /><span className="ring" /><span className="ring" />
        <div className="cc-oc-orb-core">
          <Headset className="ic" strokeWidth={1.7} aria-hidden />
        </div>
      </div>

      <div className="cc-oc-voice-body">
        <div className="cc-oc-appbar plain">
          <span className="cc-oc-sk" style={{ width: '46%' }} />
          <span className="cc-oc-sk faint" style={{ width: '20%' }} />
        </div>

        <div className="cc-oc-wave">
          {WAVE.map((h, i) => (
            <i key={i} style={{ ['--h' as string]: h, ['--d' as string]: `${i * 0.08}s` }} />
          ))}
        </div>

        <div className="cc-oc-chip">
          <CheckCheck className="ic" strokeWidth={2.2} aria-hidden />
          <span className="cc-oc-sk" style={{ width: '58%' }} />
        </div>
      </div>
    </div>
  )
}

function HandPhone({ side, ink }: { side: 'left' | 'right'; ink: boolean }) {
  /* the trace has the arm coming in from the right, so the left-hand
     unit is the mirrored one - and its screen mirrors with it */
  const mirrored = side === 'left'
  const x = mirrored ? 100 - SCREEN.x - SCREEN.w : SCREEN.x
  return (
    <div className={`cc-oc-unit ${side}${ink ? ' ink' : ' grey'}`}>
      <img
        className="cc-oc-hand"
        src={ink ? '/images/hands/hand-ink.png' : '/images/hands/hand-grey.png'}
        alt=""
        width={1602}
        height={1084}
        decoding="async"
      />
      <div
        className="cc-oc-screen"
        style={{ left: `${x}%`, top: `${SCREEN.y}%`, width: `${SCREEN.w}%`, height: `${SCREEN.h}%` }}
      >
        {side === 'left' ? <ChannelsScreen /> : <VoiceScreen />}
      </div>
    </div>
  )
}

export function Omnichannel() {
  const reduce = useReducedMotion() ?? false
  const rise = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { delay: d, duration: 0.7, ease: EASE },
  })

  return (
    <section className="cc-oc" id="channels" aria-label="Omnichannel support">
      <style>{`
        .cc-oc {
          position: relative; isolation: isolate;
          background: radial-gradient(130% 90% at 50% 0%, #ffffff 0%, ${CREAM} 55%, #ECE6DB 100%);
          color: ${TEXT}; overflow: hidden;
          padding: clamp(80px, 11vw, 170px) clamp(24px, 4vw, 64px) clamp(56px, 8vw, 120px);
          text-align: center;
        }
        .cc-oc::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(46% 40% at 50% 32%, rgba(198,134,107,0.14), transparent 66%);
        }
        .cc-oc-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }
        @media (min-width: 1920px) { .cc-oc-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-oc-inner { max-width: 2400px; } }
        .cc-oc-defs { position: absolute; width: 0; height: 0; }

        /* ── stage: the two hands reach in from either edge ── */
        .cc-oc-stage {
          position: relative; display: flex; align-items: center; justify-content: center;
          gap: clamp(0px, 2vw, 40px);
          margin-bottom: clamp(28px, 4vw, 60px);
        }

        /* unit = one traced hand gripping a phone */
        .cc-oc-unit {
          --w: clamp(330px, 44vw, 720px);
          position: relative; width: var(--w); aspect-ratio: 1602 / 1084;
        }
        /* the wrists run off the edges of the section, like the reference */
        .cc-oc-unit.left  { margin-left: clamp(-120px, -6vw, -30px); }
        .cc-oc-unit.right { margin-right: clamp(-120px, -6vw, -30px); }

        .cc-oc-hand {
          position: absolute; inset: 0; z-index: 3;
          width: 100%; height: 100%; display: block; pointer-events: none;
        }
        .cc-oc-unit.left .cc-oc-hand { transform: scaleX(-1); }

        /* the live screen, laid into the phone the hand is holding.
           container-type lets everything inside size off the screen box (cqw/cqh) */
        .cc-oc-screen {
          position: absolute; z-index: 2; overflow: hidden;
          container-type: size;
          background: linear-gradient(180deg, #FFFFFF, #FBFAF7);
          box-shadow: inset 0 0 0 1px rgba(46,58,52,0.06);
        }
        .cc-oc-app {
          height: 100%; display: flex; flex-direction: column;
          gap: 4.5cqh; padding: 6cqh 5cqw;
        }
        .cc-oc-app .ic { width: 100%; height: 100%; display: block; }

        /* skeleton bars - stand in for copy, so the screens stay iconographic */
        .cc-oc-sk {
          height: 2.6cqh; min-height: 3px; border-radius: 100px;
          background: rgba(46,58,52,0.16); display: block;
        }
        .cc-oc-sk.faint { background: rgba(46,58,52,0.09); }

        /* status bar */
        .cc-oc-appbar { display: flex; align-items: center; gap: 3cqw; }
        .cc-oc-appbar.plain { gap: 4cqw; }
        .cc-oc-live {
          position: relative; flex: none; width: 4.4cqw; aspect-ratio: 1; border-radius: 50%;
          background: ${ACCENT};
        }
        .cc-oc-live i {
          position: absolute; inset: 0; border-radius: 50%; border: 1px solid ${ACCENT};
          transform-origin: center; will-change: transform, opacity;
          animation: cc-oc-ping 2.4s cubic-bezier(.16,1,.3,1) infinite;
        }
        @keyframes cc-oc-ping {
          0%        { transform: scale(1);   opacity: 0.6; }
          70%, 100% { transform: scale(2.6); opacity: 0; }
        }
        .cc-oc-appbar-dots { margin-left: auto; display: flex; gap: 1.4cqw; }
        .cc-oc-appbar-dots i {
          width: 1.6cqw; aspect-ratio: 1; border-radius: 50%; background: rgba(46,58,52,0.18);
        }

        /* ── left screen: channel tiles lighting up in sequence ── */
        .cc-oc-tiles {
          flex: 1; display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 3.4cqw; align-content: center;
        }
        .cc-oc-tile {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 4cqh; will-change: transform;
          animation: cc-oc-lift 7.2s cubic-bezier(.16,1,.3,1) infinite;
          animation-delay: calc(var(--i) * 1.8s);
        }
        .cc-oc-tile-box {
          position: relative; width: 100%; aspect-ratio: 1; border-radius: 26%;
          display: grid; place-items: center;
          background: rgba(46,58,52,0.05); box-shadow: inset 0 0 0 1px rgba(46,58,52,0.07);
        }
        .cc-oc-tile-box::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit; opacity: 0;
          background: linear-gradient(160deg, rgba(198,134,107,0.24), rgba(198,134,107,0.10));
          box-shadow: inset 0 0 0 1px rgba(198,134,107,0.42);
          will-change: opacity;
          animation: cc-oc-glow 7.2s cubic-bezier(.16,1,.3,1) infinite;
          animation-delay: calc(var(--i) * 1.8s);
        }
        .cc-oc-tile-box .ic { position: absolute; width: 46%; height: 46%; }
        .cc-oc-tile-box .ic.off { color: rgba(46,58,52,0.42); }
        .cc-oc-tile-box .ic.on {
          color: ${ACCENT}; opacity: 0; will-change: opacity;
          animation: cc-oc-glow 7.2s cubic-bezier(.16,1,.3,1) infinite;
          animation-delay: calc(var(--i) * 1.8s);
        }
        .cc-oc-sk.tile-line { width: 68%; }
        @keyframes cc-oc-lift {
          0%,  2%      { transform: translateY(0) scale(1); }
          8%,  22%     { transform: translateY(-7%) scale(1.06); }
          30%, 100%    { transform: translateY(0) scale(1); }
        }
        @keyframes cc-oc-glow {
          0%,  2%      { opacity: 0; }
          8%,  22%     { opacity: 1; }
          30%, 100%    { opacity: 0; }
        }

        /* the queue bar sweeping under the tiles */
        .cc-oc-track {
          position: relative; height: 2.6cqh; min-height: 3px; border-radius: 100px;
          background: rgba(46,58,52,0.08); overflow: hidden;
        }
        .cc-oc-track span {
          position: absolute; inset: 0; width: 32%; border-radius: 100px;
          background: linear-gradient(90deg, rgba(198,134,107,0.25), ${ACCENT});
          will-change: transform;
          animation: cc-oc-sweep 7.2s cubic-bezier(.65,0,.35,1) infinite;
        }
        @keyframes cc-oc-sweep {
          0%   { transform: translateX(0); }
          100% { transform: translateX(212%); }
        }

        /* ── right screen: a call in progress ── */
        .cc-oc-app.voice { flex-direction: row; align-items: center; gap: 5cqw; }
        .cc-oc-orb {
          position: relative; flex: none; width: 34%; aspect-ratio: 1;
          display: grid; place-items: center;
        }
        .cc-oc-orb .ring {
          position: absolute; inset: 0; border-radius: 50%; border: 1px solid ${ACCENT};
          opacity: 0; transform-origin: center; will-change: transform, opacity;
          animation: cc-oc-ripple 3s linear infinite;
        }
        .cc-oc-orb .ring:nth-child(2) { animation-delay: 1s; }
        .cc-oc-orb .ring:nth-child(3) { animation-delay: 2s; }
        @keyframes cc-oc-ripple {
          0%   { transform: scale(0.58); opacity: 0.55; }
          100% { transform: scale(1.18); opacity: 0; }
        }
        .cc-oc-orb-core {
          position: relative; width: 66%; aspect-ratio: 1; border-radius: 50%;
          display: grid; place-items: center; color: #fff;
          background: linear-gradient(150deg, ${ACCENT}, #b5765c);
          box-shadow: 0 4cqh 6cqh -3cqh rgba(198,134,107,0.75);
          will-change: transform;
          animation: cc-oc-breathe 3s cubic-bezier(.4,0,.6,1) infinite;
        }
        .cc-oc-orb-core .ic { width: 46%; height: 46%; }
        @keyframes cc-oc-breathe {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
        .cc-oc-voice-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6cqh; }

        .cc-oc-wave { display: flex; align-items: center; gap: 1.5cqw; height: 26cqh; }
        .cc-oc-wave i {
          flex: 1; height: 100%; border-radius: 100px; background: ${ACCENT}; opacity: 0.82;
          transform: scaleY(calc(var(--h) * 0.4)); transform-origin: center; will-change: transform;
          animation: cc-oc-bar 1.15s cubic-bezier(.4,0,.6,1) infinite alternate;
          animation-delay: var(--d);
        }
        @keyframes cc-oc-bar {
          from { transform: scaleY(calc(var(--h) * 0.22)); }
          to   { transform: scaleY(var(--h)); }
        }
        .cc-oc-chip {
          display: flex; align-items: center; gap: 2.5cqw;
          padding: 3.2cqh 3.4cqw; border-radius: 100px;
          background: rgba(198,134,107,0.10); box-shadow: inset 0 0 0 1px rgba(198,134,107,0.3);
          will-change: transform, opacity;
          animation: cc-oc-chip-in 7.2s cubic-bezier(.16,1,.3,1) infinite;
        }
        .cc-oc-chip .ic { flex: none; width: 4.6cqw; height: auto; aspect-ratio: 1; color: ${ACCENT}; }
        .cc-oc-chip .cc-oc-sk { background: rgba(198,134,107,0.34); }
        @keyframes cc-oc-chip-in {
          0%, 6%    { transform: translateY(28%); opacity: 0; }
          14%, 88%  { transform: translateY(0);   opacity: 1; }
          96%, 100% { transform: translateY(28%); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-oc-tile, .cc-oc-tile-box::before, .cc-oc-tile-box .ic.on, .cc-oc-track span,
          .cc-oc-orb .ring, .cc-oc-orb-core, .cc-oc-wave i, .cc-oc-chip, .cc-oc-live i {
            animation: none;
          }
          .cc-oc-chip { opacity: 1; transform: none; }
          .cc-oc-tile:first-child .cc-oc-tile-box::before,
          .cc-oc-tile:first-child .cc-oc-tile-box .ic.on { opacity: 1; }
          .cc-oc-wave i { transform: scaleY(var(--h)); }
        }

        /* ── copy ── */
        .cc-oc-eyebrow {
          display: inline-flex; align-items: center; gap: 12px; justify-content: center;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px;
          color: ${ACCENT}; margin: 0 0 clamp(14px, 1.6vw, 20px);
        }
        .cc-oc-eyebrow::before, .cc-oc-eyebrow::after { content: ''; width: clamp(22px, 3vw, 44px); height: 1px; background: ${ACCENT}; opacity: 0.55; }
        .cc-oc-title {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: clamp(34px, 5.4vw, 84px); line-height: 1.02; letter-spacing: -0.03em;
          margin: 0 auto; color: ${TEXT}; max-width: 18ch;
        }
        .cc-oc-title .accent { color: ${ACCENT}; }
        .cc-oc-lead {
          font-family: 'Inter', sans-serif; font-size: clamp(15px, 1.25vw, 19px); line-height: 1.7;
          color: ${MUTED}; max-width: 60ch; margin: clamp(16px, 2vw, 26px) auto 0;
        }
        .cc-oc-cta { display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin-top: clamp(28px, 3.4vw, 44px); }
        .cc-oc-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          min-height: 58px; padding: 17px clamp(30px, 3.2vw, 46px); border-radius: 100px;
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(14px, 1.1vw, 17px);
          text-decoration: none; letter-spacing: 0.2px; cursor: pointer;
          transition: transform .45s cubic-bezier(.16,1,.3,1), background .35s ease, color .35s ease; will-change: transform;
        }
        .cc-oc-btn.primary { background: ${ACCENT}; color: #fff; box-shadow: 0 18px 40px -20px rgba(198,134,107,0.75); }
        .cc-oc-btn.primary:hover { background: #b5765c; transform: translateY(-3px); }
        .cc-oc-btn.ghost { background: transparent; color: ${TEXT}; border: 1.5px solid rgba(46,58,52,0.24); }
        .cc-oc-btn.ghost:hover { background: ${TEXT}; color: ${CREAM}; transform: translateY(-3px); }
        .cc-oc-btn svg { transition: transform .45s cubic-bezier(.16,1,.3,1); will-change: transform; }
        .cc-oc-btn.primary:hover svg { transform: translateX(4px); }

        @media (max-width: 900px) {
          .cc-oc-stage { flex-direction: column; align-items: stretch; gap: clamp(14px, 3vw, 28px); }
          .cc-oc-unit { --w: min(94vw, 520px); }
          .cc-oc-unit.left  { align-self: flex-start; margin-left: clamp(-60px, -10vw, -20px); margin-right: 0; }
          .cc-oc-unit.right { align-self: flex-end;  margin-right: clamp(-60px, -10vw, -20px); margin-left: 0; }
          .cc-oc-btn { min-height: 52px; }
        }
      `}</style>

      <div className="cc-oc-inner">
        <motion.div
          className="cc-oc-stage"
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <HandPhone side="left" ink={false} />
          <HandPhone side="right" ink />
        </motion.div>

        <motion.p className="cc-oc-eyebrow" {...rise(0)}>Omnichannel Support</motion.p>
        <MaskReveal as="h2" className="cc-oc-title" delay={0.05} inView={false}>
          Meet your customers in every <span className="accent">conversation.</span>
        </MaskReveal>
        <motion.p className="cc-oc-lead" {...rise(0.1)}>
          Calls, live chat, WhatsApp, SMS and email - one dedicated team answers on the
          channel your customers already use, with fast, on-brand replies and real actions
          taken on every message.
        </motion.p>

        <motion.div
          className="cc-oc-cta"
          variants={staggerParent(0.1, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <MotionLink className="cc-oc-btn primary" to="/contact" variants={popUp}>
            Book a Free Call
            <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
          </MotionLink>
          <MotionLink className="cc-oc-btn ghost" to="/#services" variants={popUp}>
            See Our Channels
          </MotionLink>
        </motion.div>
      </div>
    </section>
  )
}
