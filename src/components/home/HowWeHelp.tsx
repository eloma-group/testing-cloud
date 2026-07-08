import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { MaskReveal, popUp, staggerParent, VIEWPORT } from '../../lib/anim'

const ACCENT = '#C6866B'
const CREAM  = '#F4F1EB'
const SAGE   = '#48554D' // muted sage-green backdrop for this section
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* Thin, single-stroke line icons in a refined outline style, set inside
   circular medallions on the sage background. */

type Item = { n: string; label: string; desc: string; icon: ReactNode }

const ITEMS: Item[] = [
  {
    n: '01', label: 'Customer Care',
    desc: 'Warm, on-brand help on every call, chat and email.',
    icon: (
      <>
        <path d="M22 52v-4a28 28 0 0 1 56 0v4" />
        <rect x="14" y="50" width="16" height="26" rx="7" />
        <rect x="70" y="50" width="16" height="26" rx="7" />
        <path d="M78 76v4a10 10 0 0 1-10 10H56" />
        <circle cx="50" cy="90" r="4" />
      </>
    ),
  },
  {
    n: '02', label: 'Technical Support',
    desc: 'Tier-1 and tier-2 fixes with tickets closed fast.',
    icon: (
      <>
        <circle cx="50" cy="50" r="15" />
        <circle cx="50" cy="50" r="5" />
        <path d="M50 22v10M50 68v10M22 50h10M68 50h10M31 31l7 7M62 62l7 7M69 31l-7 7M38 62l-7 7" />
      </>
    ),
  },
  {
    n: '03', label: 'Sales & Retention',
    desc: 'Follow-ups and win-backs that grow your revenue.',
    icon: (
      <>
        <circle cx="50" cy="50" r="28" />
        <circle cx="50" cy="50" r="17" />
        <circle cx="50" cy="50" r="6" />
        <path d="M50 50 82 18M74 18h8v8" />
      </>
    ),
  },
  {
    n: '04', label: 'Back Office',
    desc: 'Orders, data and admin handled behind the scenes.',
    icon: (
      <>
        <path d="M32 20h28l16 16v44a4 4 0 0 1-4 4H32a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4Z" />
        <path d="M60 20v16h16" />
        <path d="M40 52h30M40 64h30M40 76h20" />
      </>
    ),
  },
]

export function HowWeHelp() {
  const reduce = useReducedMotion() ?? false
  const rise = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { delay: d, duration: 0.7, ease: EASE },
  })

  return (
    <section className="cc-help" id="how-we-help" aria-label="How we help">
      <style>{`
        .cc-help {
          position: relative; isolation: isolate;
          background: ${SAGE};
          color: ${CREAM};
          padding: clamp(72px, 10vw, 150px) clamp(24px, 4vw, 64px);
          text-align: center; overflow: hidden;
        }
        /* ambient depth: soft glow + fine dot grid */
        .cc-help::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(60% 45% at 50% -6%, rgba(198,134,107,0.2), transparent 60%),
            radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: auto, 24px 24px;
          -webkit-mask-image: radial-gradient(130% 80% at 50% 0%, #000 35%, transparent 78%);
                  mask-image: radial-gradient(130% 80% at 50% 0%, #000 35%, transparent 78%);
        }
        .cc-help-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }

        .cc-help-eyebrow {
          display: inline-flex; align-items: center; gap: 12px; justify-content: center;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px;
          color: ${ACCENT}; margin: 0 0 clamp(18px, 2.2vw, 28px);
        }
        .cc-help-eyebrow::before, .cc-help-eyebrow::after {
          content: ''; width: clamp(22px, 3vw, 44px); height: 1px; background: ${ACCENT}; opacity: 0.55;
        }
        .cc-help-title {
          font-family: 'Poppins', sans-serif; font-weight: 500;
          font-size: clamp(42px, 7vw, 104px); line-height: 1.0; letter-spacing: -0.02em;
          margin: 0 auto; color: ${CREAM};
        }
        .cc-help-title .accent { color: ${ACCENT}; }
        .cc-help-lead {
          font-family: 'Inter', sans-serif; font-size: clamp(15px, 1.2vw, 18px); line-height: 1.7;
          color: rgba(244,241,235,0.66); max-width: 56ch;
          margin: clamp(18px, 2vw, 28px) auto 0;
        }

        .cc-help-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: clamp(30px, 3.6vw, 56px);
          margin: clamp(52px, 7vw, 104px) 0 clamp(48px, 6vw, 96px);
        }
        .cc-help-item { display: flex; flex-direction: column; align-items: center; }

        /* circular medallion */
        .cc-help-medal {
          position: relative; display: grid; place-items: center;
          width: clamp(120px, 12vw, 172px); height: clamp(120px, 12vw, 172px);
          border-radius: 50%;
          border: 1px solid rgba(244,241,235,0.22);
          background: rgba(255,255,255,0.03);
          margin-bottom: clamp(22px, 2.4vw, 34px);
          transition: transform .55s cubic-bezier(.16,1,.3,1), border-color .5s, background .5s, box-shadow .5s;
          will-change: transform;
        }
        .cc-help-medal::before {
          content: ''; position: absolute; inset: -1px; border-radius: 50%;
          border: 1.5px solid ${ACCENT}; opacity: 0;
          transform: scale(0.9); transition: opacity .5s ease, transform .55s cubic-bezier(.16,1,.3,1);
        }
        .cc-help-medal svg { width: 58%; height: 58%; color: ${CREAM}; transition: color .45s ease; }
        .cc-help-num {
          position: absolute; top: -8px; right: -2px;
          font-family: 'Poppins', sans-serif; font-weight: 600; font-size: clamp(12px, 1vw, 15px);
          letter-spacing: 0.5px; color: ${ACCENT};
          background: ${SAGE}; padding: 2px 8px; border-radius: 100px;
          border: 1px solid rgba(198,134,107,0.4);
        }
        @media (hover: hover) {
          .cc-help-item:hover .cc-help-medal {
            transform: translateY(-8px);
            border-color: transparent; background: rgba(198,134,107,0.1);
            box-shadow: 0 24px 44px -26px rgba(0,0,0,0.55);
          }
          .cc-help-item:hover .cc-help-medal::before { opacity: 1; transform: scale(1); }
          .cc-help-item:hover .cc-help-medal svg { color: ${ACCENT}; }
          .cc-help-item:hover .cc-help-label { color: ${ACCENT}; }
        }
        .cc-help-label {
          font-family: 'Poppins', sans-serif; font-weight: 500;
          font-size: clamp(21px, 2.2vw, 34px); line-height: 1.1; letter-spacing: -0.015em;
          color: ${CREAM}; margin-bottom: clamp(8px, 1vw, 14px); transition: color .4s ease;
        }
        .cc-help-desc {
          font-family: 'Inter', sans-serif; font-size: clamp(13px, 1.05vw, 16px); line-height: 1.6;
          color: rgba(244,241,235,0.6); max-width: 26ch;
        }

        .cc-help-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 12px;
          min-height: 54px; padding: 16px clamp(32px, 3.6vw, 52px);
          background: ${ACCENT}; color: #fff; text-decoration: none;
          font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: clamp(12px, 1vw, 14px); letter-spacing: 2.4px;
          border-radius: 4px;
          transition: transform .45s cubic-bezier(.16,1,.3,1), background .4s ease; will-change: transform;
        }
        .cc-help-btn svg { transition: transform .45s cubic-bezier(.16,1,.3,1); will-change: transform; }
        .cc-help-btn:hover { background: #b5765c; transform: translateY(-3px); }
        .cc-help-btn:hover svg { transform: translateX(4px); }

        @media (min-width: 1920px) { .cc-help-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-help-inner { max-width: 2400px; } }

        @media (max-width: 900px) {
          .cc-help-grid { grid-template-columns: repeat(2, 1fr); gap: clamp(40px, 7vw, 60px); }
        }
        @media (max-width: 480px) {
          .cc-help-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cc-help-inner">
        <motion.p className="cc-help-eyebrow" {...rise(0)}>What We Deliver</motion.p>
        <MaskReveal as="h2" className="cc-help-title" delay={0.05}>
          How we <span className="accent">help</span>
        </MaskReveal>
        <motion.p className="cc-help-lead" {...rise(0.1)}>
          Four ways one dedicated team keeps your customers looked after - from the first
          hello to the admin long after the call ends.
        </motion.p>

        <motion.div
          className="cc-help-grid"
          variants={staggerParent(0.12, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          {ITEMS.map((it) => (
            <motion.div className="cc-help-item" key={it.label} variants={popUp}>
              <div className="cc-help-medal">
                <span className="cc-help-num">{it.n}</span>
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={2}
                     strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
                  {it.icon}
                </svg>
              </div>
              <span className="cc-help-label">{it.label}</span>
              <span className="cc-help-desc">{it.desc}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.a className="cc-help-btn" href="#services" {...rise(0.18)}>
          Learn More
          <ArrowRight size={17} strokeWidth={2.4} aria-hidden />
        </motion.a>
      </div>
    </section>
  )
}
