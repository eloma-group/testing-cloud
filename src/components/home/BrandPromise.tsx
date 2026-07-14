import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { EASE, VIEWPORT, fadeUp } from '../../lib/anim'

const INK    = '#14111F'      // the obsidian the hero and the footer are cut from
const ACCENT = '#998EFF'
const ACCENT_HI = '#C3BCFF'

const GLOSS       = 'linear-gradient(168deg, #C3BCFF 0%, #998EFF 48%, #4A3DBF 100%)'
const ACCENT_RIM  = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(40,32,100,0.3)'
const ACCENT_CAST = '0 2px 4px rgba(74,61,191,0.34), 0 14px 28px -10px rgba(74,61,191,0.55), 0 34px 60px -28px rgba(74,61,191,0.66)'

/* ──────────────────────────────────────────────────────────────
   The one dark moment on the page, and the one section with no
   photograph in it. Everything above and below is white, image-led
   and busy; this is obsidian, and the promise is carried by type
   alone - the statement is the design, not a caption under a picture.

   It reads line by line as you arrive, the proof counts itself up on
   a hairline rail underneath, and the only bright thing in the whole
   slab is the button.
   ────────────────────────────────────────────────────────────── */

type Word = { t: string; on?: boolean }

/* Set by hand, line by line: the break points are the rhythm of the promise,
   so they are not left to the browser to decide. */
const LINES: Word[][] = [
  [{ t: 'Your customers never' }],
  [{ t: 'feel handed off. They' }],
  [{ t: 'are talking to' }, { t: 'your team', on: true }],
  [{ t: '- because they are.' }],
]

type Stat = { to: number; pre?: string; suf: string; label: string }

const STATS: Stat[] = [
  { to: 18, suf: 'sec', label: 'Average answer' },
  { to: 92, suf: '%',   label: 'Fixed first time' },
  { to: 24, suf: '/7',  label: 'Cover, no gaps' },
  { to: 7,  suf: 'days', label: 'To add trained agents' },
]

/* A figure that counts itself up the first time it is seen. The value lives in
   a motion value, so the tick never re-renders React. */
function Figure({ stat, i }: { stat: Stat; i: number }) {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '-80px' })

  const count = useMotionValue(reduce ? stat.to : 0)
  const shown = useTransform(count, v => Math.round(v).toString())

  useEffect(() => {
    if (!seen || reduce) return
    const run = animate(count, stat.to, { duration: 1.5, delay: 0.1 + i * 0.12, ease: EASE })
    return () => run.stop()
  }, [seen, reduce, count, stat.to, i])

  return (
    <div className="cc-bp-stat" ref={ref}>
      <p className="cc-bp-fig">
        <motion.span>{shown}</motion.span>
        <i>{stat.suf}</i>
      </p>
      <p className="cc-bp-lab">{stat.label}</p>
    </div>
  )
}

export function BrandPromise() {
  const reduce = useReducedMotion() ?? false

  return (
    <section className="cc-bp" id="brand-promise" aria-label="Your brand, represented">
      <style>{`
        .cc-bp {
          position: relative; isolation: isolate;
          background: ${INK}; color: #fff;
          padding: clamp(80px, 11vw, 190px) clamp(24px, 4vw, 64px);
          overflow: hidden;
        }
        /* the structure under the type: a twelve column rule, felt not read */
        .cc-bp::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image: repeating-linear-gradient(
            90deg,
            rgba(255,255,255,0.045) 0 1px,
            transparent 1px calc(100% / 12)
          );
          -webkit-mask-image: linear-gradient(180deg, transparent, #000 22%, #000 74%, transparent);
                  mask-image: linear-gradient(180deg, transparent, #000 22%, #000 74%, transparent);
        }
        /* one violet bloom, low and slow, behind the statement */
        .cc-bp::after {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(46% 40% at 82% 18%, rgba(153,142,255,0.20), transparent 70%),
            radial-gradient(40% 36% at 4% 92%, rgba(106,91,232,0.16), transparent 72%);
        }
        .cc-bp-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }

        .cc-bp-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.8px;
          color: ${ACCENT_HI}; margin: 0 0 clamp(28px, 3.4vw, 54px);
        }
        .cc-bp-eyebrow::before {
          content: ''; width: clamp(26px, 4vw, 54px); height: 1px;
          background: linear-gradient(90deg, ${ACCENT_HI}, transparent);
        }

        /* ── the statement ── */
        .cc-bp-say {
          margin: 0; max-width: 20ch;
          font-family: 'Poppins', sans-serif; font-weight: 500;
          font-size: clamp(34px, 4.6vw, 88px); line-height: 1.08; letter-spacing: -0.035em;
          color: #fff;
        }
        .cc-bp-line { display: block; overflow: hidden; padding-bottom: 0.06em; margin-bottom: -0.06em; }
        .cc-bp-line > span { display: block; will-change: transform; }
        /* the words the promise actually turns on */
        .cc-bp-on {
          background: linear-gradient(168deg, ${ACCENT_HI}, ${ACCENT} 58%, #6A5BE8);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: ${ACCENT};
        }

        /* the second promise, set small against the first - the aside, not the headline */
        .cc-bp-aside {
          display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.86fr);
          gap: clamp(24px, 4vw, 90px); align-items: end;
          margin-top: clamp(26px, 3vw, 50px);
        }
        .cc-bp-body {
          grid-column: 2; margin: 0;
          font-family: 'Inter', sans-serif; font-weight: 400;
          font-size: clamp(15px, 1.2vw, 19px); line-height: 1.78;
          color: rgba(255,255,255,0.72); max-width: 46ch;
        }
        .cc-bp-body b { color: #fff; font-weight: 600; }

        .cc-bp-acts {
          grid-column: 2; display: flex; flex-wrap: wrap; align-items: center;
          gap: clamp(16px, 2vw, 30px); margin-top: clamp(22px, 2.6vw, 36px);
        }
        /* the only bright object in the slab */
        .cc-bp-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 12px;
          min-height: 60px; padding: 18px clamp(28px, 3vw, 46px);
          background: ${GLOSS}; color: #fff; text-decoration: none; border-radius: 100px;
          font-family: 'Inter', sans-serif; font-weight: 700;
          font-size: clamp(15px, 1.15vw, 18px); letter-spacing: 0.2px;
          box-shadow: ${ACCENT_RIM}, ${ACCENT_CAST};
          transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .4s ease;
          will-change: transform;
        }
        .cc-bp-btn svg { transition: transform .45s cubic-bezier(.16,1,.3,1); will-change: transform; }
        .cc-bp-btn:hover {
          transform: translateY(-3px);
          box-shadow: ${ACCENT_RIM}, 0 18px 32px -10px rgba(74,61,191,0.66), 0 42px 72px -28px rgba(74,61,191,0.78);
        }
        .cc-bp-btn:hover svg { transform: translateX(4px); }
        .cc-bp-ghost {
          display: inline-flex; align-items: center; gap: 9px; min-height: 44px;
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(13px, 1vw, 16px);
          color: rgba(255,255,255,0.82); text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.28); padding-bottom: 3px;
          transition: color .3s ease, border-color .3s ease, gap .35s cubic-bezier(.16,1,.3,1);
        }
        .cc-bp-ghost:hover { color: #fff; border-color: ${ACCENT}; gap: 14px; }
        .cc-bp-btn:focus-visible, .cc-bp-ghost:focus-visible { outline: 2px solid ${ACCENT_HI}; outline-offset: 4px; }

        /* ── the proof, on a hairline rail ── */
        .cc-bp-rail {
          display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(16px, 2vw, 40px);
          margin-top: clamp(48px, 5.5vw, 92px);
          padding-top: clamp(26px, 3vw, 44px);
          border-top: 1px solid rgba(255,255,255,0.16);
        }
        .cc-bp-stat { position: relative; padding-left: clamp(14px, 1.6vw, 26px); }
        .cc-bp-stat:first-child { padding-left: 0; }
        .cc-bp-stat + .cc-bp-stat::before {
          content: ''; position: absolute; left: 0; top: 4px; bottom: 6px; width: 1px;
          background: linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0));
        }
        .cc-bp-fig {
          display: flex; align-items: baseline; gap: 4px; margin: 0;
          font-family: 'Poppins', sans-serif; font-weight: 500; letter-spacing: -0.04em;
          font-size: clamp(38px, 4.4vw, 80px); line-height: 1; color: #fff;
        }
        .cc-bp-fig i {
          font-style: normal; font-weight: 600; letter-spacing: -0.02em;
          font-size: clamp(15px, 1.5vw, 26px); color: ${ACCENT};
        }
        .cc-bp-lab {
          margin: clamp(8px, 1vw, 14px) 0 0;
          font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: clamp(10px, 0.76vw, 12px); letter-spacing: 2px;
          color: rgba(255,255,255,0.5);
        }

        @media (min-width: 1920px) { .cc-bp-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-bp-inner { max-width: 2400px; } }

        /* ── the aside falls under the statement before it gets cramped ── */
        @media (max-width: 1100px) {
          .cc-bp-aside { grid-template-columns: minmax(0, 1fr); }
          .cc-bp-body, .cc-bp-acts { grid-column: 1; }
          .cc-bp-say { max-width: 100%; }
        }
        @media (max-width: 780px) {
          .cc-bp::before { background-image: repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0 1px, transparent 1px calc(100% / 4)); }
          .cc-bp-rail { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: clamp(26px, 6vw, 40px); }
          .cc-bp-stat:nth-child(3) { padding-left: 0; }
          .cc-bp-stat:nth-child(3)::before { display: none; }
          .cc-bp-btn { width: 100%; }
        }
        /* the lines are broken by hand, so the type has to stay small enough
           that the browser never breaks them again on top of that */
        @media (max-width: 560px) {
          .cc-bp-say { font-size: clamp(25px, 7.2vw, 33px); line-height: 1.14; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-bp-btn, .cc-bp-btn svg, .cc-bp-ghost { transition: none; }
        }
      `}</style>

      <div className="cc-bp-inner">
        <motion.p className="cc-bp-eyebrow" variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          Our Promise
        </motion.p>

        {/* The statement, arriving a line at a time.

            The reveal is driven from the heading, never from the sliding line
            itself: each line starts translated fully outside its own clip box,
            so an observer on the line would never see it intersect and the
            words would sit there invisible for good. */}
        <motion.h2
          className="cc-bp-say"
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-90px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
        >
          {LINES.map((line, li) => (
            <span className="cc-bp-line" key={li}>
              <motion.span
                variants={{
                  hidden: { y: '110%' },
                  show: { y: 0, transition: { duration: 1, ease: EASE } },
                }}
              >
                {line.map((w, wi) => (
                  <span key={wi} className={w.on ? 'cc-bp-on' : undefined}>
                    {wi > 0 && ' '}
                    {w.t}
                  </span>
                ))}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <div className="cc-bp-aside">
          <motion.p
            className="cc-bp-body"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            transition={{ delay: 0.2, duration: 0.85, ease: EASE }}
          >
            We train, staff and manage a dedicated team that speaks in your voice and follows
            your playbook. <b>And it flexes the day your volume does</b> - agents added in days,
            not months, with no recruitment, no overheads and no idle staff to carry.
          </motion.p>

          <motion.div
            className="cc-bp-acts"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            transition={{ delay: 0.28, duration: 0.85, ease: EASE }}
          >
            <Link className="cc-bp-btn gl-shine" to="/contact#write">
              <span>Book a Free Consultation</span>
              <ArrowRight size={19} strokeWidth={2.4} aria-hidden />
            </Link>
            <Link className="cc-bp-ghost" to="/services">
              See how it works
              <ArrowUpRight size={16} strokeWidth={2.4} aria-hidden />
            </Link>
          </motion.div>
        </div>

        <div className="cc-bp-rail">
          {STATS.map((s, i) => <Figure key={s.label} stat={s} i={i} />)}
        </div>
      </div>
    </section>
  )
}
