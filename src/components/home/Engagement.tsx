import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Users, Layers, Gauge } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { MaskReveal } from '../../lib/anim'

const TEXT   = '#2E3A34'
const ACCENT = '#D2704A'
const ACCENT_INK = '#A85434'   /* text-safe on white (5.3:1) - eyebrows, links, small labels */
const CREAM  = '#F6F2EA'
const MUTED  = '#63706A'
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const GLOSS       = 'linear-gradient(168deg, #F09A72 0%, #D2704A 48%, #9C4324 100%)'
const ACCENT_RIM  = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(84,34,16,0.3)'
const ACCENT_CAST = '0 2px 4px rgba(156,67,36,0.34), 0 12px 24px -10px rgba(156,67,36,0.5), 0 30px 54px -26px rgba(156,67,36,0.62)'

type Model = {
  n: string
  tag: string
  name: string
  desc: string
  Icon: LucideIcon
  /* one value per row in ROWS, in order */
  values: string[]
  best: string
  featured?: boolean
}

const ROWS = ['Agents', 'Cover', 'How you pay', 'Ramp time', 'Starts at', 'Notice period']

const MODELS: Model[] = [
  {
    n: '01',
    tag: 'Your brand only',
    name: 'Dedicated Team',
    Icon: Users,
    desc: 'Named agents who work your queue and nothing else.',
    values: [
      'Named, full-time, yours',
      'Your hours, extended on request',
      'Per seat, per month',
      '3 weeks',
      '2 seats',
      '30 days',
    ],
    best: 'Steady, everyday volume',
  },
  {
    n: '02',
    tag: 'Most chosen',
    name: 'Shared Pod',
    Icon: Layers,
    desc: 'A trained pod covering your queue and a few non-competing brands.',
    values: [
      'Trained pod, shared with 2 or 3 brands',
      '24/7, nights and weekends included',
      'Per seat, split across the pod',
      '10 days',
      '1 seat',
      '14 days',
    ],
    best: 'Growing volume on a lean budget',
    featured: true,
  },
  {
    n: '03',
    tag: 'Usage based',
    name: 'Pay Per Resolution',
    Icon: Gauge,
    desc: 'You pay for the tickets we actually close, against a ceiling you set.',
    values: [
      'Pooled agents, pulled in on demand',
      '24/7 through your peaks',
      'Per resolved ticket',
      '7 days',
      'No minimum',
      'Anytime',
    ],
    best: 'Spiky or seasonal demand',
  },
]

export function Engagement() {
  const reduce = useReducedMotion() ?? false
  const [hov, setHov] = useState<number | null>(null)

  /* nothing hovered: the offer we push stays raised */
  const lit = (i: number) => (hov === null ? MODELS[i].featured : hov === i)

  const rise = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { delay: d, duration: 0.8, ease: EASE },
  })

  return (
    <section className="cc-en" id="engagement" aria-label="How we work together">
      <style>{`
        /* the last light section before the footer goes obsidian: it climbs back
           to white in the middle so the ledger sheets have something to sit on,
           then deepens into cream at the seam */
        .cc-en {
          position: relative; isolation: isolate; overflow: hidden;
          background: linear-gradient(180deg, #EFE8DC 0%, #FCFAF6 22%, #FFFFFF 50%, ${CREAM} 88%, #EBE3D5 100%);
          color: ${TEXT};
          padding: clamp(72px, 10vw, 150px) clamp(24px, 4vw, 64px) clamp(72px, 9vw, 140px);
        }
        .cc-en::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(50% 42% at 6% 4%, rgba(210,112,74,0.10), transparent 72%);
        }
        .cc-en-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }
        @media (min-width: 1920px) { .cc-en-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-en-inner { max-width: 2400px; } }

        /* ── masthead ── */
        .cc-en-mast {
          display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr);
          gap: clamp(24px, 4vw, 72px); align-items: end;
          padding-bottom: clamp(24px, 2.8vw, 40px); margin-bottom: clamp(24px, 3vw, 44px);
          border-bottom: 1px solid rgba(26,33,29,0.16);
        }
        .cc-en-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px; color: ${ACCENT_INK};
          margin: 0 0 clamp(14px, 1.8vw, 22px);
        }
        .cc-en-eyebrow i { width: 7px; height: 7px; border-radius: 50%; background: ${ACCENT}; }
        .cc-en-title {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: clamp(34px, 5vw, 80px); line-height: 1.02; letter-spacing: -0.03em;
          margin: 0; max-width: 15ch;
        }
        .cc-en-title .accent { color: ${ACCENT}; }
        .cc-en-lead {
          font-family: 'Inter', sans-serif; font-size: clamp(14px, 1.1vw, 17px); line-height: 1.78;
          color: ${MUTED}; margin: 0; max-width: 40ch;
        }

        /* ── the ledger: a spec sheet, not three price cards ──
           Each column is its own grid that borrows the parent's rows
           (subgrid), so values line up across models while the column
           stays a single hoverable object. */
        .cc-en-ledger {
          display: grid;
          grid-template-columns: minmax(118px, 0.42fr) repeat(3, minmax(0, 1fr));
          grid-template-rows: auto repeat(${ROWS.length}, auto) auto auto;
          column-gap: clamp(8px, 1vw, 18px);
        }
        .cc-en-col {
          display: grid; grid-row: 1 / -1; grid-template-rows: subgrid;
          position: relative; padding: 0 clamp(12px, 1.4vw, 26px);
        }

        /* the sheet of paper that lifts under a column */
        .cc-en-col.model::before {
          content: ''; position: absolute; z-index: -1; inset: -18px -2px -18px -2px;
          border-radius: 16px;
          background: #FFFFFF;
          box-shadow:
            inset 0 0 0 1px rgba(20,20,22,0.07),
            0 1px 3px rgba(20,20,22,0.05),
            0 18px 40px -22px rgba(20,20,22,0.16),
            0 44px 78px -48px rgba(20,20,22,0.20);
          opacity: 0; transform: translateY(6px) scale(0.99);
          transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1);
          will-change: transform, opacity;
        }
        .cc-en-col.model.on::before { opacity: 1; transform: translateY(-8px) scale(1); }
        /* the terracotta edge that draws across the top of the live column */
        .cc-en-col.model::after {
          content: ''; position: absolute; z-index: 0; top: -18px; left: -2px; right: -2px; height: 3px;
          border-radius: 100px;
          background: linear-gradient(90deg, #F09A72, ${ACCENT} 50%, #9C4324);
          transform: scaleX(0) translateY(-8px); transform-origin: left center; opacity: 0;
          transition: transform .7s cubic-bezier(.16,1,.3,1), opacity .4s ease;
          will-change: transform;
        }
        .cc-en-col.model.on::after { transform: scaleX(1) translateY(-8px); opacity: 1; }

        /* cells */
        .cc-en-cell {
          display: flex; flex-direction: column; justify-content: center;
          padding: clamp(13px, 1.15vw, 18px) 0;
          border-bottom: 1px solid rgba(26,33,29,0.12);
          position: relative;
        }
        .cc-en-col.label .cc-en-cell { border-bottom-color: rgba(26,33,29,0.16); }
        .cc-en-cell.head, .cc-en-cell.foot { border-bottom: 0; }

        /* head cell */
        .cc-en-cell.head { padding: clamp(4px, 0.6vw, 10px) 0 clamp(18px, 2vw, 28px); justify-content: flex-end; }
        .cc-en-badge {
          display: grid; place-items: center; width: 46px; height: 46px; border-radius: 13px;
          color: ${ACCENT}; background: rgba(210,112,74,0.12);
          box-shadow: inset 0 0 0 1px rgba(210,112,74,0.3);
          margin-bottom: clamp(14px, 1.4vw, 20px); will-change: transform;
          transition: transform .6s cubic-bezier(.16,1,.3,1), background .45s ease, color .45s ease;
        }
        .cc-en-col.model.on .cc-en-badge {
          transform: translateY(-2px) rotate(-6deg); background: ${GLOSS}; color: #fff;
          box-shadow: ${ACCENT_RIM}, 0 16px 30px -14px rgba(156,67,36,0.9);
        }
        .cc-en-tagrow { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .cc-en-n {
          font-family: Georgia, 'Times New Roman', serif; font-size: clamp(13px, 1vw, 16px);
          color: rgba(26,33,29,0.34); letter-spacing: 0.5px;
        }
        .cc-en-tag {
          display: inline-flex; align-items: center; padding: 6px 12px; border-radius: 100px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(9px, 0.68vw, 11px); letter-spacing: 1.4px; white-space: nowrap;
          border: 1px solid rgba(26,33,29,0.16); color: ${MUTED};
          transition: background .45s ease, color .45s ease, border-color .45s ease;
        }
        .cc-en-col.model.on .cc-en-tag {
          background: ${GLOSS}; border-color: transparent; color: #fff;
          box-shadow: ${ACCENT_RIM}, 0 12px 24px -12px rgba(156,67,36,0.9);
        }
        .cc-en-name {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: clamp(22px, 2vw, 36px); line-height: 1.08; letter-spacing: -0.03em;
          margin: 0 0 10px; color: ${TEXT}; transition: color .45s ease;
        }
        .cc-en-col.model.on .cc-en-name { color: ${ACCENT}; }
        .cc-en-desc {
          font-family: 'Inter', sans-serif; font-size: clamp(13px, 0.98vw, 16px); line-height: 1.65;
          color: ${MUTED}; margin: 0; max-width: 30ch;
        }

        /* row labels */
        .cc-en-k {
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.75vw, 12px); letter-spacing: 1.7px; color: rgba(26,33,29,0.42);
        }
        .cc-en-col.label .cc-en-cell.head .cc-en-k { color: ${ACCENT_INK}; }

        /* values */
        .cc-en-v {
          font-family: 'Inter', sans-serif; font-weight: 600;
          font-size: clamp(14px, 1.05vw, 17px); line-height: 1.55; color: ${TEXT};
          display: flex; align-items: baseline; gap: 10px; will-change: transform;
          transition: transform .6s cubic-bezier(.16,1,.3,1), color .45s ease;
        }
        .cc-en-col.model.on .cc-en-v { transform: translateX(4px); }
        .cc-en-v::before {
          content: ''; flex: none; width: 5px; height: 5px; border-radius: 50%;
          background: rgba(26,33,29,0.22); transform: translateY(-2px);
          transition: background .45s ease, transform .5s cubic-bezier(.34,1.56,.64,1);
          transition-delay: calc(var(--i) * 45ms);
        }
        .cc-en-col.model.on .cc-en-v::before { background: ${ACCENT}; transform: translateY(-2px) scale(1.7); }
        /* the mobile-only key that rides with each value */
        .cc-en-v-k { display: none; }

        /* best-for row */
        .cc-en-cell.best { border-bottom: 0; padding-top: clamp(16px, 1.6vw, 22px); }
        .cc-en-best {
          font-family: Georgia, 'Times New Roman', serif; font-size: clamp(15px, 1.2vw, 20px);
          line-height: 1.4; color: ${TEXT}; margin: 0;
        }
        .cc-en-col.label .cc-en-cell.best .cc-en-k { align-self: flex-start; }

        /* the CTA that sits at the foot of each column */
        .cc-en-cell.foot { padding-top: clamp(18px, 2vw, 26px); }
        .cc-en-cta {
          display: inline-flex; align-items: center; justify-content: space-between; gap: 12px;
          min-height: 52px; padding: 14px 20px; border-radius: 100px; text-decoration: none;
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(13px, 1vw, 15px);
          color: ${TEXT}; border: 1px solid rgba(26,33,29,0.2); background: transparent;
          will-change: transform;
          transition: transform .5s cubic-bezier(.16,1,.3,1), background .4s ease,
                      color .4s ease, border-color .4s ease, box-shadow .4s ease;
        }
        .cc-en-cta svg { transition: transform .5s cubic-bezier(.16,1,.3,1); will-change: transform; }
        .cc-en-col.model.on .cc-en-cta {
          background: ${GLOSS}; border-color: transparent; color: #fff;
          box-shadow: ${ACCENT_RIM}, ${ACCENT_CAST};
        }
        .cc-en-cta:hover { transform: translateY(-2px); }
        .cc-en-cta:hover svg { transform: translateX(4px); }

        /* ── closing line ── */
        .cc-en-foot {
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
          gap: clamp(16px, 2.4vw, 40px);
          margin-top: clamp(40px, 5vw, 76px); padding-top: clamp(26px, 3vw, 40px);
          border-top: 1px solid rgba(26,33,29,0.16);
        }
        .cc-en-foot p {
          font-family: 'Inter', sans-serif; font-size: clamp(15px, 1.15vw, 19px); line-height: 1.7;
          color: ${MUTED}; margin: 0; max-width: 58ch;
        }
        .cc-en-foot p b { color: ${TEXT}; font-weight: 700; }
        .cc-en-btn {
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          min-height: 58px; padding: 17px clamp(30px, 3.2vw, 46px); border-radius: 100px;
          background: ${GLOSS}; color: #fff; text-decoration: none;
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(14px, 1.1vw, 17px);
          box-shadow: ${ACCENT_RIM}, ${ACCENT_CAST};
          transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s ease; will-change: transform;
        }
        .cc-en-btn > * { position: relative; z-index: 1; }
        .cc-en-btn::after {
          content: ''; position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%);
          transform: translateX(-110%); will-change: transform;
          transition: transform .9s cubic-bezier(.16,1,.3,1);
        }
        .cc-en-btn:hover {
          transform: translateY(-3px);
          box-shadow: ${ACCENT_RIM}, 0 16px 28px -10px rgba(156,67,36,0.6), 0 38px 66px -26px rgba(156,67,36,0.75);
        }
        .cc-en-btn:hover::after { transform: translateX(110%); }
        .cc-en-btn svg { transition: transform .45s cubic-bezier(.16,1,.3,1); will-change: transform; }
        .cc-en-btn:hover svg { transform: translateX(4px); }

        /* ── responsive: the ledger becomes three sheets ── */
        @media (max-width: 1100px) {
          .cc-en-mast { grid-template-columns: minmax(0, 1fr); align-items: start; }
          .cc-en-ledger { display: flex; flex-direction: column; gap: clamp(18px, 3vw, 28px); }
          .cc-en-col { display: flex; flex-direction: column; padding: clamp(24px, 3vw, 34px); }
          .cc-en-col.label { display: none; }
          .cc-en-col.model::before {
            inset: 0; opacity: 1; transform: none; background: rgba(255,255,255,0.72);
            box-shadow: inset 0 0 0 1px rgba(26,33,29,0.1);
          }
          .cc-en-col.model.on::before {
            transform: none; background: #FFFDFA;
            box-shadow: 0 40px 80px -40px rgba(26,33,29,0.5), inset 0 0 0 1px rgba(210,112,74,0.3);
          }
          .cc-en-col.model::after { top: 0; left: 0; right: 0; transform: scaleX(0); }
          .cc-en-col.model.on::after { transform: scaleX(1); }
          .cc-en-cell { border-bottom-color: rgba(26,33,29,0.1); }
          .cc-en-cell.head { padding-top: 0; }
          .cc-en-v { flex-direction: column; align-items: flex-start; gap: 6px; }
          .cc-en-v::before { display: none; }
          .cc-en-v-k {
            display: block; font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
            font-size: 10px; letter-spacing: 1.6px; color: rgba(26,33,29,0.42);
          }
          .cc-en-cta { width: 100%; }
        }
        @media (max-width: 600px) {
          .cc-en-btn { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-en-col.model::before, .cc-en-col.model::after, .cc-en-v, .cc-en-v::before,
          .cc-en-badge, .cc-en-cta, .cc-en-btn { transition: none; }
          .cc-en-btn::after { display: none; }
        }
      `}</style>

      <div className="cc-en-inner">
        {/* ── masthead ── */}
        <div className="cc-en-mast">
          <div>
            <motion.p className="cc-en-eyebrow" {...rise(0)}>
              <i aria-hidden /> How We Work Together
            </motion.p>
            <MaskReveal as="h2" className="cc-en-title" delay={0.05}>
              Three ways to put a team on <span className="accent">your queue.</span>
            </MaskReveal>
          </div>
          <motion.p className="cc-en-lead" {...rise(0.12)}>
            No lock-in and no seat minimums you cannot use. Start on the model that fits the volume
            you have today, and move the month your volume changes.
          </motion.p>
        </div>

        {/* ── the ledger ── */}
        <motion.div className="cc-en-ledger" {...rise(0.06)}>
          {/* leading column: what each row is */}
          <div className="cc-en-col label" aria-hidden>
            <div className="cc-en-cell head"><span className="cc-en-k">The models</span></div>
            {ROWS.map((r) => (
              <div className="cc-en-cell" key={r}><span className="cc-en-k">{r}</span></div>
            ))}
            <div className="cc-en-cell best"><span className="cc-en-k">Best for</span></div>
            <div className="cc-en-cell foot" />
          </div>

          {/* one column per model */}
          {MODELS.map((m, i) => (
            <div
              className={`cc-en-col model${lit(i) ? ' on' : ''}`}
              key={m.n}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              onFocus={() => setHov(i)}
              onBlur={() => setHov(null)}
            >
              <div className="cc-en-cell head">
                <span className="cc-en-badge" aria-hidden><m.Icon size={19} strokeWidth={1.9} /></span>
                <span className="cc-en-tagrow">
                  <span className="cc-en-n">{m.n}</span>
                  <span className="cc-en-tag">{m.tag}</span>
                </span>
                <h3 className="cc-en-name">{m.name}</h3>
                <p className="cc-en-desc">{m.desc}</p>
              </div>

              {m.values.map((v, j) => (
                <div className="cc-en-cell" key={ROWS[j]}>
                  <span className="cc-en-v" style={{ ['--i' as string]: j }}>
                    <span className="cc-en-v-k">{ROWS[j]}</span>
                    {v}
                  </span>
                </div>
              ))}

              <div className="cc-en-cell best">
                <p className="cc-en-best">{m.best}</p>
              </div>

              <div className="cc-en-cell foot">
                <Link className="cc-en-cta" to="/contact">
                  Start on this model
                  <ArrowRight size={17} strokeWidth={2.4} aria-hidden />
                </Link>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div className="cc-en-foot" {...rise(0.1)}>
          <p>
            Not sure which one fits? <b>One call is enough for us to tell you straight</b> - we will
            size the team against your real ticket volume, not a guess.
          </p>
          <Link className="cc-en-btn" to="/contact">
            <span>Book a Free Call</span>
            <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
