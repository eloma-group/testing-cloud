import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { MaskReveal, staggerParent, popUp, VIEWPORT } from '../../lib/anim'

const TEXT   = '#2E3A34'
const ACCENT = '#C6866B'
const CREAM  = '#F4F1EB'
const MUTED  = 'rgba(46,58,52,0.6)'
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

type Bubble = { side: 'in' | 'out'; text: string }

const LEFT_CHAT: Bubble[] = [
  { side: 'in',  text: 'Hi, can you help? 👋' },
  { side: 'out', text: 'Of course - happy to help!' },
  { side: 'in',  text: "Where's my order?" },
  { side: 'out', text: 'Out for delivery 📦' },
]

const RIGHT_CHAT: Bubble[] = [
  { side: 'in',  text: 'Still under warranty?' },
  { side: 'out', text: 'Yes, covered ✓' },
  { side: 'out', text: 'Claim opened for you' },
  { side: 'in',  text: 'Thank you! 🙏' },
]

/* line-art hand gripping a phone (hugeicons:hold-phone, CC).
   The phone body path is kept as the device outline; a real chat
   screen is overlaid on top of the screen area. */
function HandOutline() {
  return (
    <svg className="cc-oc-hand" viewBox="0 0 24 24" fill="none" stroke={ACCENT} aria-hidden>
      <path strokeLinecap="round" strokeWidth="0.9" d="M21 20c-.643-1.287-2-2.976-2-4.472c0-1.699.367-3.794-.422-5.373c-.334-.666-.578-1.341-.578-2.1V4.43a.43.43 0 0 0-.429-.43A2.57 2.57 0 0 0 15 6.571M8 18l3.635 2.272c.24.15.446.35.604.586L13 22" />
      <path strokeLinejoin="round" strokeWidth="0.9" d="M5.027 15c.055 1.097.218 1.78.705 2.268C6.464 18 7.642 18 10 18s3.535 0 4.268-.732C15 16.535 15 15.357 15 13V7c0-2.357 0-3.536-.732-4.268C13.535 2 12.357 2 10 2s-3.536 0-4.268.732c-.487.487-.65 1.171-.705 2.268" />
      <path strokeLinecap="round" strokeWidth="0.9" d="M4.25 7.5h1.5a1.25 1.25 0 1 0 0-2.5h-1.5a1.25 1.25 0 1 0 0 2.5Zm0 5h1a1.25 1.25 0 1 1 0 2.5h-1a1.25 1.25 0 1 1 0-2.5a1.25 1.25 0 1 1 0-2.5h2.5a1.25 1.25 0 1 0 0-2.5h-2.5m0 0a1.25 1.25 0 1 0 0 2.5m0 0h1.5a1.25 1.25 0 1 1 0 2.5h-1.5" />
    </svg>
  )
}

function HandPhone({ chat, flip = false }: { chat: Bubble[]; flip?: boolean }) {
  return (
    <div className={`cc-oc-unit${flip ? ' flip' : ''}`}>
      <div className="cc-oc-screen">
        <div className="cc-oc-body">
          {chat.map((b, i) => (
            <span key={i} className={`cc-oc-bubble ${b.side}`}>{b.text}</span>
          ))}
        </div>
      </div>
      <HandOutline />
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
          padding: clamp(64px, 9vw, 140px) clamp(24px, 4vw, 64px) clamp(56px, 8vw, 120px);
          text-align: center;
        }
        .cc-oc::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(46% 40% at 50% 32%, rgba(198,134,107,0.14), transparent 66%);
        }
        .cc-oc-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }
        @media (min-width: 1920px) { .cc-oc-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-oc-inner { max-width: 2400px; } }

        /* ── stage ── */
        .cc-oc-stage {
          position: relative; display: flex; justify-content: center; align-items: flex-start;
          gap: clamp(0px, 3vw, 60px);
          margin-bottom: clamp(28px, 4vw, 60px);
        }

        /* unit = hand + phone, sized to the hand svg (square 24x24 box) */
        .cc-oc-unit {
          --w: clamp(300px, 30vw, 440px);
          position: relative; width: var(--w); height: var(--w);
          /* screen-slot geometry as % of the 24-box */
          --sx: 21%; --sy: 8.5%; --sw: 40.5%; --sh: 66%;
        }
        .cc-oc-unit.left  { transform: rotate(-4deg); }
        .cc-oc-unit.right { transform: rotate(4deg); margin-left: clamp(-40px, -3vw, -10px); }

        .cc-oc-hand {
          position: absolute; inset: 0; width: 100%; height: 100%; z-index: 3;
          pointer-events: none;
          filter: drop-shadow(0 10px 18px rgba(198,134,107,0.22));
        }
        .cc-oc-unit.flip .cc-oc-hand { transform: scaleX(-1); }

        /* the phone screen overlay sitting inside the hand's device outline */
        .cc-oc-screen {
          position: absolute; z-index: 1;
          left: var(--sx); top: var(--sy); width: var(--sw); height: var(--sh);
          border-radius: 14px; overflow: hidden;
          background: linear-gradient(180deg, #FFFFFF, #FBFAF7);
          box-shadow: 0 24px 44px -26px rgba(46,58,52,0.5), inset 0 0 0 1px rgba(46,58,52,0.05);
        }
        .cc-oc-unit.flip .cc-oc-screen { left: auto; right: var(--sx); }

        /* content padded away from the gripping fingers (left grip by default) */
        .cc-oc-body {
          height: 100%; display: flex; flex-direction: column; justify-content: center;
          gap: clamp(5px, 0.7vw, 9px);
          padding: clamp(12px, 1.6vw, 22px) 8% clamp(12px, 1.6vw, 22px) 27%;
        }
        .cc-oc-unit.flip .cc-oc-body { padding: clamp(12px, 1.6vw, 22px) 27% clamp(12px, 1.6vw, 22px) 8%; }
        .cc-oc-bubble {
          max-width: 78%; padding: clamp(5px,0.7vw,9px) clamp(8px,1vw,13px); border-radius: 13px;
          font-family: 'Inter', sans-serif; font-weight: 500;
          font-size: clamp(9px, 0.85vw, 13px); line-height: 1.32; text-align: left;
        }
        .cc-oc-bubble.in  { align-self: flex-start; background: #ECE9E2; color: ${TEXT}; border-bottom-left-radius: 4px; }
        .cc-oc-bubble.out { align-self: flex-end; background: ${ACCENT}; color: #fff; border-bottom-right-radius: 4px; box-shadow: 0 6px 14px -8px rgba(198,134,107,0.8); }

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

        @media (max-width: 760px) {
          .cc-oc-stage { flex-direction: column; align-items: center; gap: 10px; }
          .cc-oc-unit { --w: clamp(280px, 82vw, 380px); }
          .cc-oc-unit.left, .cc-oc-unit.right { transform: none; margin: 0; }
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
          <div className="cc-oc-unit left"><HandPhone chat={LEFT_CHAT} /></div>
          <div className="cc-oc-unit right flip"><HandPhone chat={RIGHT_CHAT} flip /></div>
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
          <motion.a className="cc-oc-btn primary" href="#contact" variants={popUp}>
            Book a Free Call
            <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
          </motion.a>
          <motion.a className="cc-oc-btn ghost" href="#services" variants={popUp}>
            See Our Channels
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
