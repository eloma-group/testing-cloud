import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Clock, Users } from 'lucide-react'
import { MaskReveal, fadeUp, useParallax, VIEWPORT, EASE } from '../../lib/anim'

const TEXT   = '#16141F'
const ACCENT = '#998EFF'
const ACCENT_INK = '#6A5BE8'   /* text-safe on white (5.3:1) - eyebrows, links, small labels */
const WASH  = '#F4F2FD'
const MUTED  = '#5E5B6B'

const GLOSS       = 'linear-gradient(168deg, #C3BCFF 0%, #998EFF 48%, #4A3DBF 100%)'
const ACCENT_RIM  = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(40,32,100,0.3)'
const ACCENT_CAST = '0 2px 4px rgba(74,61,191,0.34), 0 14px 26px -10px rgba(74,61,191,0.5)'

/* ──────────────────────────────────────────────────────────────
   The brand spread. One person cut out of her background, standing
   in front of the wordmark, with the proof floating around her:
   the pitch on the left, two cards at her feet, the crew and the
   headline number on the right.
   ────────────────────────────────────────────────────────────── */

const CREW = ['/images/spotlight/faces/f1.webp', '/images/spotlight/faces/f2.webp', '/images/spotlight/faces/f3.webp', '/images/spotlight/faces/f4.webp']
const TRUST = [...CREW, '/images/spotlight/faces/f5.webp']

const RATE = 0.92                       // the figure the dial fills to
const ARC = 2 * Math.PI * 52            // r=52 in the dial's 120x120 viewBox

export function Spotlight() {
  const reduce = useReducedMotion() ?? false
  const sceneRef = useRef<HTMLDivElement>(null)
  const lift = useParallax(sceneRef, 26)          /* transform-only: the subject rides the scroll */

  return (
    <section className="cc-sl" aria-label="Always-on support">
      <style>{`
        /* Omnichannel closes on #E3DEF8 and Engagement opens on it, so this
           section has to leave and arrive at the same value - the seam stays a
           band of wash, never a colour change. */
        .cc-sl {
          position: relative; isolation: isolate;
          background: linear-gradient(180deg, #E3DEF8 0%, #F7F5FD 15%, #FFFFFF 48%, ${WASH} 86%, #E3DEF8 100%);
          color: ${TEXT};
          padding: clamp(48px, 8vw, 140px) clamp(24px, 4vw, 64px);
          overflow: hidden;
        }
        .cc-sl::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(52% 44% at 6% 92%, rgba(153,142,255,0.10), transparent 70%);
        }
        .cc-sl-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }

        /* ── the scene ──
           A 3-column stage. The subject owns the middle column and is allowed to
           overflow it (the columns are floored at 0 so they never grow to fit
           her), the copy and the crew sit in the outer two, and the cards land
           on the bottom row, over her. */
        .cc-sl-scene {
          position: relative; overflow: hidden;
          border-radius: clamp(22px, 2.2vw, 38px);
          background: radial-gradient(124% 94% at 50% 4%, #FFFFFF 0%, #FAF9FE 40%, #F0EDFC 74%, #E1DCF7 100%);
          box-shadow:
            inset 0 0 0 1px rgba(26,22,44,0.07),
            0 1px 3px rgba(26,22,44,0.05),
            0 30px 66px -38px rgba(26,22,44,0.24);
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(0, 1.28fr) minmax(0, 1fr);
          grid-template-rows: minmax(0, 1fr) auto;
          gap: clamp(12px, 1.6vw, 28px);
          min-height: clamp(560px, 57vw, 880px);
          padding: clamp(26px, 3vw, 56px) clamp(20px, 2.6vw, 48px) 0;
        }

        /* ambient: a warm bloom the subject stands in, and two thin rings that
           echo the glass in the room. Decorative only, so no hit-testing. */
        .cc-sl-glow, .cc-sl-ring { position: absolute; z-index: 0; pointer-events: none; }
        .cc-sl-glow {
          left: 50%; bottom: -6%; width: min(64%, 780px); aspect-ratio: 1;
          transform: translateX(-50%);
          background: radial-gradient(circle at 50% 50%, rgba(153,142,255,0.20) 0%, rgba(153,142,255,0.08) 40%, transparent 68%);
        }
        .cc-sl-ring {
          right: -7%; top: -14%; width: min(44%, 620px); aspect-ratio: 1; border-radius: 50%;
          box-shadow:
            inset 0 0 0 1px rgba(153,142,255,0.20),
            0 0 0 1px rgba(22,20,31,0.05);
        }
        .cc-sl-ring::after {
          content: ''; position: absolute; inset: 14%; border-radius: 50%;
          box-shadow: inset 0 0 0 1px rgba(22,20,31,0.07);
        }

        /* the wordmark she stands in front of */
        .cc-sl-word {
          position: absolute; z-index: 0; pointer-events: none;
          top: clamp(28px, 5vw, 92px); left: 50%; transform: translateX(-50%);
          font-family: 'Eloma Sans', sans-serif; font-weight: 900; text-transform: uppercase;
          font-size: clamp(96px, 19vw, 330px); line-height: 0.78; letter-spacing: -0.05em;
          white-space: nowrap;
          background: linear-gradient(180deg, rgba(22,20,31,0.20) 0%, rgba(22,20,31,0.06) 62%, rgba(22,20,31,0.02) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }

        /* ── the subject ──
           She spans both rows and lands on the floor of the scene, so the cards
           on the bottom row cut across her waist the way they do in a print
           spread. The drop-shadow is baked into her own layer and never
           re-rasterises: only the transform moves on scroll. */
        .cc-sl-subject {
          grid-column: 2; grid-row: 1 / 3; align-self: end; justify-self: center;
          z-index: 1; pointer-events: none;
          width: clamp(300px, 33vw, 600px);
          will-change: transform;
        }
        .cc-sl-subject img {
          width: 100%; height: auto; display: block;
          filter: drop-shadow(0 26px 34px rgba(22,20,31,0.26));
        }

        /* ── left: the pitch ── */
        /* 36ch, not 32: at 32 the two buttons no longer fit on one line and the
           pair breaks into a stack on wide screens */
        .cc-sl-copy {
          grid-column: 1; grid-row: 1 / 3; align-self: center; z-index: 2;
          max-width: 36ch; padding-bottom: clamp(36px, 5vw, 86px);
        }
        .cc-sl-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px;
          color: ${ACCENT_INK}; margin: 0 0 clamp(12px, 1.4vw, 20px);
        }
        .cc-sl-eyebrow::before { content: ''; width: clamp(26px, 4vw, 54px); height: 1px; background: ${ACCENT}; opacity: 0.6; }
        .cc-sl-h2 {
          font-family: 'Eloma Sans', sans-serif; 
          font-size: clamp(36px, 3.9vw, 66px); line-height: 1.0; letter-spacing: -0.03em;
          margin: 0; color: ${TEXT};
        }
        .cc-sl-h2 .accent { color: ${ACCENT}; }
        .cc-sl-lead {
          font-family: 'Eloma Sans', sans-serif; margin: clamp(14px, 1.5vw, 22px) 0 0;
          font-size: clamp(15px, 1.15vw, 18px); line-height: 1.75; color: ${MUTED};
        }
        .cc-sl-btns { display: flex; flex-wrap: wrap; gap: 10px; margin-top: clamp(20px, 2.2vw, 32px); }
        .cc-sl-btn {
          display: inline-flex; align-items: center; gap: 9px; min-height: 48px;
          padding: 0 clamp(18px, 1.5vw, 26px); border-radius: 100px; text-decoration: none;
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(11px, 0.78vw, 13px); letter-spacing: 1.6px;
          transition: transform .5s cubic-bezier(.16,1,.3,1), box-shadow .35s ease, background .35s ease, color .3s ease;
          will-change: transform;
        }
        .cc-sl-btn.solid {
          color: #fff; background: ${GLOSS};
          box-shadow: ${ACCENT_RIM}, ${ACCENT_CAST};
        }
        .cc-sl-btn.solid:hover { transform: translateY(-2px); box-shadow: ${ACCENT_RIM}, 0 4px 8px rgba(74,61,191,0.36), 0 20px 34px -12px rgba(74,61,191,0.6); }
        .cc-sl-btn.ghost {
          color: ${TEXT}; background: #FFFFFF;
          box-shadow: inset 0 0 0 1px rgba(22,20,31,0.12), 0 8px 18px -12px rgba(22,20,31,0.5);
        }
        .cc-sl-btn.ghost:hover { transform: translateY(-2px); color: ${ACCENT_INK}; box-shadow: inset 0 0 0 1px rgba(153,142,255,0.4), 0 12px 24px -12px rgba(22,20,31,0.5); }
        .cc-sl-btn svg { flex-shrink: 0; }

        /* ── bottom centre: the two cards, over her ── */
        .cc-sl-cards {
          grid-column: 2; grid-row: 2; align-self: end; z-index: 2;
          display: flex; justify-content: center; gap: clamp(10px, 1vw, 16px);
          margin-bottom: clamp(22px, 2.6vw, 44px);
        }
        .cc-sl-card {
          width: clamp(146px, 14.6vw, 224px);
          padding: clamp(12px, 1.05vw, 18px);
          border-radius: clamp(14px, 1.3vw, 22px);
        }
        /* Real frosted glass: you can still read her suit through it. The trick
           that keeps the copy legible over a near-black jacket is the brightness
           lift in the backdrop-filter - it raises the blurred backdrop before
           the white wash goes on, so the pane can stay genuinely transparent
           instead of being faked with a near-opaque fill.
           The blur is confined to this one small, fixed-size card - never a
           scroll-pinned surface. */
        .cc-sl-card.glass {
          /* filter order matters: flatten the backdrop first (contrast), then
             lift it (brightness). The other way round the near-black jacket just
             gets pulled back down and the pane stays a muddy grey. */
          background: linear-gradient(150deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.42) 100%);
          -webkit-backdrop-filter: blur(24px) contrast(0.6) brightness(1.95) saturate(1.3);
          backdrop-filter: blur(24px) contrast(0.6) brightness(1.95) saturate(1.3);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.9),
            inset 0 0 0 1px rgba(255,255,255,0.5),
            0 20px 38px -24px rgba(22,20,31,0.55);
        }
        /* the frost is never as light as paper, so the copy on it goes full ink */
        .cc-sl-card.glass p { color: ${TEXT}; }
        .cc-sl-card.solid {
          background: #FFFFFF;
          box-shadow:
            inset 0 0 0 1px rgba(22,20,31,0.07),
            0 20px 38px -24px rgba(22,20,31,0.5);
        }
        .cc-sl-chip {
          width: 34px; height: 34px; border-radius: 11px; display: grid; place-items: center;
          color: ${ACCENT_INK}; background: rgba(153,142,255,0.12);
          box-shadow: inset 0 0 0 1px rgba(153,142,255,0.2);
          margin-bottom: 10px;
        }
        .cc-sl-card h3 {
          margin: 0 0 6px; font-family: 'Eloma Sans', sans-serif; text-transform: uppercase;
          font-size: clamp(11px, 0.78vw, 13px); letter-spacing: 1.8px; color: ${TEXT};
        }
        .cc-sl-card p {
          margin: 0; font-family: 'Eloma Sans', sans-serif;
          font-size: clamp(13px, 0.92vw, 14px); line-height: 1.55; color: ${MUTED};
        }

        /* ── right: the crew, and the number ── */
        .cc-sl-side {
          grid-column: 3; grid-row: 1 / 3; align-self: center; z-index: 2;
          display: flex; flex-direction: column; align-items: flex-end;
          gap: clamp(12px, 1.3vw, 20px); padding-bottom: clamp(36px, 5vw, 86px);
        }
        .cc-sl-crew {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 8px 16px 8px 8px; border-radius: 100px; background: #FFFFFF;
          box-shadow: inset 0 0 0 1px rgba(22,20,31,0.07), 0 16px 32px -22px rgba(22,20,31,0.5);
        }
        .cc-sl-faces { display: flex; }
        .cc-sl-faces img {
          width: 36px; height: 36px; border-radius: 50%; display: block; object-fit: cover;
          box-shadow: 0 0 0 2px #FFFFFF, 0 1px 3px rgba(22,20,31,0.28);
        }
        .cc-sl-faces img + img { margin-left: -11px; }
        .cc-sl-crew span {
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.72vw, 12px); letter-spacing: 1.8px; color: ${TEXT};
          display: inline-flex; align-items: center; gap: 8px; white-space: nowrap;
        }
        /* the live dot: a slow, linear pulse, transform and opacity only */
        .cc-sl-live {
          width: 8px; height: 8px; border-radius: 50%; background: ${ACCENT}; flex-shrink: 0;
          box-shadow: 0 0 0 3px rgba(153,142,255,0.18);
          animation: cc-sl-beat 2.4s linear infinite;
        }
        @keyframes cc-sl-beat {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.45; transform: scale(0.82); }
        }
        /* ── the dial ──
              Not another rounded card. The number is read off a ring that fills
              to the figure it is quoting, and the whole thing sits straight on
              the scene with only a hairline to hold it. */
        .cc-sl-meter {
          display: flex; align-items: center; gap: clamp(12px, 1.2vw, 20px);
          padding-top: clamp(12px, 1.2vw, 18px);
          border-top: 1px solid rgba(22,20,31,0.14);
        }
        .cc-sl-dial { position: relative; flex-shrink: 0; width: clamp(84px, 7.6vw, 116px); aspect-ratio: 1; }
        .cc-sl-dial svg { width: 100%; height: 100%; display: block; transform: rotate(-90deg); }
        .cc-sl-dial .track { fill: none; stroke: rgba(22,20,31,0.10); stroke-width: 7; }
        .cc-sl-dial .arc   { fill: none; stroke: url(#cc-sl-arc); stroke-width: 7; stroke-linecap: round; }
        .cc-sl-dial b {
          position: absolute; inset: 0; display: grid; place-items: center;
          font-family: 'Eloma Sans', sans-serif; font-weight: 900;
          font-size: clamp(20px, 1.9vw, 29px); letter-spacing: -0.04em; color: ${TEXT};
        }
        .cc-sl-meter-t { display: flex; flex-direction: column; gap: 6px; text-align: left; }
        .cc-sl-meter-t strong {
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(11px, 0.78vw, 13px); letter-spacing: 1.8px; color: ${ACCENT_INK};
        }
        .cc-sl-meter-t span {
          font-family: 'Eloma Sans', sans-serif; font-size: clamp(13px, 0.95vw, 15px);
          line-height: 1.5; color: ${MUTED}; max-width: 22ch;
        }

        /* ── the strip under the scene ── */
        .cc-sl-trust {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: clamp(16px, 2vw, 40px);
          margin-top: clamp(22px, 2.6vw, 44px);
          padding: 0 clamp(4px, 1vw, 20px);
        }
        .cc-sl-trust-l { display: flex; align-items: center; gap: clamp(12px, 1.3vw, 20px); }
        .cc-sl-trust-l p {
          margin: 0; max-width: 34ch;
          font-family: 'Eloma Sans', sans-serif; font-size: clamp(14px, 1.05vw, 16px);
          line-height: 1.55; color: ${MUTED};
        }
        .cc-sl-trust-r { display: flex; align-items: baseline; gap: clamp(10px, 1vw, 16px); }
        .cc-sl-trust-r b {
          font-family: 'Eloma Sans', sans-serif; font-weight: 900;
          font-size: clamp(38px, 4vw, 68px); line-height: 1; letter-spacing: -0.045em; color: ${TEXT};
        }
        .cc-sl-trust-r span {
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(11px, 0.78vw, 13px); letter-spacing: 2.2px; color: ${MUTED};
        }

        @media (min-width: 1920px) { .cc-sl-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-sl-inner { max-width: 2400px; } }

        /* ── tablet: the outer columns give up their width first ── */
        @media (max-width: 1180px) {
          .cc-sl-scene { grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr) minmax(0, 0.92fr); }
          .cc-sl-cards { flex-direction: column; align-items: center; }
          .cc-sl-card { width: clamp(170px, 26vw, 230px); }
          .cc-sl-subject { width: clamp(260px, 32vw, 420px); }
        }

        /* ── mobile: the scene unstacks. Everything is in source order already,
              so the grid just collapses to one column. ── */
        @media (max-width: 900px) {
          .cc-sl-scene {
            grid-template-columns: minmax(0, 1fr);
            grid-template-rows: auto;
            min-height: 0;
            padding: clamp(24px, 6vw, 40px) clamp(18px, 4vw, 32px) clamp(24px, 6vw, 40px);
            gap: clamp(20px, 5vw, 32px);
          }
          .cc-sl-copy, .cc-sl-subject, .cc-sl-cards, .cc-sl-side {
            grid-column: 1; grid-row: auto; align-self: auto; justify-self: stretch;
            padding-bottom: 0; margin-bottom: 0;
          }
          .cc-sl-copy { max-width: none; }
          .cc-sl-subject { width: clamp(220px, 62vw, 380px); justify-self: center; }
          /* stacked, the wordmark has to clear the lead copy and land behind her
             head - anywhere higher and it prints straight through the paragraph */
          .cc-sl-word { font-size: clamp(72px, 26vw, 150px); top: clamp(320px, 90vw, 400px); }
          .cc-sl-cards { flex-direction: row; flex-wrap: wrap; }
          .cc-sl-card { width: 100%; max-width: none; flex: 1 1 200px; }
          .cc-sl-side { flex-direction: column; align-items: stretch; }
          .cc-sl-crew { align-self: flex-start; }
          .cc-sl-meter-t span { max-width: none; }
          .cc-sl-trust { justify-content: flex-start; }
        }

        @media (max-width: 560px) {
          /* stacked, flex-basis reads as a min-height and leaves the cards half
             empty - so the cards go back to sizing off their own content */
          .cc-sl-cards { flex-direction: column; }
          .cc-sl-cards .cc-sl-card { flex: none; width: 100%; }
          .cc-sl-trust-l { flex-direction: column; align-items: flex-start; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-sl-btn { transition: none; }
          .cc-sl-live { animation: none; }
        }
      `}</style>

      <div className="cc-sl-inner">
        <motion.div
          className="cc-sl-scene"
          ref={sceneRef}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <span className="cc-sl-glow" aria-hidden />
          <span className="cc-sl-ring" aria-hidden />
          <span className="cc-sl-word" aria-hidden>Nexa</span>

          {/* ── left: the pitch ── */}
          <div className="cc-sl-copy">
            <motion.p className="cc-sl-eyebrow" variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
              Always On
            </motion.p>
            <MaskReveal as="h2" className="cc-sl-h2" delay={0.05}>
              Human support, <span className="accent">never off duty</span>
            </MaskReveal>
            <motion.p
              className="cc-sl-lead"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              transition={{ delay: 0.15, duration: 0.85, ease: EASE }}
            >
              One trained pod covering voice, chat, email and the admin behind them - answering
              in your brand's name, in every hour you are closed.
            </motion.p>
            <motion.div
              className="cc-sl-btns"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              transition={{ delay: 0.24, duration: 0.85, ease: EASE }}
            >
              <Link className="cc-sl-btn solid" to="/services">
                Our services
                <ArrowRight size={16} strokeWidth={2.6} aria-hidden />
              </Link>
              <Link className="cc-sl-btn ghost" to="/contact#write">Contact us</Link>
            </motion.div>
          </div>

          {/* ── centre: the subject, standing on the floor of the scene ── */}
          <motion.div className="cc-sl-subject" style={reduce ? undefined : { y: lift }}>
            <img
              src="/images/spotlight/agent.webp"
              alt="Client services lead in a suit, standing with her arms folded"
              width={903}
              height={1628}
              decoding="async"
              loading="lazy"
            />
          </motion.div>

          {/* ── bottom centre: two cards, cutting across her ── */}
          <motion.div
            className="cc-sl-cards"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            transition={{ delay: 0.3, duration: 0.85, ease: EASE }}
          >
            <div className="cc-sl-card glass">
              <span className="cc-sl-chip" aria-hidden><Clock size={17} strokeWidth={2.2} /></span>
              <h3>Answered in seconds</h3>
              <p>Calls, chats and emails picked up while your market sleeps.</p>
            </div>
            <div className="cc-sl-card solid">
              <span className="cc-sl-chip" aria-hidden><Users size={17} strokeWidth={2.2} /></span>
              <h3>One trained pod</h3>
              <p>The same team behind every channel, briefed on your product.</p>
            </div>
          </motion.div>

          {/* ── right: the crew, and the number that matters ── */}
          <motion.div
            className="cc-sl-side"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            transition={{ delay: 0.2, duration: 0.85, ease: EASE }}
          >
            <div className="cc-sl-crew">
              <span className="cc-sl-faces">
                {CREW.map((src, i) => (
                  <img key={src} src={src} alt="" width={36} height={36} decoding="async" loading="lazy" aria-hidden={i > 0} />
                ))}
              </span>
              <span>
                <i className="cc-sl-live" aria-hidden />
                On shift right now
              </span>
            </div>
            <div className="cc-sl-meter">
              <div className="cc-sl-dial">
                <svg viewBox="0 0 120 120" aria-hidden focusable="false">
                  <defs>
                    <linearGradient id="cc-sl-arc" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#C3BCFF" />
                      <stop offset="55%" stopColor={ACCENT} />
                      <stop offset="100%" stopColor="#4A3DBF" />
                    </linearGradient>
                  </defs>
                  <circle className="track" cx="60" cy="60" r="52" />
                  {/* one-shot fill on reveal - a small SVG, never scroll-linked */}
                  <motion.circle
                    className="arc"
                    cx="60"
                    cy="60"
                    r="52"
                    strokeDasharray={ARC}
                    initial={reduce ? { strokeDashoffset: ARC * (1 - RATE) } : { strokeDashoffset: ARC }}
                    whileInView={{ strokeDashoffset: ARC * (1 - RATE) }}
                    viewport={VIEWPORT}
                    transition={{ duration: 1.4, ease: EASE, delay: 0.25 }}
                  />
                </svg>
                <b>92%</b>
              </div>
              <div className="cc-sl-meter-t">
                <strong>First contact fix</strong>
                <span>Closed on the first call, with no ticket bounced back to you.</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── the strip under the scene ── */}
        <motion.div className="cc-sl-trust" variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          <div className="cc-sl-trust-l">
            <span className="cc-sl-faces">
              {TRUST.map((src) => (
                <img key={src} src={src} alt="" width={36} height={36} decoding="async" loading="lazy" aria-hidden />
              ))}
            </span>
            <p>Trusted by teams in e-commerce, SaaS, healthcare, logistics and fintech.</p>
          </div>
          <div className="cc-sl-trust-r">
            <b>10+</b>
            <span>Years on the phones</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
