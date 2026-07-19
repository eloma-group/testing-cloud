import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Headphones, Users, MessageSquare, BarChart3, Heart, ArrowRight } from 'lucide-react'
import { MaskReveal } from '../../lib/anim'

/* ──────────────────────────────────────────────────────────────
   Real People, Real Conversations - one headset, cut out of a
   single silhouette into eleven bespoke photo pieces.

   The trick is that NO two pieces share a shape. Each is a
   rounded rectangle with its OWN per-corner radii and tilt, so
   the outer corners trace the smooth headband + ear-cup outline
   while the inner corners stay tight - the eleven only read as a
   3D headset because each one is cut for its own spot. The top
   tile bows into a barrel crown; the boom tapers into a round
   foam mic. Every piece carries its own soft drop-shadow (filter
   on the outer <g>, clip on the inner one, so the shadow is never
   clipped away). Compositor-only, 120fps-safe.
   ────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const INK   = '#0B1B33'   // deep navy - headings
const BLUE  = '#3B5BFF'   // royal blue - accent
const MUTED = '#5E6A7D'   // secondary text
const BG    = '#F6F7FA'   // near-white page

/* ── SVG geometry ── */
const VB_W = 1000
const VB_H = 1080

type Radii = [number, number, number, number]   // tl, tr, br, bl
type Box = { x: number; y: number; w: number; h: number }

/** rounded rect centred at origin; bow bulges the top edge up (barrel crown) */
function rr(w: number, h: number, [tl, tr, br, bl]: Radii, bow = 0) {
  const hw = w / 2, hh = h / 2
  const top = bow > 0 ? `Q 0 ${-hh - bow} ${hw - tr} ${-hh}` : `L ${hw - tr} ${-hh}`
  return [
    `M ${-hw + tl} ${-hh}`,
    top, `Q ${hw} ${-hh} ${hw} ${-hh + tr}`,
    `L ${hw} ${hh - br}`, `Q ${hw} ${hh} ${hw - br} ${hh}`,
    `L ${-hw + bl} ${hh}`, `Q ${-hw} ${hh} ${-hw} ${hh - bl}`,
    `L ${-hw} ${-hh + tl}`, `Q ${-hw} ${-hh} ${-hw + tl} ${-hh}`,
    'Z',
  ].join(' ')
}
/** axis-aligned bounding box of a rotated rect (frames the photo behind it) */
function aabb(cx: number, cy: number, w: number, h: number, rot: number): Box {
  const a = Math.abs((rot * Math.PI) / 180), c = Math.cos(a), s = Math.sin(a)
  const halfW = (w / 2) * c + (h / 2) * s
  const halfH = (w / 2) * s + (h / 2) * c
  return { x: cx - halfW, y: cy - halfH, w: halfW * 2, h: halfH * 2 }
}

type Tile = {
  key: string; src: string; alt: string
  cx: number; cy: number; w: number; h: number; rot: number; r: Radii
  bow?: number; focus?: string
}

/* the nine band pieces - headband crown + two ear columns */
const TILES: Tile[] = [
  { key: 'world',      src: '/images/home/showcase/network.jpg',     alt: 'Global network lighting up with live connections',    cx: 500, cy: 138, w: 322, h: 156, rot: 0,   r: [56, 56, 30, 30], bow: 30 },
  { key: 'womanTL',    src: '/images/home/live-team.webp',           alt: 'Support specialist smiling on a headset call',        cx: 300, cy: 214, w: 182, h: 224, rot: -24, r: [96, 30, 28, 44], focus: 'xMidYMin slice' },
  { key: 'manTR',      src: '/images/home/showcase/agent-man.jpg',   alt: 'Account manager taking a customer call',              cx: 700, cy: 214, w: 182, h: 224, rot: 24,  r: [30, 96, 44, 28], focus: 'xMidYMin slice' },
  { key: 'headphones', src: '/images/home/showcase/headphones.jpg',  alt: 'Professional headset ready at a workstation',         cx: 214, cy: 366, w: 186, h: 176, rot: -20, r: [58, 26, 26, 62] },
  { key: 'dashboard',  src: '/images/home/showcase/dashboard.jpg',   alt: 'Live analytics dashboard tracking call volume',       cx: 208, cy: 536, w: 192, h: 182, rot: -4,  r: [56, 24, 24, 56] },
  { key: 'typing',     src: '/images/home/showcase/typing.jpg',      alt: 'Agent typing up notes with a coffee at hand',         cx: 296, cy: 690, w: 186, h: 186, rot: 16,  r: [30, 28, 40, 88] },
  { key: 'chat',       src: '/images/home/showcase/chat.jpg',        alt: 'Live chat lighting up between customer and agent',     cx: 786, cy: 366, w: 186, h: 176, rot: 20,  r: [26, 58, 62, 26] },
  { key: 'woman2',     src: '/images/home/showcase/agent-woman.jpg', alt: 'Customer service agent listening on a call',          cx: 792, cy: 536, w: 192, h: 182, rot: 4,   r: [24, 56, 56, 24], focus: 'xMidYMin slice' },
  { key: 'phone',      src: '/images/home/showcase/phone.jpg',       alt: 'Desk phone on a busy support floor',                  cx: 704, cy: 690, w: 186, h: 186, rot: -16, r: [28, 30, 88, 40] },
]

const MIC = { cx: 432, cy: 906, r: 84 }
const BOOM = { cx: 606, cy: 848, w: 272, h: 100, rot: -30 }

type Part = Tile & { d: string; tf: string; box: Box }
const PARTS: Part[] = TILES.map((t) => ({
  ...t,
  d: rr(t.w, t.h, t.r, t.bow ?? 0),
  tf: `translate(${t.cx} ${t.cy}) rotate(${t.rot})`,
  box: aabb(t.cx, t.cy, t.w, t.h, t.rot),
}))
const BOOM_D = rr(BOOM.w, BOOM.h, [50, 50, 50, 50])
const BOOM_TF = `translate(${BOOM.cx} ${BOOM.cy}) rotate(${BOOM.rot})`
const boomBox = aabb(BOOM.cx, BOOM.cy, BOOM.w, BOOM.h, BOOM.rot)

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
          max-width: min(calc(100vw - 120px), 1560px); margin: 0 auto;
          padding: clamp(56px, 8vw, 132px) clamp(20px, 4vw, 60px);
          display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.04fr);
          gap: clamp(28px, 4vw, 72px); align-items: center;
        }

        /* ── left: the message ── */
        .cc-rp-h {
          font-family: 'Universal Sans', sans-serif; font-weight: 800; color: ${INK};
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
        .cc-rp-btn:hover { transform: translateY(-3px); box-shadow: 0 24px 44px -18px rgba(11,27,51,0.6); }
        .cc-rp-btn svg { transition: transform .4s cubic-bezier(.16,1,.3,1); }
        .cc-rp-btn:hover svg { transform: translateX(5px); }
        .cc-rp-link {
          display: inline-flex; align-items: center; gap: 9px; min-height: 44px;
          color: ${INK}; text-decoration: none; position: relative;
          font-family: 'Universal Sans', sans-serif; font-weight: 700; font-size: clamp(14px, 1.1vw, 16px);
        }
        .cc-rp-link span { position: relative; }
        .cc-rp-link span::after { content: ''; position: absolute; left: 0; right: 0; bottom: -3px; height: 2px; background: ${BLUE}; transform-origin: left; transition: transform .4s cubic-bezier(.16,1,.3,1); }
        .cc-rp-link:hover span::after { transform: scaleX(0.55); }
        .cc-rp-link svg { color: ${BLUE}; transition: transform .4s cubic-bezier(.16,1,.3,1); }
        .cc-rp-link:hover svg { transform: translateX(4px); }

        /* ── feature row ── */
        .cc-rp-feats {
          display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
          border-top: 1px solid rgba(11,27,51,0.12); padding-top: clamp(22px, 2.6vw, 34px);
        }
        .cc-rp-feat { display: flex; flex-direction: column; gap: 10px; padding: 0 clamp(10px, 1.4vw, 22px); }
        .cc-rp-feat + .cc-rp-feat { border-left: 1px solid rgba(11,27,51,0.10); }
        .cc-rp-feat:first-child { padding-left: 0; }
        .cc-rp-disc { width: clamp(44px, 3.6vw, 56px); aspect-ratio: 1; border-radius: 50%; display: grid; place-items: center; }
        .cc-rp-feat b {
          font-family: 'Universal Sans', sans-serif; font-weight: 800; color: ${INK};
          font-size: clamp(15px, 1.25vw, 19px); line-height: 1.15; letter-spacing: -0.01em;
        }
        .cc-rp-feat b em { display: block; font-style: normal; font-weight: 500; color: ${MUTED};
          font-size: clamp(13px, 1vw, 15px); }

        /* ── right: the headset cut-out ── */
        .cc-rp-stage { position: relative; width: 100%; max-width: clamp(320px, 46vw, 760px); margin: 0 auto; }
        .cc-rp-set { width: 100%; height: auto; display: block; overflow: visible; }
        .cc-rp-stage::before {
          content: ''; position: absolute; z-index: 0; pointer-events: none;
          left: 50%; top: 43.5%; transform: translate(-50%, -50%);
          width: 44%; aspect-ratio: 1; border-radius: 50%;
          background: radial-gradient(closest-side, rgba(59,91,255,0.10), transparent 72%);
        }
        .cc-rp-seg { opacity: 0; animation: ccRpIn .7s cubic-bezier(.16,1,.3,1) forwards; }
        @keyframes ccRpIn { to { opacity: 1; } }
        .cc-rp-rim { fill: none; stroke: rgba(255,255,255,0.5); stroke-width: 2; }

        /* ── centre message, sitting in the ear-hole ── */
        .cc-rp-centre {
          position: absolute; left: 50%; top: 43.5%; transform: translate(-50%, -50%);
          z-index: 5; text-align: center; width: clamp(150px, 21vw, 300px);
        }
        .cc-rp-centre .wf { height: clamp(20px, 2vw, 28px); width: auto; margin: 0 auto clamp(12px, 1.4vw, 18px); display: block; }
        .cc-rp-msg {
          font-family: 'Universal Sans', sans-serif; font-weight: 600; color: ${INK};
          font-size: clamp(15px, 1.85vw, 29px); line-height: 1.3; letter-spacing: -0.02em; margin: 0;
        }
        .cc-rp-msg .b { color: ${BLUE}; font-weight: 800; }
        .cc-rp-heart { margin: clamp(10px, 1.3vw, 18px) auto 0; color: ${BLUE}; display: block; }

        @media (min-width: 1920px) { .cc-rp-inner { max-width: min(calc(100vw - 140px), 1780px); } }

        /* ── stack ── */
        @media (max-width: 980px) {
          .cc-rp-inner { grid-template-columns: minmax(0, 1fr); gap: clamp(30px, 6vw, 48px); }
          .cc-rp-stage { order: 2; max-width: min(92vw, 580px); }
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
          .cc-rp-btn, .cc-rp-btn svg, .cc-rp-link svg, .cc-rp-link span::after { transition: none; }
          .cc-rp-seg { animation: none; opacity: 1; }
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
            <a className="cc-rp-btn" href="/contact">
              Connect With Us <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
            </a>
            <a className="cc-rp-link" href="/services">
              <span>Learn more</span> <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
            </a>
          </motion.div>

          <motion.div className="cc-rp-feats" {...rise(0.3)}>
            {FEATURES.map((ft) => (
              <div className="cc-rp-feat" key={ft.key}>
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
          <motion.svg
            className="cc-rp-set"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            role="img"
            aria-label="A headset made from eleven photos of our support floor - agents, a live world map, chat, a dashboard, a desk phone and a studio microphone"
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <defs>
              {PARTS.map((p) => (
                <clipPath id={`rp-${p.key}`} key={p.key}>
                  <path d={p.d} transform={p.tf} />
                </clipPath>
              ))}
              <clipPath id="rp-mic"><circle cx={MIC.cx} cy={MIC.cy} r={MIC.r} /></clipPath>
              <clipPath id="rp-boom"><path d={BOOM_D} transform={BOOM_TF} /></clipPath>
              <filter id="rp-tile" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="9" stdDeviation="11" floodColor="#0B1B33" floodOpacity="0.22" />
              </filter>
            </defs>

            {/* each photo poured into its own bespoke cut piece. filter on the
               outer <g>, clip on the inner one: SVG applies the filter before
               the clip, so nesting keeps every piece's shadow from being
               clipped away with its silhouette. */}
            <g>
              {/* boom first so the foam mic + band overlap it cleanly */}
              <g filter="url(#rp-tile)" className="cc-rp-seg" style={{ animationDelay: '0.66s' }}>
                <g clipPath="url(#rp-boom)">
                  <image href="/images/home/showcase/bokeh.jpg" x={boomBox.x} y={boomBox.y} width={boomBox.w} height={boomBox.h} preserveAspectRatio="xMidYMid slice" />
                </g>
              </g>
              {PARTS.map((p, i) => (
                <g filter="url(#rp-tile)" key={p.key} className="cc-rp-seg" style={{ animationDelay: `${0.12 + i * 0.06}s` }}>
                  <g clipPath={`url(#rp-${p.key})`}>
                    <image href={p.src} x={p.box.x} y={p.box.y} width={p.box.w} height={p.box.h} preserveAspectRatio={p.focus ?? 'xMidYMid slice'} />
                  </g>
                </g>
              ))}
              <g filter="url(#rp-tile)" className="cc-rp-seg" style={{ animationDelay: '0.72s' }}>
                <g clipPath="url(#rp-mic)">
                  <image href="/images/home/showcase/mic.jpg" x={MIC.cx - MIC.r} y={MIC.cy - MIC.r} width={MIC.r * 2} height={MIC.r * 2} preserveAspectRatio="xMidYMid slice" />
                </g>
              </g>
            </g>

            {/* light bevel rims, drawn over the pieces (no shadow) */}
            <g>
              <path d={BOOM_D} transform={BOOM_TF} className="cc-rp-rim" />
              {PARTS.map((p) => <path d={p.d} transform={p.tf} key={p.key} className="cc-rp-rim" />)}
              <circle cx={MIC.cx} cy={MIC.cy} r={MIC.r} className="cc-rp-rim" />
            </g>
          </motion.svg>

          <motion.div className="cc-rp-centre"
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
    </section>
  )
}
