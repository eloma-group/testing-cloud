import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Headphones, Users, MessageSquare, BarChart3, Heart, ArrowRight } from 'lucide-react'
import { MaskReveal } from '../../lib/anim'

/* ──────────────────────────────────────────────────────────────
   Real People, Real Conversations - a headset built from photo
   tiles of the support floor, sitting beside the message.

   The headset is a single pre-cut transparent PNG (background
   flood-filled out, trimmed to the artwork, so it drops onto any
   surface). The centre copy is absolutely placed into the open
   ear-hole. Nothing animates but transform + opacity, so the
   whole block stays compositor-only and 120fps-safe.
   ────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const INK   = '#0B1B33'   // deep navy - headings
const BLUE  = '#3B5BFF'   // royal blue - accent
const MUTED = '#5E6A7D'   // secondary text
const BG    = '#F6F7FA'   // near-white page

/* the pre-cut headset artwork - trimmed to its own bounds */
const HEADSET = { src: '/images/home/headset-collage.webp', w: 838, h: 910 }

type Feature = { key: string; a: string; b: string; color: string; tint: string; icon: 'headset' | 'users' | 'chat' | 'chart' }
const FEATURES: Feature[] = [
  { key: 'support', a: '24/7',     b: 'Support',      color: '#3B5BFF', tint: 'rgba(59,91,255,0.10)',   icon: 'headset' },
  { key: 'agents',  a: 'Expert',   b: 'Agents',       color: '#1FA971', tint: 'rgba(31,169,113,0.12)',  icon: 'users' },
  { key: 'quick',   a: 'Quick',    b: 'Response',     color: '#8B7FF5', tint: 'rgba(139,127,245,0.14)', icon: 'chat' },
  { key: 'csat',    a: 'Customer', b: 'Satisfaction', color: '#E8657A', tint: 'rgba(232,101,122,0.12)', icon: 'chart' },
]

function FeatureIcon({ icon, color }: { icon: Feature['icon']; color: string }) {
  const p = { size: 22, strokeWidth: 2.1, color, 'aria-hidden': true } as const
  switch (icon) {
    case 'headset': return <Headphones {...p} />
    case 'users':   return <Users {...p} />
    case 'chat':    return <MessageSquare {...p} />
    case 'chart':   return <BarChart3 {...p} />
  }
}

/* Audio waveform - a run of rounded bars. */
function Waveform({ className, color = BLUE, bars }: { className?: string; color?: string; bars?: number[] }) {
  const hs = bars ?? [7, 13, 22, 32, 20, 11, 26, 38, 24, 14, 30, 18, 9, 16, 8]
  const gap = 5
  const bw = 3
  const W = hs.length * gap
  return (
    <svg className={className} viewBox={`0 0 ${W} 44`} preserveAspectRatio="xMidYMid meet" aria-hidden>
      {hs.map((h, i) => (
        <rect key={i} x={i * gap} y={22 - h / 2} width={bw} height={h} rx={bw / 2} fill={color} />
      ))}
    </svg>
  )
}

export function RealPeople() {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)

  const rise = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-70px' },
    transition: { delay: d, duration: 0.8, ease: EASE },
  })

  return (
    <section className="cc-rp" id="real-people" aria-label="Real people, real conversations">
      <style>{`
        .cc-rp { position: relative; overflow: hidden; background: ${BG};
          background-image: radial-gradient(120% 90% at 82% 8%, #FFFFFF 0%, ${BG} 55%); }
        .cc-rp-inner {
          position: relative; z-index: 1;
          max-width: min(calc(100vw - 96px), 1820px); margin: 0 auto;
          padding: clamp(56px, 8vw, 132px) clamp(20px, 2.4vw, 40px);
          display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
          gap: clamp(28px, 4vw, 64px); align-items: center;
        }

        /* ── left: the message ── */
        .cc-rp-h {
          font-family: 'Universal Sans', sans-serif; color: ${INK};
          font-size: clamp(40px, 6.2vw, 90px); line-height: 1.0; letter-spacing: -0.035em;
          margin: 0; max-width: 15ch;
        }
        .cc-rp-h .b { color: ${BLUE}; }

        .cc-rp-wave { display: flex; align-items: center; gap: 12px; margin: clamp(20px, 2.4vw, 32px) 0 clamp(18px, 2vw, 26px); }
        .cc-rp-wave i { width: clamp(26px, 3vw, 44px); height: 2px; border-radius: 2px; background: ${BLUE}; flex: none; }
        .cc-rp-wave svg { height: clamp(22px, 2.4vw, 30px); width: auto; display: block; }

        .cc-rp-sub {
          font-family: 'Universal Sans', sans-serif; font-weight: 400; color: ${MUTED};
          font-size: clamp(15px, 1.3vw, 19px); line-height: 1.7; margin: 0; max-width: 40ch;
        }

        .cc-rp-ctas { display: flex; align-items: center; flex-wrap: wrap; gap: clamp(16px, 2vw, 30px); margin: clamp(26px, 3vw, 40px) 0 clamp(34px, 4.4vw, 60px); }
        .cc-rp-btn {
          display: inline-flex; align-items: center; gap: 12px; min-height: 52px;
          padding: 0 clamp(22px, 2.2vw, 32px); border-radius: 14px;
          background: ${INK}; color: #fff; text-decoration: none;
          font-family: 'Universal Sans', sans-serif; font-weight: 700; letter-spacing: -0.01em;
          font-size: clamp(14px, 1.1vw, 16px);
          box-shadow: 0 18px 34px -18px rgba(11,27,51,0.55);
          transition: transform .4s cubic-bezier(.16,1,.3,1), box-shadow .4s ease; will-change: transform;
        }
        .cc-rp-btn:hover, .cc-rp-btn:focus-visible {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 26px 48px -18px rgba(11,27,51,0.62), 0 0 0 4px rgba(59,91,255,0.16);
        }
        .cc-rp-btn:active { transform: translateY(-1px) scale(0.99); }
        .cc-rp-btn svg { transition: transform .4s cubic-bezier(.16,1,.3,1); }
        .cc-rp-btn:hover svg, .cc-rp-btn:focus-visible svg { transform: translateX(5px); }
        .cc-rp-link {
          display: inline-flex; align-items: center; gap: 9px; min-height: 44px;
          color: ${INK}; text-decoration: none; position: relative;
          font-family: 'Universal Sans', sans-serif; font-weight: 700; font-size: clamp(14px, 1.1vw, 16px);
        }
        .cc-rp-link span { position: relative; }
        .cc-rp-link { transition: color .35s ease; }
        .cc-rp-link span::after { content: ''; position: absolute; left: 0; right: 0; bottom: -3px; height: 2px; background: ${BLUE}; transform-origin: left bottom; transition: transform .4s cubic-bezier(.16,1,.3,1); }
        .cc-rp-link:hover, .cc-rp-link:focus-visible { color: ${BLUE}; }
        .cc-rp-link:hover span::after, .cc-rp-link:focus-visible span::after { transform: scaleY(2); }
        .cc-rp-link svg { color: ${BLUE}; transition: transform .4s cubic-bezier(.16,1,.3,1); }
        .cc-rp-link:hover svg, .cc-rp-link:focus-visible svg { transform: translateX(4px); }

        /* ── feature row ── */
        .cc-rp-feats {
          display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
          border-top: 1px solid rgba(11,27,51,0.12); padding-top: clamp(22px, 2.6vw, 34px);
        }
        .cc-rp-feat { display: flex; flex-direction: column; gap: 10px; padding: 0 clamp(10px, 1.4vw, 22px); }
        .cc-rp-feat + .cc-rp-feat { border-left: 1px solid rgba(11,27,51,0.10); }
        .cc-rp-feat:first-child { padding-left: 0; }
        .cc-rp-disc { width: clamp(44px, 3.6vw, 56px); aspect-ratio: 1; border-radius: 50%; display: grid; place-items: center;
          transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s ease; will-change: transform; }
        /* the icons ship at a fixed size - let them grow with the disc */
        .cc-rp-disc svg { width: 22px; height: auto; transition: transform .45s cubic-bezier(.16,1,.3,1); }
        /* --c is set inline per feature so each tile lifts in its own colour */
        .cc-rp-feat:hover .cc-rp-disc { transform: translateY(-5px) scale(1.08); box-shadow: 0 14px 26px -10px var(--c); }
        .cc-rp-feat:hover .cc-rp-disc svg { transform: scale(1.12); }
        .cc-rp-feat:hover b { color: var(--c); }
        .cc-rp-feat b {
          font-family: 'Universal Sans', sans-serif; font-weight: 800; color: ${INK};
          font-size: clamp(15px, 1.25vw, 19px); line-height: 1.15; letter-spacing: -0.01em;
          transition: color .35s ease;
        }
        .cc-rp-feat b em { display: block; font-style: normal; font-weight: 500; color: ${MUTED};
          font-size: clamp(13px, 1vw, 15px); }

        /* ── right: the headset cut-out ── */
        .cc-rp-stage { position: relative; width: 100%; max-width: clamp(340px, 50vw, 880px); margin: 0 auto; }
        .cc-rp-set {
          width: 100%; height: auto; display: block;
          aspect-ratio: ${HEADSET.w} / ${HEADSET.h};
        }
        .cc-rp-stage::before {
          content: ''; position: absolute; z-index: 0; pointer-events: none;
          left: 49.9%; top: 46.4%; transform: translate(-50%, -50%);
          width: 52%; aspect-ratio: 1; border-radius: 50%;
          background: radial-gradient(closest-side, rgba(59,91,255,0.10), transparent 72%);
        }

        /* ── centre message, sitting in the ear-hole. the 49.9/46.4 anchor is
           the centre of the largest circle that fits inside the open hole
           (measured off the artwork's alpha), so the block reads as optically
           centred rather than page-centred.

           The hole box is centred with negative margins, NOT a transform:
           Framer Motion owns the transform on the inner element, so a
           translate(-50%,-50%) here would be overwritten the moment the
           reveal runs and the copy would sit half a box down and right.
           Percentage margins resolve against the container WIDTH, and the
           box is a square (aspect-ratio: 1), so -26% is exactly half of it
           on both axes. ── */
        .cc-rp-centre {
          position: absolute; left: 49.9%; top: 46.4%;
          width: 52%; aspect-ratio: 1; margin: -26% 0 0 -26%;
          z-index: 5; display: grid; place-items: center;
        }
        .cc-rp-centre-in { width: 100%; text-align: center; }
        .cc-rp-centre .wf { height: clamp(20px, 2vw, 28px); width: auto; margin: 0 auto clamp(12px, 1.4vw, 18px); display: block; }
        .cc-rp-msg {
          font-family: 'Universal Sans', sans-serif; font-weight: 600; color: ${INK};
          font-size: clamp(15px, 2vw, 33px); line-height: 1.3; letter-spacing: -0.02em; margin: 0;
        }
        .cc-rp-msg .b { color: ${BLUE}; font-weight: 800; }
        .cc-rp-heart { margin: clamp(10px, 1.3vw, 18px) auto 0; color: ${BLUE}; display: block;
          width: clamp(20px, 1.7vw, 30px); height: auto; }

        /* ── large screens only. Everything above is the standard-laptop scale
           and must stay untouched up to 1600px; past that the copy column has
           room to spare, so each clamp restarts from the value it had capped
           at (its min here) and grows from there - no jump at the boundary. ── */
        @media (min-width: 1600px) {
          .cc-rp-sub { font-size: clamp(19px, 1.19vw, 23px); }
          .cc-rp-btn { min-height: clamp(52px, 3.25vw, 68px); padding: 0 clamp(32px, 2vw, 40px);
            font-size: clamp(16px, 1vw, 20px); }
          .cc-rp-link { font-size: clamp(16px, 1vw, 20px); }
          .cc-rp-feat { gap: clamp(10px, 0.65vw, 16px); padding: 0 clamp(22px, 1.375vw, 28px); }
          .cc-rp-disc { width: clamp(56px, 3.5vw, 78px); }
          .cc-rp-disc svg { width: clamp(22px, 1.38vw, 32px); }
          .cc-rp-feat b { font-size: clamp(19px, 1.19vw, 27px); line-height: 1.2; }
          .cc-rp-feat b em { font-size: clamp(15px, 0.94vw, 21px); }
        }

        @media (min-width: 1920px) { .cc-rp-inner { max-width: min(calc(100vw - 110px), 2020px); } }
        @media (min-width: 2560px) { .cc-rp-inner { max-width: min(calc(100vw - 140px), 2400px); } }

        /* ── stack ── */
        @media (max-width: 980px) {
          .cc-rp-inner { grid-template-columns: minmax(0, 1fr); gap: clamp(30px, 6vw, 48px); }
          .cc-rp-stage { order: 2; max-width: min(94vw, 640px); }
          .cc-rp-copy { order: 1; }
          .cc-rp-h { max-width: 18ch; }
        }
        @media (max-width: 520px) {
          .cc-rp-feats { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(20px, 5vw, 28px) 0; border-top: none; padding-top: 0; }
          .cc-rp-feat { padding: 0 6px; }
          .cc-rp-feat + .cc-rp-feat { border-left: none; }
          .cc-rp-feat:nth-child(odd) { border-right: 1px solid rgba(11,27,51,0.10); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-rp-btn, .cc-rp-btn svg, .cc-rp-link, .cc-rp-link svg, .cc-rp-link span::after,
          .cc-rp-disc, .cc-rp-disc svg, .cc-rp-feat b { transition: none; }
          .cc-rp-btn:hover, .cc-rp-feat:hover .cc-rp-disc, .cc-rp-feat:hover .cc-rp-disc svg { transform: none; }
        }
      `}</style>

      <div className="cc-rp-inner" ref={ref}>
        {/* ── message ── */}
        <div className="cc-rp-copy">
          <MaskReveal as="h2" className="cc-rp-h" duration={1}>
            Every Call Matters. <span className="b">Every Customer Counts.</span>
          </MaskReveal>

          <motion.div className="cc-rp-wave" {...rise(0.12)}>
            <i aria-hidden />
            <Waveform color={BLUE} />
          </motion.div>

          <motion.p className="cc-rp-sub" {...rise(0.18)}>
            We turn conversations into connections and issues into solutions.
          </motion.p>

          <motion.div className="cc-rp-ctas" {...rise(0.24)}>
            <Link className="cc-rp-btn gl-shine" to="/contact#write">
              <span>Connect With Us</span>
              <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
            </Link>
            <Link className="cc-rp-link" to="/services">
              <span>Learn more</span> <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
            </Link>
          </motion.div>

          <motion.div className="cc-rp-feats" {...rise(0.3)}>
            {FEATURES.map((ft) => (
              <div className="cc-rp-feat" key={ft.key} style={{ '--c': ft.color } as React.CSSProperties}>
                <span className="cc-rp-disc" style={{ background: ft.tint }}>
                  <FeatureIcon icon={ft.icon} color={ft.color} />
                </span>
                <b>{ft.a}<em>{ft.b}</em></b>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── headset cut-out ── */}
        <div className="cc-rp-stage">
          <motion.img
            className="cc-rp-set"
            src={HEADSET.src}
            width={HEADSET.w}
            height={HEADSET.h}
            decoding="async"
            alt="A headset built from photos of our support floor - agents on calls, a live world map, an analytics dashboard, a desk phone and a studio microphone"
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE }}
          />

          <div className="cc-rp-centre">
            <motion.div className="cc-rp-centre-in"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.5, duration: 0.8, ease: EASE }}>
              <Waveform className="wf" color={BLUE} bars={[8, 16, 26, 14, 30, 20, 10, 22, 12]} />
              <p className="cc-rp-msg">
                Real People.<br />
                Real Conversations.<br />
                <span className="b">Real Solutions.</span>
              </p>
              <Heart className="cc-rp-heart" size={22} strokeWidth={2} aria-hidden />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
