import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Headset, Clock, Smile, Users, Globe, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { MaskReveal, staggerParent, fadeUp, VIEWPORT, EASE } from '../../lib/anim'

const MotionLink = motion.create(Link)

const TEXT   = '#16141F'
const ACCENT = '#998EFF'
const ACCENT_INK = '#6A5BE8'
const WASH   = '#F4F2FD'
const MUTED  = '#5E5B6B'

const GLOSS       = 'linear-gradient(168deg, #C3BCFF 0%, #998EFF 46%, #4A3DBF 100%)'
const ACCENT_RIM  = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(40,32,100,0.3)'
const ACCENT_CAST = '0 2px 4px rgba(74,61,191,0.34), 0 12px 24px -10px rgba(74,61,191,0.5), 0 30px 54px -26px rgba(74,61,191,0.62)'

/* ──────────────────────────────────────────────────────────────
   Our Team. Left: one giant word per person, each tied by a
   leader line to a small label. Right: five cards, one per person,
   holding the person icon, name and designation. Hovering a word
   (or its card) links the pair and develops that card's own
   portrait, in the slot on its right - the slot is always reserved,
   so only opacity and transform ever move.
   ────────────────────────────────────────────────────────────── */

type Member = {
  word: string
  label: string
  name: string
  role: string
  /** the portrait, shot head-and-shoulders so a 3:4 cover crop always holds the face */
  photo: string
  /** the accent-coloured lines, alternating down the stack */
  tint?: boolean
}

const TEAM: Member[] = [
  { word: 'Behind',     label: 'The Founder',   name: 'RJ',              role: 'Founder of Eloma Group',           photo: '/images/team/rj.jpg' },
  { word: 'Every',      label: 'The Design',    name: 'Shashank Namedo', role: 'VP of Digital Design',             photo: '/images/team/shashank.jpg', tint: true },
  { word: 'Great Call', label: 'The Growth',    name: 'Arpita Negi',     role: 'Senior Digital Marketing Manager', photo: '/images/team/arpita.jpg' },
  { word: 'Is Someone', label: 'The Build',     name: 'Sawan Chourasia', role: 'Developer',                        photo: '/images/team/sawan.jpg', tint: true },
  { word: 'Who Cares.', label: 'The Craft',     name: 'Ritesh Raj',      role: 'Developer',                        photo: '/images/team/ritesh.jpg' },
]

const STATS: { Icon: LucideIcon; value: string; label: string }[] = [
  { Icon: Headset, value: '12,548', label: 'Calls Handled' },
  { Icon: Clock,   value: '18s',    label: 'Avg. Wait Time' },
  { Icon: Smile,   value: '98.7%',  label: 'Satisfaction' },
  { Icon: Users,   value: '326',    label: 'Experts Online' },
  { Icon: Globe,   value: '24',     label: 'Languages' },
]

export function OurTeam() {
  const reduce = useReducedMotion() ?? false
  const [active, setActive] = useState<number | null>(null)

  const pair = {
    onMouseLeave: () => setActive(null),
    onBlur: () => setActive(null),
  }

  return (
    <section className="cc-tm" id="team" aria-label="Our team">
      <style>{`
        .cc-tm {
          position: relative; isolation: isolate; overflow: hidden;
          background: linear-gradient(180deg, #FFFFFF 0%, #FBFAFE 46%, ${WASH} 100%);
          color: ${TEXT};
          padding: clamp(72px, 10vw, 150px) clamp(24px, 4vw, 64px) clamp(72px, 10vw, 150px);
        }
        .cc-tm::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(52% 46% at 80% 16%, rgba(153,142,255,0.12), transparent 70%);
        }
        .cc-tm-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }
        @media (min-width: 1920px) { .cc-tm-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-tm-inner { max-width: 2400px; } }

        .cc-tm-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px;
          color: ${ACCENT_INK}; margin: 0 0 clamp(22px, 2.8vw, 40px);
        }
        .cc-tm-eyebrow::before { content: ''; width: clamp(22px, 3vw, 44px); height: 1px; background: ${ACCENT}; opacity: 0.6; }

        /* both columns share one hover stage so the portrait can travel across */
        .cc-tm-stage {
          position: relative;
          display: grid; grid-template-columns: minmax(0, 1.02fr) minmax(0, 1fr);
          gap: clamp(28px, 4vw, 80px); align-items: start;
        }

        /* ── left: one word per person, leader line, label ── */
        .cc-tm-lines { display: flex; flex-direction: column; gap: clamp(2px, 0.5vw, 10px); }
        .cc-tm-lineRow {
          display: flex; align-items: center; gap: clamp(12px, 1.4vw, 24px);
          width: 100%; padding: 0; background: none; border: 0; color: inherit; font: inherit;
          text-align: left; cursor: pointer;
        }
        .cc-tm-lineRow:focus-visible { outline: 2px solid ${ACCENT_INK}; outline-offset: 6px; border-radius: 8px; }
        .cc-tm-word {
          display: block; flex: none;
          font-family: 'Eloma Sans', sans-serif; 
          font-size: clamp(40px, 6.2vw, 112px); line-height: 1.0; letter-spacing: -0.045em;
          color: ${TEXT};
          transition: color .45s cubic-bezier(.16,1,.3,1), opacity .45s cubic-bezier(.16,1,.3,1);
        }
        .cc-tm-word.tint { color: ${ACCENT}; }
        /* a word is hovered: the rest step back */
        .cc-tm-lines.picked .cc-tm-lineRow:not(.on) .cc-tm-word { opacity: 0.28; }
        .cc-tm-lineRow.on .cc-tm-word { color: ${ACCENT_INK}; }

        /* the leader line + dot + label, exactly like a spec drawing */
        .cc-tm-leader { flex: 1; min-width: clamp(20px, 6vw, 150px); height: 1px; background: rgba(22,20,31,0.22); position: relative; }
        .cc-tm-leader::after {
          content: ''; position: absolute; inset: 0; transform-origin: left center; transform: scaleX(0);
          background: ${ACCENT_INK}; will-change: transform;
          transition: transform .55s cubic-bezier(.16,1,.3,1);
        }
        .cc-tm-lineRow.on .cc-tm-leader::after { transform: scaleX(1); }
        .cc-tm-dot {
          flex: none; width: 9px; height: 9px; border-radius: 50%;
          border: 1px solid rgba(22,20,31,0.3); background: #fff;
          will-change: transform; transition: transform .5s cubic-bezier(.16,1,.3,1), border-color .4s ease, background .4s ease;
        }
        .cc-tm-lineRow.on .cc-tm-dot { border-color: ${ACCENT_INK}; background: ${ACCENT_INK}; transform: scale(1.5); }
        .cc-tm-label {
          flex: none; font-family: 'Eloma Sans', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: clamp(10px, 0.78vw, 13px); letter-spacing: 1.8px; color: ${MUTED};
          transition: color .4s ease;
        }
        .cc-tm-lineRow.on .cc-tm-label { color: ${ACCENT_INK}; }

        /* ── left: rule, lead, CTAs, stats ── */
        .cc-tm-rule { width: 52px; height: 3px; border-radius: 2px; background: ${ACCENT_INK}; margin: clamp(28px, 3.4vw, 48px) 0 clamp(16px, 1.8vw, 24px); }
        .cc-tm-lead {
          font-family: 'Eloma Sans', sans-serif; font-size: clamp(15px, 1.25vw, 19px); line-height: 1.72;
          color: ${MUTED}; max-width: 44ch; margin: 0;
        }
        .cc-tm-cta { display: flex; flex-wrap: wrap; align-items: center; gap: clamp(16px, 2vw, 34px); margin-top: clamp(26px, 3vw, 42px); }
        .cc-tm-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 12px;
          min-height: 58px; padding: 17px clamp(26px, 2.6vw, 40px); border-radius: 100px;
          font-family: 'Eloma Sans', sans-serif; font-weight: 700; font-size: clamp(14px, 1.1vw, 17px);
          text-decoration: none; letter-spacing: 0.2px; color: #fff; background: ${GLOSS};
          box-shadow: ${ACCENT_RIM}, ${ACCENT_CAST};
          will-change: transform;
          transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s cubic-bezier(.16,1,.3,1);
        }
        .cc-tm-btn:hover {
          transform: translateY(-3px);
          box-shadow: ${ACCENT_RIM}, 0 3px 6px rgba(74,61,191,0.4), 0 18px 30px -10px rgba(74,61,191,0.68), 0 44px 70px -26px rgba(74,61,191,0.8);
        }
        .cc-tm-btn svg { will-change: transform; transition: transform .45s cubic-bezier(.16,1,.3,1); }
        .cc-tm-btn:hover svg { transform: translateX(4px); }

        .cc-tm-watch {
          display: inline-flex; align-items: center; gap: 14px; min-height: 44px;
          text-decoration: none; color: ${TEXT};
          font-family: 'Eloma Sans', sans-serif; font-weight: 700; font-size: clamp(14px, 1.05vw, 16px); line-height: 1.3;
        }
        .cc-tm-watch i {
          flex: none; display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%;
          background: #fff; color: ${ACCENT_INK};
          box-shadow: inset 0 0 0 1.5px rgba(153,142,255,0.5), 0 8px 20px -12px rgba(74,61,191,0.6);
          will-change: transform; transition: transform .45s cubic-bezier(.16,1,.3,1);
        }
        .cc-tm-watch:hover i { transform: scale(1.08); }

        .cc-tm-stats {
          display: grid; grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: clamp(10px, 1vw, 16px);
          margin-top: clamp(34px, 4vw, 60px); padding-top: clamp(22px, 2.6vw, 34px);
          border-top: 1px solid rgba(22,20,31,0.10);
        }
        /* each figure is its own tile: it lifts, warms and its icon nudges on hover */
        .cc-tm-stat {
          position: relative; overflow: hidden; isolation: isolate;
          display: flex; align-items: center; gap: 12px;
          padding: clamp(14px, 1.3vw, 20px) clamp(12px, 1.1vw, 18px);
          border-radius: 16px; box-shadow: inset 0 0 0 1px rgba(22,20,31,0.08);
          background: rgba(255,255,255,0.5);
          will-change: transform;
          transition: transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s cubic-bezier(.16,1,.3,1);
        }
        /* the accent wash swims up from the base */
        .cc-tm-stat::before {
          content: ''; position: absolute; inset: 0; z-index: -1; opacity: 0;
          background: linear-gradient(168deg, rgba(153,142,255,0.20), rgba(153,142,255,0.04));
          transition: opacity .45s ease;
        }
        .cc-tm-stat:hover {
          transform: translateY(-6px);
          box-shadow:
            inset 0 0 0 1px rgba(153,142,255,0.55),
            0 8px 18px -12px rgba(74,61,191,0.5),
            0 26px 44px -26px rgba(74,61,191,0.6);
        }
        .cc-tm-stat:hover::before { opacity: 1; }
        .cc-tm-stat svg {
          flex: none; color: ${ACCENT_INK}; will-change: transform;
          transition: transform .55s cubic-bezier(.16,1,.3,1);
        }
        .cc-tm-stat:hover svg { transform: translateY(-2px) scale(1.12); }
        .cc-tm-stat b {
          display: block; font-family: 'Eloma Sans', sans-serif; font-weight: 700;
          font-size: clamp(16px, 1.35vw, 22px); letter-spacing: -0.02em; color: ${TEXT};
        }
        .cc-tm-stat span {
          display: block; font-family: 'Eloma Sans', sans-serif;
          font-size: clamp(12px, 0.9vw, 14px); color: ${MUTED}; margin-top: 2px;
        }

        /* ── right: five cards, one per person ── */
        .cc-tm-cards { display: flex; flex-direction: column; gap: clamp(14px, 1.5vw, 24px); }
        .cc-tm-card {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: clamp(16px, 1.6vw, 28px);
          width: 100%; text-align: left; font: inherit; color: inherit; cursor: pointer;
          padding: clamp(20px, 2.1vw, 32px) clamp(20px, 2.2vw, 34px);
          /* the right end is kept clear so the popup never lands on the name */
          padding-right: clamp(104px, 8.6vw, 146px);
          border-radius: 20px; border: 1px dashed rgba(22,20,31,0.16);
          background: rgba(255,255,255,0.55);
          will-change: transform;
          transition: transform .55s cubic-bezier(.16,1,.3,1), border-color .4s ease,
                      background .4s ease, box-shadow .55s cubic-bezier(.16,1,.3,1);
        }
        .cc-tm-card.on {
          z-index: 6; transform: translateX(8px);
          border-color: ${ACCENT}; border-style: solid; background: #fff;
          box-shadow: 0 10px 24px -16px rgba(74,61,191,0.5), 0 34px 60px -34px rgba(74,61,191,0.55);
        }
        .cc-tm-card:focus-visible { outline: 2px solid ${ACCENT_INK}; outline-offset: 4px; }

        /* the person icon, which cross-fades to the portrait on hover */
        .cc-tm-avatar {
          position: relative; flex: none; overflow: hidden;
          width: clamp(52px, 4.2vw, 66px); aspect-ratio: 1; border-radius: 50%;
          display: grid; place-items: center;
          background: rgba(22,20,31,0.03); box-shadow: inset 0 0 0 1px rgba(22,20,31,0.14);
          transition: box-shadow .4s ease;
        }
        .cc-tm-card.on .cc-tm-avatar { box-shadow: inset 0 0 0 1px rgba(153,142,255,0.6); }
        /* the placeholder glyph, which the photo replaces on hover */
        .cc-tm-avatar > svg { color: rgba(22,20,31,0.34); transition: opacity .4s ease; }
        .cc-tm-card.on .cc-tm-avatar > svg { opacity: 0; }
        /* every portrait is cropped from the top, so a cover crop keeps the face */
        .cc-tm-face {
          display: block; width: 100%; height: 100%;
          object-fit: cover; object-position: 50% 16%;
        }
        .cc-tm-avatar .cc-tm-face {
          position: absolute; inset: 0;
          opacity: 0; will-change: transform, opacity;
          transform: scale(0.86);
          transition: opacity .5s ease, transform .7s cubic-bezier(.16,1,.3,1);
        }
        .cc-tm-card.on .cc-tm-avatar .cc-tm-face { opacity: 1; transform: scale(1); }

        .cc-tm-id { flex: 1; min-width: 0; }
        .cc-tm-name {
          display: block;
          font-family: 'Eloma Sans', sans-serif; font-weight: 600;
          font-size: clamp(20px, 1.85vw, 32px); line-height: 1.14; letter-spacing: -0.03em; color: ${TEXT};
        }
        .cc-tm-role {
          display: block; margin-top: 6px;
          font-family: 'Eloma Sans', sans-serif; font-size: clamp(13px, 1vw, 16px);
          line-height: 1.5; color: ${MUTED};
        }
        .cc-tm-idx {
          flex: none; font-family: 'Eloma Sans', sans-serif; font-weight: 800;
          font-size: clamp(10px, 0.78vw, 13px); letter-spacing: 2px; color: ${ACCENT_INK}; opacity: 0.6;
        }

        /* ── the portrait popup, pinned to the right of its own row ──
           it never moves with the cursor: it simply pops where that card is,
           on opacity and transform only, so the row stays on the compositor */
        .cc-tm-pop {
          position: absolute; top: 50%; right: clamp(14px, 1.4vw, 24px); z-index: 5;
          width: clamp(124px, 9.8vw, 164px); aspect-ratio: 3 / 4; margin: 0;
          pointer-events: none; opacity: 0; will-change: transform, opacity;
          transform: translate3d(0, -50%, 0) scale(0.86) rotate(6deg);
          transition: opacity .4s ease, transform .55s cubic-bezier(.16,1,.3,1);
        }
        .cc-tm-card.on .cc-tm-pop {
          opacity: 1; transform: translate3d(0, -50%, 0) scale(1) rotate(3deg);
        }
        /* the popup is a lit panel the portrait sits inside */
        .cc-tm-pop-art {
          position: absolute; inset: 0; overflow: hidden;
          border-radius: 18px;
          background: linear-gradient(168deg, #FFFFFF 0%, #F6F4FE 52%, #E7E2FB 100%);
          box-shadow:
            inset 0 0 0 1px rgba(153,142,255,0.4),
            0 10px 24px -12px rgba(74,61,191,0.4),
            0 40px 70px -30px rgba(74,61,191,0.55);
        }
        .cc-tm-pop-cap {
          position: absolute; left: 0; right: 0; bottom: 0; padding: 24px 14px 12px;
          border-radius: 0 0 18px 18px;
          background: linear-gradient(to top, rgba(22,20,31,0.82), rgba(22,20,31,0));
          font-family: 'Eloma Sans', sans-serif; color: #fff; text-align: left;
        }
        .cc-tm-pop-cap b {
          display: block; font-weight: 700; font-size: clamp(12px, 0.85vw, 15px); letter-spacing: -0.01em;
        }
        .cc-tm-pop-cap span {
          display: block; margin-top: 2px; font-size: clamp(10px, 0.7vw, 12px);
          color: rgba(255,255,255,0.78); line-height: 1.4;
        }

        @media (max-width: 1024px) {
          .cc-tm-stage { grid-template-columns: 1fr; gap: clamp(36px, 6vw, 56px); }
          .cc-tm-lines.picked .cc-tm-lineRow:not(.on) .cc-tm-word { opacity: 1; }
          .cc-tm-card { transform: none; }
          .cc-tm-card.on { transform: none; }
          .cc-tm-stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          /* no hover on touch: the popup is retired and every card shows its vector outright */
          .cc-tm-pop { display: none; }
          .cc-tm-card { padding-right: clamp(20px, 2.2vw, 34px); }
          .cc-tm-avatar .cc-tm-face { opacity: 1; transform: none; }
          .cc-tm-avatar > svg { opacity: 0; }
        }
        @media (max-width: 640px) {
          .cc-tm-leader { display: none; }
          .cc-tm-dot { display: none; }
          .cc-tm-lineRow { flex-wrap: wrap; gap: 8px; }
          .cc-tm-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .cc-tm-stat:hover { transform: none; }
          .cc-tm-card { padding: 18px; gap: 14px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-tm-pop { display: none; }
          .cc-tm-card { padding-right: clamp(20px, 2.2vw, 34px); }
          .cc-tm-lines.picked .cc-tm-lineRow:not(.on) .cc-tm-word { opacity: 1; }
        }
      `}</style>

      <div className="cc-tm-inner">
        <motion.p
          className="cc-tm-eyebrow"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
        >
          Our Team
        </motion.p>

        <div className="cc-tm-stage" {...pair}>
          {/* ── left column ── */}
          <div>
            <div className={`cc-tm-lines${active !== null ? ' picked' : ''}`}>
              {TEAM.map((m, i) => (
                <button
                  type="button"
                  key={m.name}
                  className={`cc-tm-lineRow${active === i ? ' on' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-label={`${m.name}, ${m.role}`}
                >
                  <MaskReveal as="span" className={`cc-tm-word${m.tint ? ' tint' : ''}`} delay={0.05 * i}>
                    {m.word}
                  </MaskReveal>
                  <span className="cc-tm-leader" aria-hidden />
                  <span className="cc-tm-dot" aria-hidden />
                  <span className="cc-tm-label">{m.label}</span>
                </button>
              ))}
            </div>

            <motion.div
              variants={staggerParent(0.08, 0.15)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <motion.div className="cc-tm-rule" variants={fadeUp} />
              <motion.p className="cc-tm-lead" variants={fadeUp}>
                Real people. Real conversations.<br />
                Every interaction matters.
              </motion.p>

              <motion.div className="cc-tm-cta" variants={fadeUp}>
                <MotionLink className="cc-tm-btn gl-shine" to="/contact#write">
                  <span>Talk To Our Team</span>
                  <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
                </MotionLink>
                <Link className="cc-tm-watch" to="/industries">
                  <i aria-hidden><Play size={18} strokeWidth={2.4} fill="currentColor" /></i>
                  <span>See The Industries<br />We Serve</span>
                </Link>
              </motion.div>

              <motion.div className="cc-tm-stats" variants={fadeUp}>
                {STATS.map(({ Icon, value, label }) => (
                  <div className="cc-tm-stat" key={label}>
                    <Icon size={26} strokeWidth={1.8} aria-hidden />
                    <div>
                      <b>{value}</b>
                      <span>{label}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* ── right column: one card per person ── */}
          <motion.div
            className="cc-tm-cards"
            variants={staggerParent(0.08, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {TEAM.map((m, i) => (
              <motion.button
                type="button"
                key={m.name}
                className={`cc-tm-card${active === i ? ' on' : ''}`}
                variants={fadeUp}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-label={`${m.name}, ${m.role}`}
              >
                <span className="cc-tm-avatar">
                  <User size={26} strokeWidth={1.6} aria-hidden />
                  <img className="cc-tm-face" src={m.photo} alt="" width={1000} height={1500} decoding="async" loading="lazy" />
                </span>
                <span className="cc-tm-id">
                  <span className="cc-tm-name">{m.name}</span>
                  <span className="cc-tm-role">{m.role}</span>
                </span>
                <span className="cc-tm-idx">{String(i + 1).padStart(2, '0')}</span>

                {/* the portrait pops right here, on this row - it does not travel */}
                <span className="cc-tm-pop" aria-hidden>
                  <span className="cc-tm-pop-art">
                    <img className="cc-tm-face" src={m.photo} alt="" width={1000} height={1500} decoding="async" loading="lazy" />
                  </span>
                  <span className="cc-tm-pop-cap">
                    <b>{m.name}</b>
                    <span>{m.role}</span>
                  </span>
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
