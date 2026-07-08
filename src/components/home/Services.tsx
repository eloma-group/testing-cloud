import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { MaskReveal, fadeUp, staggerParent, VIEWPORT } from '../../lib/anim'

const TEXT   = '#2E3A34'
const ACCENT = '#C6866B'
const DARK   = '#3E4A42'
const CREAM  = '#F4F1EB'
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* ──────────────────────────────────────────────────────────────
   3D icons — an isometric, top-lit rounded platform with a
   gradient face, an extruded darker side for real thickness,
   a gloss highlight and a coloured depth-glow. Glyph in white.
   ────────────────────────────────────────────────────────────── */

type Tile = { id: string; a: string; b: string; children: ReactNode }

function Tile3D({ id, a, b, children }: Tile) {
  return (
    <svg className="cc-serv-tile" viewBox="0 0 128 128" fill="none" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-face`} x1="24" y1="10" x2="104" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor={a} /><stop offset="1" stopColor={b} />
        </linearGradient>
        <linearGradient id={`${id}-side`} x1="20" y1="96" x2="108" y2="124" gradientUnits="userSpaceOnUse">
          <stop stopColor={b} /><stop offset="1" stopColor="#20271f" />
        </linearGradient>
        <linearGradient id={`${id}-gloss`} x1="64" y1="12" x2="64" y2="78" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.55" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.42" r="0.62">
          <stop stopColor={a} stopOpacity="0.5" /><stop offset="1" stopColor={a} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="64" cy="74" rx="54" ry="48" fill={`url(#${id}-glow)`} />
      <rect x="22" y="24" width="84" height="84" rx="27" fill={`url(#${id}-side)`} />
      <rect x="22" y="16" width="84" height="84" rx="27" fill={`url(#${id}-face)`} />
      <rect x="22" y="16" width="84" height="84" rx="27" fill={`url(#${id}-gloss)`} />
      <rect x="22.75" y="16.75" width="82.5" height="82.5" rx="26.25" stroke="#fff" strokeOpacity="0.32" strokeWidth="1.5" />
      <g transform="translate(0,-4)" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {children}
      </g>
    </svg>
  )
}

type Service = { n: string; title: string; tag: string; desc: string; a: string; b: string; icon: ReactNode }

const SERVICES: Service[] = [
  {
    n: '01', title: 'Inbound Call Handling', tag: 'Voice',
    desc: 'Every incoming call answered in seconds, in your brand name, by agents trained on your product - no queues, no missed customers, no voicemail black holes.',
    a: '#E0A788', b: ACCENT,
    icon: (
      <>
        <path d="M46 68v-6a18 18 0 0 1 36 0v6" />
        <path d="M46 66h-4a5 5 0 0 0-5 5v6a5 5 0 0 0 5 5h4V66Z" fill="#fff" stroke="none" />
        <path d="M82 66h4a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5h-4V66Z" fill="#fff" stroke="none" />
        <path d="M82 82v3a7 7 0 0 1-7 7h-7" />
      </>
    ),
  },
  {
    n: '02', title: 'Live Chat & Email', tag: 'Digital',
    desc: 'Real-time chat and inbox coverage across your website and channels, keeping first-response times in seconds and every conversation on-brand.',
    a: '#5A6A5D', b: DARK,
    icon: (
      <>
        <rect x="38" y="42" width="38" height="30" rx="8" fill="#fff" stroke="none" />
        <path d="M47 80v-8h11l-11 8Z" fill="#fff" stroke="none" />
        <rect x="66" y="58" width="26" height="22" rx="7" fill={ACCENT} stroke="none" />
        <path d="M82 86v-6h-6l6 6Z" fill={ACCENT} stroke="none" />
        <path d="M46 53h22M46 61h14" stroke={DARK} strokeWidth="3.4" />
      </>
    ),
  },
  {
    n: '03', title: 'Technical Helpdesk', tag: 'Support',
    desc: 'Tier-1 and tier-2 troubleshooting with tickets logged, escalated and resolved, so your product issues never stall and your team stays focused.',
    a: '#5A6A5D', b: DARK,
    icon: (
      <>
        <circle cx="64" cy="62" r="13" fill="#fff" stroke="none" />
        <circle cx="64" cy="62" r="5.5" fill={DARK} stroke="none" />
        <path d="M64 39v9M64 76v9M41 62h9M78 62h9M47 45l6.5 6.5M80.5 78.5 74 72M80.5 45.5 74 52M47 79l6.5-6.5" />
      </>
    ),
  },
  {
    n: '04', title: '24/7 Multilingual Support', tag: 'Global',
    desc: 'Round-the-clock coverage across time zones and languages, so your customers always reach a real, fluent person - day, night, weekends and holidays.',
    a: '#E0A788', b: ACCENT,
    icon: (
      <>
        <circle cx="64" cy="62" r="22" fill="#fff" stroke="none" />
        <path d="M42 62h44M64 40c9 9 9 35 0 44M64 40c-9 9-9 35 0 44" stroke={ACCENT} strokeWidth="3.2" />
        <path d="M48 50c9 5.5 23 5.5 32 0M48 74c9-5.5 23-5.5 32 0" stroke={ACCENT} strokeWidth="3.2" />
      </>
    ),
  },
  {
    n: '05', title: 'Outbound & Telesales', tag: 'Growth',
    desc: 'Proactive callbacks, follow-ups and sales outreach that turn warm leads into booked, paying customers - fully scripted, measured and reported to you.',
    a: '#5A6A5D', b: DARK,
    icon: (
      <>
        <path d="M46 46a5 5 0 0 1 5-4l7 1a5 5 0 0 1 4 4l1 7a5 5 0 0 1-1 5l-4 3a30 30 0 0 0 14 14l3-4a5 5 0 0 1 5-1l7 1a5 5 0 0 1 4 4l1 7a5 5 0 0 1-4 5c-22 3-44-19-42-42Z" fill="#fff" stroke="none" />
        <path d="M72 42h14v14" stroke={ACCENT} strokeWidth="3.6" />
        <path d="M86 42 70 58" stroke={ACCENT} strokeWidth="3.6" />
      </>
    ),
  },
  {
    n: '06', title: 'Back-Office & Orders', tag: 'Operations',
    desc: 'Order processing, data entry and after-call admin handled off your plate with accuracy and speed, so the work behind the calls never piles up.',
    a: '#5A6A5D', b: DARK,
    icon: (
      <>
        <rect x="44" y="42" width="40" height="48" rx="7" fill="#fff" stroke="none" />
        <rect x="55" y="37" width="18" height="10" rx="4" fill={ACCENT} stroke="none" />
        <path d="M53 62h22M53 71h22M53 80h13" stroke={DARK} strokeWidth="3.4" />
      </>
    ),
  },
]

export function Services() {
  const reduce = useReducedMotion() ?? false
  const [active, setActive] = useState(0)
  const cur = SERVICES[active]

  return (
    <section className="cc-serv" id="services" aria-label="Our services">
      <style>{`
        .cc-serv {
          position: relative; isolation: isolate;
          background: ${CREAM};
          color: ${TEXT};
          padding: clamp(72px, 10vw, 150px) clamp(24px, 4vw, 64px);
          overflow: hidden;
        }
        .cc-serv-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }

        /* ── header ── */
        .cc-serv-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px;
          color: ${ACCENT}; margin: 0 0 clamp(16px, 2vw, 24px);
        }
        .cc-serv-eyebrow::before { content: ''; width: clamp(26px, 4vw, 54px); height: 1px; background: ${ACCENT}; opacity: 0.6; }
        .cc-serv-head {
          display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between;
          gap: clamp(20px, 3vw, 48px); margin-bottom: clamp(40px, 5vw, 76px);
        }
        .cc-serv-h2 {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: clamp(36px, 5.4vw, 84px); line-height: 1.0; letter-spacing: -0.025em;
          margin: 0; color: ${TEXT}; max-width: 15ch;
        }
        .cc-serv-h2 .accent { color: ${ACCENT}; }
        .cc-serv-lead {
          font-family: 'Inter', sans-serif;
          font-size: clamp(15px, 1.2vw, 18px); line-height: 1.75;
          color: rgba(46,58,52,0.6); margin: 0; max-width: 42ch; padding-bottom: 6px;
        }

        /* ── split showcase ── */
        .cc-serv-split {
          display: grid; grid-template-columns: 1.02fr 1fr;
          gap: clamp(20px, 2.4vw, 40px); align-items: stretch;
        }

        /* left: live detail panel */
        .cc-serv-detail {
          position: relative; overflow: hidden;
          border-radius: 30px;
          background: #ffffff;
          border: 1px solid rgba(46,58,52,0.1);
          box-shadow: 0 26px 60px -42px rgba(46,58,52,0.4);
          padding: clamp(32px, 3vw, 52px);
          display: flex; flex-direction: column;
          min-height: clamp(400px, 37vw, 510px);
        }
        /* thin brand accent line along the top edge */
        .cc-serv-detail::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, ${ACCENT}, rgba(198,134,107,0)); z-index: 2;
        }
        .cc-serv-detail-top, .cc-serv-detail-body { position: relative; z-index: 1; }
        .cc-serv-detail-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .cc-serv-tag {
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 12px); letter-spacing: 2px; color: ${ACCENT};
          padding: 7px 15px; border: 1px solid rgba(198,134,107,0.35); border-radius: 100px;
          background: rgba(255,255,255,0.6);
        }
        .cc-serv-step {
          font-family: 'Poppins', sans-serif; letter-spacing: 0.5px;
          color: rgba(46,58,52,0.35); font-size: clamp(13px, 1vw, 15px); font-weight: 500;
        }
        .cc-serv-step b { color: ${TEXT}; font-size: clamp(22px, 2.2vw, 34px); font-weight: 600; letter-spacing: -0.03em; }

        .cc-serv-detail-body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .cc-serv-iconwrap {
          position: relative; align-self: flex-start;
          display: grid; place-items: center;
          margin: clamp(14px, 1.6vw, 24px) 0;
        }
        .cc-serv-pedestal {
          position: absolute; bottom: clamp(2px, 0.4vw, 8px); left: 50%; transform: translateX(-50%);
          width: 78%; height: 22px; border-radius: 50%;
          background: radial-gradient(closest-side, rgba(46,58,52,0.22), transparent);
          z-index: 0; pointer-events: none;
        }
        .cc-serv-tile {
          position: relative; z-index: 1;
          width: clamp(104px, 11vw, 150px); height: clamp(104px, 11vw, 150px);
          filter: drop-shadow(0 20px 26px rgba(46,58,52,0.26));
          animation: cc-float 6s cubic-bezier(.45,0,.55,1) infinite;
        }
        @keyframes cc-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        .cc-serv-detail h3 {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: clamp(26px, 2.8vw, 44px); line-height: 1.06; letter-spacing: -0.02em;
          margin: 0 0 clamp(10px, 1vw, 16px); color: ${TEXT};
        }
        .cc-serv-detail p {
          font-family: 'Inter', sans-serif;
          font-size: clamp(15px, 1.1vw, 17px); line-height: 1.7;
          margin: 0 0 clamp(20px, 2.2vw, 30px); color: rgba(46,58,52,0.66); max-width: 48ch;
        }
        .cc-serv-cta {
          display: inline-flex; align-items: center; gap: 10px; align-self: flex-start;
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(13px, 1vw, 15px);
          letter-spacing: 0.3px; color: ${TEXT}; text-decoration: none;
        }
        .cc-serv-cta .ic {
          display: inline-flex; padding: 9px; border-radius: 100px; background: ${ACCENT}; color: #fff;
          transition: transform .45s cubic-bezier(.16,1,.3,1); will-change: transform;
        }
        .cc-serv-cta:hover .ic { transform: translate(3px,-3px); }

        /* right: interactive list — stretches to match the panel height */
        .cc-serv-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; height: 100%; }
        .cc-serv-list li { flex: 1 1 0; display: flex; flex-direction: column; }
        .cc-serv-row {
          position: relative; width: 100%; height: 100%; text-align: left; background: none; border: 0; cursor: pointer;
          display: flex; align-items: center; gap: clamp(16px, 1.8vw, 28px);
          padding: clamp(14px, 1.6vw, 24px) clamp(14px, 1.6vw, 26px);
          border-top: 1px solid rgba(46,58,52,0.12);
          font-family: 'Poppins', sans-serif; color: ${TEXT};
          transition: padding-left .5s cubic-bezier(.16,1,.3,1);
        }
        .cc-serv-list li:last-child .cc-serv-row { border-bottom: 1px solid rgba(46,58,52,0.12); }
        .cc-serv-row::before {
          content: ''; position: absolute; left: 0; top: 14%; bottom: 14%; width: 3px; border-radius: 3px;
          background: ${ACCENT}; transform: scaleY(0); transform-origin: center;
          transition: transform .5s cubic-bezier(.16,1,.3,1);
        }
        .cc-serv-row.is-active::before { transform: scaleY(1); }
        .cc-serv-row.is-active { padding-left: clamp(24px, 2.4vw, 40px); }
        .cc-serv-rn {
          font-size: clamp(13px, 1vw, 15px); font-weight: 600; letter-spacing: 1px;
          color: rgba(46,58,52,0.4); min-width: 2.4ch; transition: color .4s ease;
        }
        .cc-serv-row.is-active .cc-serv-rn { color: ${ACCENT}; }
        .cc-serv-rt {
          flex: 1; font-weight: 600; letter-spacing: -0.02em; line-height: 1.1;
          font-size: clamp(19px, 2vw, 32px);
          color: rgba(46,58,52,0.55); transition: color .4s ease;
        }
        .cc-serv-row.is-active .cc-serv-rt, .cc-serv-row:hover .cc-serv-rt { color: ${TEXT}; }
        .cc-serv-rarrow {
          color: ${ACCENT}; opacity: 0; transform: translateX(-6px);
          transition: opacity .4s ease, transform .5s cubic-bezier(.16,1,.3,1); will-change: transform;
        }
        .cc-serv-row.is-active .cc-serv-rarrow { opacity: 1; transform: translateX(0); }

        /* inline detail — only used on mobile accordion */
        .cc-serv-inline { display: none; }

        @media (min-width: 1920px) { .cc-serv-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-serv-inner { max-width: 2400px; } }

        @media (max-width: 900px) {
          .cc-serv-split { grid-template-columns: 1fr; }
          .cc-serv-detail { display: none; }              /* swap to accordion */
          .cc-serv-list, .cc-serv-list li { height: auto; flex: initial; }
          .cc-serv-inline {
            display: block; overflow: hidden;
            padding: 0 clamp(14px, 1.6vw, 26px);
          }
          .cc-serv-inline-in {
            display: flex; gap: 20px; align-items: center;
            padding: 4px 0 clamp(22px, 5vw, 30px);
          }
          .cc-serv-inline .cc-serv-tile { width: 92px; height: 92px; margin: 0; flex-shrink: 0; animation: none; }
          .cc-serv-inline p {
            font-family: 'Inter', sans-serif; font-size: clamp(14px, 3.6vw, 16px); line-height: 1.65;
            margin: 0; color: rgba(46,58,52,0.66);
          }
          .cc-serv-row { gap: 16px; }
        }
        @media (max-width: 480px) {
          .cc-serv-inline-in { flex-direction: column; align-items: flex-start; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-serv-tile { animation: none; }
        }
      `}</style>

      <div className="cc-serv-inner">
        <div className="cc-serv-head">
          <div>
            <motion.p className="cc-serv-eyebrow" variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
              What We Handle
            </motion.p>
            <MaskReveal as="h2" className="cc-serv-h2" delay={0.05}>
              Your whole support desk, <span className="accent">under your brand</span>
            </MaskReveal>
          </div>
          <motion.p
            className="cc-serv-lead"
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

        <div className="cc-serv-split">
          {/* live detail panel (desktop / tablet) */}
          <motion.div className="cc-serv-detail" variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
            <div className="cc-serv-detail-top">
              <span className="cc-serv-tag">{cur.tag}</span>
              <span className="cc-serv-step"><b>{cur.n}</b> / 06</span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                className="cc-serv-detail-body"
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div className="cc-serv-iconwrap">
                  <span className="cc-serv-pedestal" aria-hidden />
                  <svg className="cc-serv-tile" viewBox="0 0 128 128" fill="none" aria-hidden>
                    <defs>
                      <linearGradient id="det-face" x1="24" y1="10" x2="104" y2="112" gradientUnits="userSpaceOnUse">
                        <stop stopColor={cur.a} /><stop offset="1" stopColor={cur.b} />
                      </linearGradient>
                      <linearGradient id="det-side" x1="20" y1="96" x2="108" y2="124" gradientUnits="userSpaceOnUse">
                        <stop stopColor={cur.b} /><stop offset="1" stopColor="#20271f" />
                      </linearGradient>
                      <linearGradient id="det-gloss" x1="64" y1="12" x2="64" y2="78" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#fff" stopOpacity="0.55" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
                      </linearGradient>
                      <radialGradient id="det-glow" cx="0.5" cy="0.42" r="0.62">
                        <stop stopColor={cur.a} stopOpacity="0.5" /><stop offset="1" stopColor={cur.a} stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <ellipse cx="64" cy="74" rx="54" ry="48" fill="url(#det-glow)" />
                    <rect x="22" y="24" width="84" height="84" rx="27" fill="url(#det-side)" />
                    <rect x="22" y="16" width="84" height="84" rx="27" fill="url(#det-face)" />
                    <rect x="22" y="16" width="84" height="84" rx="27" fill="url(#det-gloss)" />
                    <rect x="22.75" y="16.75" width="82.5" height="82.5" rx="26.25" stroke="#fff" strokeOpacity="0.32" strokeWidth="1.5" />
                    <g transform="translate(0,-4)" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                      {cur.icon}
                    </g>
                  </svg>
                </div>

                <div>
                  <h3>{cur.title}</h3>
                  <p>{cur.desc}</p>
                  <a className="cc-serv-cta" href="#contact">
                    Learn more
                    <span className="ic"><ArrowUpRight size={16} strokeWidth={2.4} aria-hidden /></span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* interactive list */}
          <motion.ul
            className="cc-serv-list"
            variants={staggerParent(0.08, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {SERVICES.map((s, i) => (
              <motion.li key={s.title} variants={fadeUp}>
                <button
                  type="button"
                  className={`cc-serv-row${active === i ? ' is-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                >
                  <span className="cc-serv-rn">{s.n}</span>
                  <span className="cc-serv-rt">{s.title}</span>
                  <ArrowUpRight className="cc-serv-rarrow" size={26} strokeWidth={2} aria-hidden />
                </button>

                {/* mobile-only inline accordion detail */}
                <AnimatePresence initial={false}>
                  {active === i && (
                    <motion.div
                      className="cc-serv-inline"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <div className="cc-serv-inline-in">
                        <Tile3D id={`m${i}`} a={s.a} b={s.b}>{s.icon}</Tile3D>
                        <p>{s.desc}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
