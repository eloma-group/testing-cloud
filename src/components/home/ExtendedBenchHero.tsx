import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { fadeUp, popUp, staggerParent, MaskReveal, VIEWPORT } from '../../lib/anim'
import { AnimatedNetwork } from './AnimatedNetwork'
import { FlipImageCard } from './FlipImageCard'
import { FloatingWorldClock } from './FloatingWorldClock'

const TEXT       = '#16141F'
const ACCENT     = '#998EFF'
const ACCENT_INK = '#6A5BE8'

/* ──────────────────────────────────────────────────────────────
   The extended bench - the hero-scale band under Industries.

   Left: the claim, one gradient phrase, a cord-and-node
   constellation echoing the switchboard. Right: two glass
   frames of the people who actually answer, turning over every
   few seconds, with the world clock strip floating across the
   bottom. The right stage leans a few degrees after the cursor,
   springs doing the easing, so the stack reads as an object
   rather than a picture.
   ────────────────────────────────────────────────────────────── */

const FACES = {
  a: { src: '/images/home/bench/bench-1.jpg', alt: 'Support agent laughing at her laptop during a client call' },
  b: { src: '/images/home/bench/bench-2.jpg', alt: 'Agent in a check blazer taking a call by the office window' },
  c: { src: '/images/home/bench/bench-3.jpg', alt: 'Agent smiling on a call outside the office with a tablet in hand' },
  d: { src: '/images/home/bench/bench-4.jpg', alt: 'Agent in glasses working through a customer call at her desk' },
}

export function ExtendedBenchHero() {
  const reduce = useReducedMotion() ?? false

  /* the stage leans after the cursor: two springs, ±3.5deg */
  const stageRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-3.5, 3.5]), { stiffness: 120, damping: 18 })
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3.5, -3.5]), { stiffness: 120, damping: 18 })

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !stageRef.current) return
    const r = stageRef.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onPointerLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <section className="xb" aria-label="The extended bench for your brand">
      <style>{`
        .xb {
          position: relative; isolation: isolate; overflow: hidden;
          background: linear-gradient(180deg, #FFFFFF 0%, #FAF9FE 40%, #F4F2FD 100%);
          padding: clamp(56px, 8vw, 132px) clamp(24px, 4vw, 64px);
        }

        /* ── soft abstract ground: two blurred blobs, one seam ── */
        .xb-blob { position: absolute; z-index: 0; pointer-events: none; border-radius: 50%; }
        .xb-blob.one {
          width: 56vw; height: 56vw; right: -16vw; top: -18vw;
          background: radial-gradient(circle at 40% 40%, rgba(153,142,255,0.2), rgba(153,142,255,0.07) 46%, transparent 70%);
        }
        .xb-blob.two {
          width: 44vw; height: 44vw; left: -18vw; bottom: -20vw;
          background: radial-gradient(circle at 55% 45%, rgba(46,186,198,0.1), rgba(153,142,255,0.06) 50%, transparent 72%);
        }

        /* ── the network ribbon: in-flow between the lead and the CTA,
               spilling off the left edge and fading toward the stage.
               The slot keeps the old flow height; the drawing inside is
               oversized and centre-bled so it reads bigger without
               stretching the section. ── */
        .xb-net {
          position: relative; z-index: 0; pointer-events: none;
          height: clamp(100px, 13vw, 242px);
          margin: clamp(2px, 0.6vw, 10px) 0 clamp(26px, 3vw, 48px)
                  calc(-1 * clamp(24px, 4vw, 64px));
        }
        .xb-net .an {
          position: absolute; left: 0; top: 50%;
          transform: translateY(-50%);
          width: min(58vw, 1080px);
          -webkit-mask-image: linear-gradient(90deg, #000 72%, transparent 99%);
          mask-image: linear-gradient(90deg, #000 72%, transparent 99%);
        }

        /* ── the right-edge data lines, ticking softly ── */
        .xb-lines { position: absolute; z-index: 0; right: 0; top: 58%; width: clamp(80px, 9vw, 170px); pointer-events: none; }
        .xb-lines line {
          stroke: ${ACCENT}; stroke-width: 1.2; stroke-dasharray: 2 5; stroke-linecap: round;
          opacity: 0.4; animation: xb-tick 4.8s ease-in-out infinite;
        }
        @keyframes xb-tick { 0%, 100% { opacity: 0.14; } 50% { opacity: 0.42; } }

        .xb-in { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }
        @media (min-width: 1920px) { .xb-in { max-width: 1900px; } }
        @media (min-width: 2560px) { .xb-in { max-width: 2400px; } }

        .xb-grid {
          display: grid; grid-template-columns: minmax(0, 45fr) minmax(0, 55fr);
          gap: clamp(36px, 5vw, 96px); align-items: center;
          min-height: min(90vh, 940px);
        }

        /* ── left: the claim ── */
        .xb h2 {
          margin: 0 0 clamp(20px, 2.4vw, 34px);
          font-family: 'Eloma Sans', sans-serif; letter-spacing: -0.01em;
          text-transform: uppercase;
          font-size: clamp(36px, 4.4vw, 80px); line-height: 1.12; color: ${TEXT}; max-width: 20ch;
        }
        .xb h2 .hl  { color: ${ACCENT}; }
        .xb h2 .hl2 { color: #BCB4F7; }
        .xb-lead {
          margin: 0 0 clamp(16px, 1.8vw, 28px);
          font-family: 'Eloma Sans', sans-serif;
          font-size: clamp(14px, 1.25vw, 19px); line-height: 1.65; color: #4A4756;
          max-width: 46ch;
        }
        .xb-cta {
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 52px; padding: 16px 36px; border-radius: 14px;
          background: linear-gradient(180deg, #988DEC 0%, #8A7EE4 100%);
          font-family: 'Eloma Sans', sans-serif; font-weight: 600; text-transform: uppercase;
          font-size: clamp(12px, 0.95vw, 15px); letter-spacing: 1.2px;
          color: #FFFFFF; text-decoration: none;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.35),
            0 14px 28px -14px rgba(108,95,220,0.7);
          will-change: transform;
          transition: transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s cubic-bezier(.16,1,.3,1);
        }
        .xb-cta:hover, .xb-cta:focus-visible {
          transform: translateY(-3px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.35),
            0 22px 40px -16px rgba(108,95,220,0.8);
        }
        .xb-cta:focus-visible { outline: 2px solid ${ACCENT_INK}; outline-offset: 3px; }

        /* ── the since-2014 baseline row ── */
        .xb-foot {
          display: flex; align-items: center; gap: clamp(18px, 2.4vw, 40px);
          margin-top: clamp(44px, 5vw, 84px);
        }
        .xb-foot > span {
          flex: none;
          font-family: 'Eloma Sans', sans-serif; font-weight: 500;
          font-size: clamp(13px, 1.05vw, 17px); color: #4A4756;
        }
        .xb-foot > i { flex: 1; height: 1px; background: rgba(22,20,31,0.45); }
        .xb-arrows { flex: none; display: inline-flex; align-items: center; gap: 22px; }
        .xb-arrows svg:first-child { color: #C7C4D6; }
        .xb-arrows svg:last-child  { color: ${TEXT}; }

        /* ── right: the stage ── */
        .xb-stage { position: relative; perspective: 1600px; padding-bottom: clamp(18px, 2vw, 32px); }

        /* soft gradient wash above the photos */
        .xb-topwash {
          position: absolute; z-index: 0; pointer-events: none;
          left: -4%; right: -14%; top: -18%; height: 52%;
          border-radius: 50%;
          background: rgba(203,195,244,0.55);
          filter: blur(46px);
        }
        /* offset skewed backplate peeking out left of the left frame */
        .xb-back {
          position: absolute; z-index: 0; pointer-events: none;
          left: -3%; top: -2.5%; width: 54%; aspect-ratio: 3 / 4;
          border-radius:
            clamp(86px, 8.8vw, 172px) clamp(12px, 1.3vw, 22px)
            clamp(86px, 8.8vw, 172px) clamp(12px, 1.3vw, 22px);
          transform: skewX(-8deg);
          background: linear-gradient(200deg, rgba(211,203,245,0.95) 0%, rgba(211,203,245,0.55) 60%, rgba(211,203,245,0.2) 100%);
        }
        /* the lavender strip: rises from the section's bottom edge, slips
           behind the left frame's bottom, sweeps across and exits behind
           the right frame's right border with a rounded tip */
        .xb-band {
          position: absolute; z-index: 0; pointer-events: none;
          left: -4%; right: -18%; top: -12%; bottom: -40%;
        }
        .xb-band svg { display: block; width: 100%; height: 100%; overflow: visible; }

        .xb-tilt { position: relative; z-index: 1; transform-style: preserve-3d; will-change: transform; }
        .xb-cards {
          display: grid; grid-template-columns: 52fr 48fr;
          gap: clamp(26px, 3.2vw, 60px); align-items: start;
        }
        .xb-card-a { position: relative; z-index: 2; }
        .xb-card-b {
          position: relative; z-index: 1;
          transform: translateY(clamp(18px, 2.4vw, 40px));
        }
        .xb-card-a, .xb-card-b { will-change: transform; animation: xb-drift 9s ease-in-out infinite alternate; }
        .xb-card-b { animation-delay: 2.2s; animation-direction: alternate-reverse; }
        @keyframes xb-drift {
          from { translate: 0 -6px; }
          to   { translate: 0 6px; }
        }

        .xb-clock {
          position: absolute; z-index: 4;
          left: 22%; bottom: -7%;
          width: min(56%, 470px);
        }
        .xb-247 {
          position: absolute; z-index: 3; right: -3%; bottom: 17%;
          display: inline-flex; align-items: center;
          padding: 12px 16px; border-radius: 14px;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.7), 0 14px 30px -18px rgba(40,32,100,0.4);
          font-family: 'Eloma Sans', sans-serif; font-weight: 600;
          font-size: clamp(13px, 1.05vw, 17px); letter-spacing: 0.02em; color: #55525F;
          will-change: transform; animation: xb-drift 8s ease-in-out 1.4s infinite alternate;
        }

        /* ── responsive ── */
        @media (max-width: 1023px) {
          .xb-grid { grid-template-columns: minmax(0, 1fr); min-height: 0; gap: clamp(44px, 7vw, 72px); }
          .xb h2 { max-width: 18ch; }
          .xb-stage { max-width: 640px; margin: 0 auto; width: 100%; }
          .xb-net { display: none; }
        }
        @media (max-width: 560px) {
          .xb-247 { display: none; }
          .xb-clock { width: 84%; left: 8%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .xb-card-a, .xb-card-b, .xb-247 { animation: none; }
          .xb-lines line { animation: none; }
        }
      `}</style>

      <div className="xb-blob one" aria-hidden />
      <div className="xb-blob two" aria-hidden />
      <svg className="xb-lines" viewBox="0 0 180 140" aria-hidden focusable="false">
        {[0, 18, 8, 26, 4, 20, 12, 28, 2, 16].map((x1, i) => (
          <line
            key={i}
            x1={x1}  y1={6 + i * 12 + (i > 4 ? 22 : 0)}
            x2={180} y2={6 + i * 12 + (i > 4 ? 22 : 0)}
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </svg>

      <div className="xb-in">
        <div className="xb-grid">
          {/* ── left ── */}
          <motion.div
            variants={staggerParent(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <MaskReveal as="h2" delay={0.08}>
              The extended <span className="hl">bench</span> for <span className="hl2">your</span> brand
            </MaskReveal>
            <motion.p className="xb-lead" variants={fadeUp}>
              Nexa, a premier BPO partner established in 2014, elevates every customer
              interaction. For over a decade, we have curated and managed expert teams
              that act as a seamless, 24/7 extension of your brand identity.
            </motion.p>
            <div className="xb-net" aria-hidden>
              <AnimatedNetwork />
            </div>
            <motion.div variants={fadeUp}>
              <Link className="xb-cta" to="/contact#write">
                Consult with our experts
              </Link>
            </motion.div>
          </motion.div>

          {/* ── right ── */}
          <div
            className="xb-stage"
            ref={stageRef}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          >
            <div className="xb-topwash" aria-hidden />
            <div className="xb-band" aria-hidden>
              <svg viewBox="0 0 900 900" preserveAspectRatio="none" focusable="false" role="presentation">
                <defs>
                  <linearGradient id="xb-band-grad" x1="0.2" y1="1" x2="0.9" y2="0">
                    <stop offset="0"   stopColor="rgba(203,195,244,0.5)" />
                    <stop offset="0.5" stopColor="rgba(203,195,244,0.9)" />
                    <stop offset="1"   stopColor="rgba(211,203,245,0.95)" />
                  </linearGradient>
                </defs>
                <path
                  d="M 130 1000 C 180 650 400 530 590 500 C 740 476 870 400 1010 250"
                  fill="none"
                  stroke="url(#xb-band-grad)"
                  strokeWidth="240"
                  strokeLinecap="butt"
                />
              </svg>
            </div>
            <div className="xb-back" aria-hidden />
            <motion.div className="xb-tilt" style={reduce ? undefined : { rotateX, rotateY }}>
              <motion.div
                className="xb-cards"
                variants={staggerParent(0.14, 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                <motion.div className="xb-card-a" variants={popUp}>
                  <FlipImageCard
                    front={FACES.a}
                    back={FACES.c}
                    label="Flip to meet another agent on the bench"
                    startDelay={0}
                  />
                </motion.div>
                <motion.div className="xb-card-b" variants={popUp}>
                  <FlipImageCard
                    front={FACES.b}
                    back={FACES.d}
                    label="Flip to meet another agent on the bench"
                    startDelay={900}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="xb-clock"
              variants={popUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <FloatingWorldClock />
            </motion.div>
            <span className="xb-247" aria-label="Available 24 hours, 7 days">24/7</span>
          </div>
        </div>

        <motion.div
          className="xb-foot"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <span>Since 2014</span>
          <i aria-hidden />
          <span className="xb-arrows" aria-hidden>
            <svg width="26" height="16" viewBox="0 0 26 16" fill="none">
              <path d="M25 8H2M7.5 2.5 2 8l5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg width="26" height="16" viewBox="0 0 26 16" fill="none">
              <path d="M1 8h23M18.5 2.5 24 8l-5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </motion.div>
      </div>
    </section>
  )
}
