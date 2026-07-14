import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Package, Ticket, CalendarCheck, Truck, ShieldCheck, Plane } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { MaskReveal } from '../../lib/anim'

const TEXT   = '#16141F'
const ACCENT = '#998EFF'
const ACCENT_INK = '#6A5BE8'   /* text-safe on white (5.3:1) - eyebrows, links, small labels */
const WASH  = '#F4F2FD'
const LIVE   = '#2EBAC6'
const LIVE_INK   = '#0E7C88'   /* the label beside a live dot - teal itself is only 2.2:1 on white */
const MUTED  = '#5E5B6B'
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const GLOSS      = 'linear-gradient(168deg, #C3BCFF 0%, #998EFF 48%, #4A3DBF 100%)'
const ACCENT_RIM = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(40,32,100,0.3)'

const SPREAD = 19      // degrees between spokes on the dial
const DWELL  = 6200    // ms each sector holds before the dial turns itself

type Sector = {
  code: string
  name: string
  short: string
  desc: string
  runs: string[]
  stats: [string, string][]
  queue: number
  answer: string
  Icon: LucideIcon
  scene: 'ecom' | 'saas' | 'care' | 'move' | 'fin' | 'travel'
}

const SECTORS: Sector[] = [
  {
    code: 'E-COM', name: 'E-commerce and Retail', short: 'e-commerce', scene: 'ecom', Icon: Package,
    desc: 'Order tracking, returns and refunds answered in minutes, right the way through peak season.',
    runs: ['Order tracking', 'Returns', 'Refunds', 'Where is my order'],
    stats: [['5', 'Days to peak cover'], ['92', 'Percent fixed first time'], ['4', 'Channels live']],
    queue: 34, answer: '0:18',
  },
  {
    code: 'SAAS', name: 'SaaS and Technology', short: 'SaaS', scene: 'saas', Icon: Ticket,
    desc: 'Tier 1 and tier 2 tickets triaged, resolved and escalated inside your own stack, not ours.',
    runs: ['Tier 1', 'Tier 2 triage', 'Onboarding', 'Bug intake'],
    stats: [['2', 'Tiers held in house'], ['86', 'Percent closed without dev'], ['24', 'Hours a day']],
    queue: 21, answer: '0:24',
  },
  {
    code: 'CARE', name: 'Healthcare and Clinics', short: 'healthcare', scene: 'care', Icon: CalendarCheck,
    desc: 'Appointment booking, reminders and patient queries, handled by agents trained to slow down.',
    runs: ['Bookings', 'Reminders', 'Patient queries', 'Referrals'],
    stats: [['15', 'Second answer'], ['31', 'Percent fewer no shows'], ['100', 'Percent confidential']],
    queue: 12, answer: '0:15',
  },
  {
    code: 'MOVE', name: 'Logistics and Delivery', short: 'logistics', scene: 'move', Icon: Truck,
    desc: 'Delivery exceptions, driver support and live status chased down before the customer asks twice.',
    runs: ['Exceptions', 'Driver support', 'Live status', 'Claims'],
    stats: [['24', 'Hour exception desk'], ['38', 'Percent fewer chase calls'], ['7', 'Days a week']],
    queue: 47, answer: '0:21',
  },
  {
    code: 'FIN', name: 'Fintech and Insurance', short: 'fintech', scene: 'fin', Icon: ShieldCheck,
    desc: 'Account queries, claims intake and verification, with an audit trail sitting under every case.',
    runs: ['Account queries', 'Claims intake', 'Verification', 'Disputes'],
    stats: [['100', 'Percent audited notes'], ['4', 'Eyes on every claim'], ['0', 'Cases left open']],
    queue: 19, answer: '0:26',
  },
  {
    code: 'TRVL', name: 'Travel and Hospitality', short: 'travel', scene: 'travel', Icon: Plane,
    desc: 'Bookings, changes and cancellations answered in the language your guests actually speak.',
    runs: ['Bookings', 'Changes', 'Cancellations', 'Disruption'],
    stats: [['6', 'Languages from day one'], ['19', 'Second answer'], ['365', 'Days covered']],
    queue: 28, answer: '0:19',
  },
]

/* ──────────────────────────────────────────────────────────────
   The dial's centre holds an isometric diorama per sector: a
   tilted plate carrying that sector's work, with floating chips
   above it. All six share one material system - pale plates, ink
   hairlines, violet as the only saturated colour - so they read as
   one family rather than six illustrations.
   Every scene animates on transform / opacity only.
   ────────────────────────────────────────────────────────────── */
function Scene({ s, on }: { s: Sector; on: boolean }) {
  return (
    <div className={`cc-sc${on ? ' on' : ''}`} aria-hidden={!on}>
      <div className="cc-iso">
        <div className="cc-plate">
          {s.scene === 'ecom' && (
            <>
              <div className="cc-grid9">
                {Array.from({ length: 9 }).map((_, i) => (
                  <i key={i} className={i === 2 || i === 4 || i === 7 ? 'lit' : undefined} style={{ ['--i' as string]: i }} />
                ))}
              </div>
              <span className="cc-beam" />
            </>
          )}

          {s.scene === 'saas' && (
            <div className="cc-stack">
              <span className="l l1" /><span className="l l2" /><span className="l l3" />
              <span className="cc-ticket" />
            </div>
          )}

          {s.scene === 'care' && (
            <div className="cc-cal">
              {Array.from({ length: 12 }).map((_, i) => (
                <i key={i} className={i === 6 ? 'lit' : undefined} style={{ ['--i' as string]: i }} />
              ))}
            </div>
          )}

          {s.scene === 'move' && (
            <svg className="cc-route" viewBox="0 0 100 100" aria-hidden>
              <path d="M12,78 C34,72 30,40 52,34 C72,28 74,14 88,18" fill="none"
                    stroke="rgba(22,20,31,0.28)" strokeWidth="2.2" strokeDasharray="5 5" strokeLinecap="round" />
              <circle className="cc-route-dot halo" r="8" />
              <circle className="cc-route-dot" r="4.4" fill={ACCENT} />
              <circle className="stop" cx="12" cy="78" r="3.4" />
              <circle className="stop" cx="88" cy="18" r="3.4" />
              <rect x="40" y="60" width="16" height="12" rx="2" fill="rgba(26,22,44,0.10)" />
              <rect x="62" y="44" width="11" height="8" rx="2" fill="rgba(22,20,31,0.12)" />
            </svg>
          )}

          {s.scene === 'fin' && (
            <div className="cc-cards">
              <span className="c c1" /><span className="c c2" /><span className="c c3" />
              <span className="cc-ticks">
                <i style={{ ['--i' as string]: 0 }} /><i style={{ ['--i' as string]: 1 }} /><i style={{ ['--i' as string]: 2 }} />
              </span>
            </div>
          )}

          {s.scene === 'travel' && (
            <svg className="cc-arc" viewBox="0 0 100 100" aria-hidden>
              <circle cx="14" cy="74" r="13" fill="none" stroke="rgba(26,22,44,0.16)" strokeWidth="1.2" />
              <circle cx="86" cy="52" r="10" fill="none" stroke="rgba(26,22,44,0.16)" strokeWidth="1.2" />
              <path d="M14,74 Q50,6 86,52" fill="none" stroke="rgba(22,20,31,0.26)" strokeWidth="2.2" strokeDasharray="4 6" strokeLinecap="round" />
              <circle className="cc-arc-dot halo" r="8" />
              <circle className="cc-arc-dot" r="4.2" fill={ACCENT} />
              <circle className="stop" cx="14" cy="74" r="3.6" />
              <circle className="stop" cx="86" cy="52" r="3.6" />
            </svg>
          )}
        </div>

        {/* the chip that floats above the plate, one per sector */}
        <div className="cc-chip a"><s.Icon size={20} strokeWidth={1.9} aria-hidden /></div>
        <div className="cc-chip b" />
        <div className="cc-chip c" />
      </div>
    </div>
  )
}

export function Industries() {
  const reduce = useReducedMotion() ?? false
  const [sel, setSel] = useState(0)
  const [paused, setPaused] = useState(false)
  const [queue, setQueue] = useState(SECTORS[0].queue)
  const startRef = useRef(0)
  const progRef = useRef<SVGCircleElement>(null)

  const active = SECTORS[sel]

  const pick = useCallback((i: number) => {
    setSel(i)
    startRef.current = performance.now()
    setQueue(SECTORS[i].queue)
  }, [])

  /* auto-advance on a progress ring; hovering the stage takes the dial off the clock */
  useEffect(() => {
    if (reduce) return
    let raf = 0
    const CIRC = 2 * Math.PI * 47
    startRef.current = performance.now()
    const tick = (now: number) => {
      if (!paused) {
        const p = Math.min(1, (now - startRef.current) / DWELL)
        if (progRef.current) progRef.current.style.strokeDashoffset = String(CIRC * (1 - p))
        if (p >= 1) {
          setSel((s) => {
            const next = (s + 1) % SECTORS.length
            setQueue(SECTORS[next].queue)
            return next
          })
          startRef.current = now
        }
      } else {
        startRef.current = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused, reduce])

  /* the queue figure drifts, the way a real board does */
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => {
      setQueue((q) => Math.max(6, q + Math.round((Math.random() - 0.5) * 6)))
    }, 2800)
    return () => clearInterval(id)
  }, [reduce, sel])

  const rise = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { delay: d, duration: 0.8, ease: EASE },
  })

  return (
    <section className="cc-in" id="industries" aria-label="Industries we serve">
      <style>{`
        /* picks the wash up off the section above, climbs back to white, and
           settles into the wash again at the foot */
        .cc-in {
          position: relative; isolation: isolate; overflow: hidden;
          background: linear-gradient(180deg, #E3DEF8 0%, #FBFAFE 26%, #FFFFFF 52%, ${WASH} 100%);
          color: ${TEXT};
          padding: clamp(72px, 10vw, 150px) clamp(24px, 4vw, 64px) clamp(72px, 9vw, 140px);
        }
        .cc-in::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(54% 46% at 84% 12%, rgba(153,142,255,0.12), transparent 70%);
        }
        .cc-in-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }
        @media (min-width: 1920px) { .cc-in-inner { max-width: 1900px; } }
        @media (min-width: 2560px) { .cc-in-inner { max-width: 2400px; } }

        /* ── masthead: heading left, live index right, hairline under both ── */
        .cc-in-mast {
          display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.72fr);
          gap: clamp(24px, 4vw, 72px); align-items: end;
          padding-bottom: clamp(22px, 2.6vw, 36px);
          border-bottom: 1px solid rgba(22,20,31,0.16);
        }
        .cc-in-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px; color: ${ACCENT_INK};
          margin: 0 0 clamp(14px, 1.8vw, 22px);
        }
        .cc-in-eyebrow i { width: 7px; height: 7px; border-radius: 50%; background: ${ACCENT}; }
        .cc-in-title {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: clamp(34px, 5vw, 80px); line-height: 1.02; letter-spacing: -0.03em;
          margin: 0; max-width: 15ch;
        }
        .cc-in-title .accent { color: ${ACCENT}; }

        .cc-in-index { display: flex; flex-direction: column; gap: 14px; align-items: flex-start; }
        .cc-in-count {
          display: flex; align-items: baseline; gap: 8px;
          font-family: Georgia, 'Times New Roman', serif; font-variant-numeric: tabular-nums;
        }
        .cc-in-count b { font-size: clamp(34px, 3.4vw, 58px); line-height: 1; font-weight: 400; color: ${ACCENT}; }
        .cc-in-count span { font-size: clamp(15px, 1.2vw, 20px); color: rgba(22,20,31,0.42); }
        .cc-in-note {
          font-family: 'Inter', sans-serif; font-size: clamp(13px, 1vw, 16px); line-height: 1.7;
          color: ${MUTED}; margin: 0; max-width: 34ch;
        }

        /* ── body: panel + dial ── */
        .cc-in-body {
          display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
          gap: clamp(28px, 4vw, 76px); align-items: center;
          padding-top: clamp(32px, 4vw, 64px);
        }

        /* ---- left panel ---- */
        .cc-in-panel { position: relative; }
        .cc-in-code {
          display: inline-flex; align-items: center; gap: 9px;
          font-family: 'Inter', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 1.8px;
          color: ${ACCENT_INK}; border: 1px solid rgba(153,142,255,0.4); border-radius: 5px;
          padding: 7px 12px; margin-bottom: clamp(16px, 2vw, 24px);
        }
        .cc-in-name {
          font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
          font-size: clamp(32px, 3.6vw, 64px); line-height: 1.08; letter-spacing: -0.02em;
          margin: 0 0 clamp(14px, 1.6vw, 20px); color: ${TEXT}; min-height: 1.08em;
        }
        .cc-in-desc {
          font-family: 'Inter', sans-serif; font-size: clamp(15px, 1.15vw, 18px); line-height: 1.78;
          color: ${MUTED}; margin: 0 0 clamp(22px, 2.4vw, 32px); max-width: 42ch;
        }
        .cc-in-swap { will-change: transform, opacity; }

        .cc-in-runs { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 clamp(24px, 2.6vw, 36px); padding: 0; list-style: none; }
        .cc-in-runs li {
          font-family: 'Inter', sans-serif; font-weight: 600; font-size: clamp(12px, 0.95vw, 14px);
          padding: 9px 15px; border-radius: 100px; color: ${TEXT};
          background: linear-gradient(168deg, rgba(255,255,255,0.98), rgba(255,255,255,0.68));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            inset 0 0 0 1px rgba(22,20,31,0.1),
            0 8px 20px -14px rgba(22,20,31,0.5);
        }

        .cc-in-stats {
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(14px, 2vw, 30px);
          border-top: 1px solid rgba(22,20,31,0.14); padding-top: clamp(20px, 2.2vw, 28px);
        }
        .cc-in-stat b {
          display: block; font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
          font-size: clamp(26px, 2.4vw, 44px); line-height: 1; letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums; color: ${TEXT};
        }
        .cc-in-stat span {
          display: block; margin-top: 8px; font-family: 'Inter', sans-serif; font-weight: 600;
          font-size: clamp(12px, 0.9vw, 14px); line-height: 1.5; color: ${MUTED};
        }
        .cc-in-cta {
          display: inline-flex; align-items: center; gap: 10px; margin-top: clamp(24px, 2.6vw, 34px);
          min-height: 48px; font-family: 'Inter', sans-serif; font-weight: 700;
          font-size: clamp(14px, 1.05vw, 16px); color: ${TEXT}; text-decoration: none;
        }
        .cc-in-cta span { position: relative; padding-bottom: 3px; }
        .cc-in-cta span::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: ${ACCENT};
          transform: scaleX(1); transform-origin: right; transition: transform .5s cubic-bezier(.16,1,.3,1);
        }
        .cc-in-cta:hover span::after { transform: scaleX(0); }
        .cc-in-cta svg { color: ${ACCENT}; transition: transform .5s cubic-bezier(.16,1,.3,1); }
        .cc-in-cta:hover svg { transform: translateX(5px); }

        /* ---- right: the dial ----
           The dial reads left-to-right: the disc (with the diorama), a needle,
           then a 3D picker wheel carrying the sector names. The names stay
           horizontal and inside the column - a radial text wheel cannot hold
           names this long without running off the section. */
        .cc-in-stage {
          position: relative;
          display: grid; grid-template-columns: minmax(0, 1fr) clamp(190px, 17vw, 280px);
          gap: clamp(14px, 2vw, 34px); align-items: center;
        }
        .cc-in-dial {
          position: relative; aspect-ratio: 1; display: grid; place-items: center;
          max-width: 520px; justify-self: end; width: 100%;
        }

        .cc-in-disc {
          position: relative; width: 88%; aspect-ratio: 1; border-radius: 50%;
          background: radial-gradient(circle at 34% 24%, #FFFFFF 0%, #F5F3FD 38%, #E6E2F9 74%, #D5CFF2 100%);
          box-shadow:
            inset 0 2px 2px rgba(255,255,255,1),
            inset 0 0 0 1px rgba(22,20,31,0.10),
            inset 0 0 0 9px rgba(255,255,255,0.6),
            inset 0 -24px 40px -24px rgba(22,20,31,0.28),
            0 20px 40px -24px rgba(22,20,31,0.35),
            0 70px 100px -50px rgba(22,20,31,0.5);
          display: grid; place-items: center; overflow: hidden;
        }
        /* the specular arc across the top of the glass, plus the violet bounce */
        .cc-in-disc::after {
          content: ''; position: absolute; inset: 0; pointer-events: none; border-radius: 50%;
          background:
            radial-gradient(46% 30% at 36% 12%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%),
            radial-gradient(58% 48% at 50% 8%, rgba(153,142,255,0.12), transparent 70%);
        }

        /* progress ring, drawn just outside the disc */
        .cc-in-ring { position: absolute; inset: -3.2%; width: auto; height: auto; transform: rotate(-90deg); pointer-events: none; }
        .cc-in-ring circle { fill: none; stroke-width: 0.9; }
        .cc-in-ring .bg { stroke: rgba(22,20,31,0.12); }
        .cc-in-ring .fg { stroke: ${ACCENT}; stroke-linecap: round; }

        /* gauge ticks around the rim - they turn with the dial, and stay inside it */
        .cc-in-ticks { position: absolute; inset: -3.2%; pointer-events: none; }
        .cc-in-ticks i {
          position: absolute; top: 50%; left: 50%; width: 50%; height: 1px;
          transform-origin: 0 50%; transform: rotate(var(--a));
          transition: transform 1.05s cubic-bezier(.16,1,.3,1);
        }
        .cc-in-ticks i::after {
          content: ''; position: absolute; right: 0; top: 0; width: 9px; height: 1px;
          background: rgba(22,20,31,0.22);
        }
        .cc-in-ticks i.on::after { width: 18px; height: 2px; background: ${ACCENT}; top: -0.5px; }

        /* the picker: a cylinder of names turning behind the needle */
        .cc-in-picker {
          position: relative; height: clamp(260px, 24vw, 360px);
          perspective: 900px; perspective-origin: 0% 50%;
        }
        .cc-in-picker::before {
          content: ''; position: absolute; left: 0; top: 50%; width: 26px; height: 2px;
          transform: translate(calc(-100% - 4px), -50%);
          background: linear-gradient(90deg, rgba(153,142,255,0), ${ACCENT});
        }
        .cc-in-picker::after {
          content: ''; position: absolute; left: -4px; top: 50%; width: 9px; height: 9px;
          transform: translate(-50%, -50%); border-radius: 50%; background: ${ACCENT};
          box-shadow: 0 0 0 4px rgba(153,142,255,0.2);
        }
        .cc-in-opt {
          position: absolute; left: 0; right: 0; top: 50%;
          transform-style: preserve-3d; will-change: transform, opacity;
          transform: translateY(-50%) rotateX(var(--a)) translateZ(clamp(120px, 11vw, 168px));
          transition: transform 1.05s cubic-bezier(.16,1,.3,1), opacity .8s ease;
          backface-visibility: hidden;
        }
        .cc-in-opt button {
          display: flex; align-items: center; gap: 10px; width: 100%;
          min-height: 44px; padding: 6px 0; border: 0; background: none; cursor: pointer;
          text-align: left; color: rgba(22,20,31,0.5);
          font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.02em;
          font-size: clamp(14px, 1.05vw, 18px); line-height: 1.2;
          transition: color .45s ease;
        }
        .cc-in-opt button::before {
          content: ''; flex: none; width: 12px; height: 1px; background: currentColor; opacity: .5;
          transition: width .55s cubic-bezier(.16,1,.3,1), background .45s ease, opacity .45s ease;
        }
        .cc-in-opt button:hover { color: ${TEXT}; }
        .cc-in-opt.on button { color: ${TEXT}; font-weight: 700; }
        .cc-in-opt.on button::before { width: 26px; background: ${ACCENT}; opacity: 1; }

        /* ---- the diorama that sits in the disc ---- */
        .cc-sc {
          position: absolute; inset: 0; display: grid; place-items: center;
          opacity: 0; transform: scale(0.9); pointer-events: none;
          transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1);
          will-change: transform, opacity;
        }
        .cc-sc.on { opacity: 1; transform: scale(1); }
        .cc-iso {
          position: relative; width: 66%; aspect-ratio: 1;
          transform: rotateX(54deg) rotateZ(-42deg); transform-style: preserve-3d;
        }
        .cc-plate {
          position: absolute; inset: 0; border-radius: 12px;
          background: linear-gradient(150deg, #FFFFFF 0%, #EEEBFB 55%, #E2DDF8 100%);
          box-shadow:
            inset 0 0 0 1px rgba(22,20,31,0.14),
            0 2px 0 2px rgba(26,22,44,0.06),
            30px 30px 60px -18px rgba(22,20,31,0.42);
          overflow: hidden;
        }
        /* a faint floor grid, shared by all six plates, so they read as one set */
        .cc-plate::before {
          content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
          background:
            repeating-linear-gradient(0deg, rgba(22,20,31,0.06) 0 1px, transparent 1px 12.5%),
            repeating-linear-gradient(90deg, rgba(22,20,31,0.06) 0 1px, transparent 1px 12.5%);
        }

        /* floating chips, shared by every scene */
        .cc-chip {
          position: absolute; border-radius: 10px;
          background: linear-gradient(160deg, #FFFFFF 0%, #FAF9FE 55%, #EDEAFB 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            inset 0 -1px 0 rgba(22,20,31,0.08),
            inset 0 0 0 1px rgba(22,20,31,0.09),
            0 2px 4px rgba(22,20,31,0.16),
            0 18px 30px -14px rgba(22,20,31,0.5);
          will-change: transform;
        }
        /* the two blank chips carry a line of "content" so they read as cards, not blobs */
        .cc-chip.b::after, .cc-chip.c::after {
          content: ''; position: absolute; left: 18%; right: 30%; top: 34%; height: 10%;
          border-radius: 100px; background: rgba(255,255,255,0.75);
        }
        .cc-chip.c::after { background: rgba(22,20,31,0.16); right: 24%; }
        .cc-chip.c::before {
          content: ''; position: absolute; left: 18%; right: 46%; top: 58%; height: 10%;
          border-radius: 100px; background: rgba(153,142,255,0.5);
        }
        .cc-chip.a {
          top: -18%; left: 8%; width: 34%; aspect-ratio: 1; display: grid; place-items: center;
          color: ${ACCENT}; transform: translateZ(58px);
          animation: cc-float 5.4s cubic-bezier(.4,0,.6,1) infinite;
        }
        .cc-chip.b {
          top: 16%; left: -20%; width: 22%; aspect-ratio: 1.6;
          background: ${GLOSS}; transform: translateZ(38px);
          box-shadow: ${ACCENT_RIM}, 0 18px 34px -16px rgba(74,61,191,0.9);
          animation: cc-float 6.2s cubic-bezier(.4,0,.6,1) infinite .5s;
        }
        .cc-chip.c {
          bottom: -14%; right: 4%; width: 26%; aspect-ratio: 2.2;
          background: linear-gradient(150deg, #fff, #EAE6FA); transform: translateZ(30px);
          animation: cc-float 7s cubic-bezier(.4,0,.6,1) infinite 1.1s;
        }
        @keyframes cc-float {
          0%, 100% { transform: translateZ(var(--z, 40px)) translate3d(0, 0, 0); }
          50%      { transform: translateZ(var(--z, 40px)) translate3d(0, -7%, 14px); }
        }
        .cc-chip.a { --z: 58px; }
        .cc-chip.b { --z: 38px; }
        .cc-chip.c { --z: 30px; }

        /* scene: e-commerce - a pick grid being scanned */
        .cc-grid9 {
          position: absolute; inset: 16%; display: grid; grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 1fr; gap: 7%;
        }
        .cc-grid9 i {
          border-radius: 4px; background: rgba(22,20,31,0.07); box-shadow: inset 0 0 0 1px rgba(22,20,31,0.05);
        }
        .cc-grid9 i.lit {
          background: rgba(153,142,255,0.3); box-shadow: inset 0 0 0 1px rgba(153,142,255,0.55);
          animation: cc-blink 3.4s cubic-bezier(.4,0,.6,1) infinite;
          animation-delay: calc(var(--i) * 0.28s);
        }
        @keyframes cc-blink { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }
        .cc-beam {
          position: absolute; left: 0; right: 0; top: 0; height: 26%;
          background: linear-gradient(180deg, transparent, rgba(153,142,255,0.28), transparent);
          animation: cc-sweep 3.6s cubic-bezier(.65,0,.35,1) infinite; will-change: transform;
        }
        @keyframes cc-sweep { 0% { transform: translateY(-30%); } 100% { transform: translateY(400%); } }

        /* scene: saas - a ticket rising through stacked tiers */
        .cc-stack { position: absolute; inset: 14%; transform-style: preserve-3d; }
        .cc-stack .l {
          position: absolute; left: 0; right: 0; height: 22%; border-radius: 6px;
          background: #fff;
          box-shadow: inset 0 0 0 1px rgba(22,20,31,0.16), 0 6px 12px -6px rgba(22,20,31,0.5);
        }
        .cc-stack .l::after {
          content: ''; position: absolute; left: 10%; right: 42%; top: 38%; height: 12%;
          border-radius: 100px; background: rgba(26,22,44,0.16);
        }
        .cc-stack .l1 { bottom: 0; transform: translateZ(0); }
        .cc-stack .l2 { bottom: 34%; transform: translateZ(18px); }
        .cc-stack .l3 { bottom: 68%; transform: translateZ(36px); }
        .cc-ticket {
          position: absolute; left: 18%; bottom: 6%; width: 26%; height: 14%; border-radius: 4px;
          background: ${ACCENT}; box-shadow: 0 10px 20px -8px rgba(153,142,255,0.9);
          animation: cc-rise 4.2s cubic-bezier(.5,0,.2,1) infinite; will-change: transform;
        }
        @keyframes cc-rise {
          0%       { transform: translate3d(0, 0, 4px); opacity: 0; }
          14%      { opacity: 1; }
          55%      { transform: translate3d(30%, -170%, 24px); opacity: 1; }
          85%, 100%{ transform: translate3d(56%, -330%, 44px); opacity: 0; }
        }

        /* scene: healthcare - a booking slot filling in the diary */
        .cc-cal {
          position: absolute; inset: 16%; display: grid; grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 1fr; gap: 8%;
        }
        .cc-cal i { border-radius: 3px; background: rgba(22,20,31,0.07); }
        .cc-cal i:nth-child(3n) { background: rgba(26,22,44,0.10); }
        .cc-cal i.lit {
          background: ${ACCENT};
          animation: cc-book 3.8s cubic-bezier(.16,1,.3,1) infinite; will-change: transform, opacity;
        }
        @keyframes cc-book {
          0%, 12%   { transform: scale(0.4); opacity: 0; }
          30%, 76%  { transform: scale(1);   opacity: 1; }
          92%, 100% { transform: scale(1.5); opacity: 0; }
        }

        /* scene: logistics - a delivery running its route */
        .cc-route, .cc-arc { position: absolute; inset: 8%; width: 84%; height: 84%; overflow: visible; }
        .cc-route .stop, .cc-arc .stop { fill: rgba(22,20,31,0.3); }
        .cc-route .halo, .cc-arc .halo { fill: rgba(153,142,255,0.22); }
        .cc-route-dot {
          offset-path: path('M12,78 C34,72 30,40 52,34 C72,28 74,14 88,18');
          animation: cc-drive 4.6s cubic-bezier(.5,0,.5,1) infinite; will-change: transform;
        }
        @keyframes cc-drive {
          0%       { offset-distance: 0%; opacity: 0; }
          8%, 88%  { opacity: 1; }
          100%     { offset-distance: 100%; opacity: 0; }
        }

        /* scene: fintech - a case stack being signed off */
        .cc-cards { position: absolute; inset: 18%; transform-style: preserve-3d; }
        .cc-cards .c {
          position: absolute; inset: 0; border-radius: 7px; background: #fff;
          box-shadow: inset 0 0 0 1px rgba(22,20,31,0.09);
        }
        .cc-cards .c1 { transform: translate3d(-8%, 8%, 0) rotate(-4deg); opacity: .55; }
        .cc-cards .c2 { transform: translate3d(-3%, 3%, 12px) rotate(-2deg); opacity: .8; }
        .cc-cards .c3 { transform: translateZ(26px); }
        .cc-ticks { position: absolute; inset: 24% 20%; display: grid; gap: 14%; transform: translateZ(28px); }
        .cc-ticks i {
          height: 12%; min-height: 3px; border-radius: 100px; background: ${ACCENT};
          transform-origin: left center; transform: scaleX(0);
          animation: cc-sign 4.4s cubic-bezier(.16,1,.3,1) infinite;
          animation-delay: calc(var(--i) * 0.4s); will-change: transform;
        }
        @keyframes cc-sign {
          0%, 6%    { transform: scaleX(0); }
          26%, 78%  { transform: scaleX(1); }
          94%, 100% { transform: scaleX(0); }
        }

        /* scene: travel - a route arcing between two cities */
        .cc-arc-dot {
          offset-path: path('M14,74 Q50,6 86,52');
          animation: cc-fly 5s cubic-bezier(.45,0,.35,1) infinite; will-change: transform;
        }
        @keyframes cc-fly {
          0%      { offset-distance: 0%; opacity: 0; }
          10%, 86%{ opacity: 1; }
          100%    { offset-distance: 100%; opacity: 0; }
        }

        /* ---- the live console: the floor, while you are reading ---- */
        .cc-in-console {
          position: absolute; left: 0; bottom: 4%; z-index: 3;
          display: flex; align-items: center; gap: clamp(14px, 1.4vw, 22px);
          padding: clamp(12px, 1.1vw, 16px) clamp(16px, 1.5vw, 22px); border-radius: 12px;
          background: linear-gradient(168deg, rgba(255,255,255,0.97), rgba(255,255,255,0.82));
          backdrop-filter: blur(8px) saturate(1.3);
          -webkit-backdrop-filter: blur(8px) saturate(1.3);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            inset 0 -1px 0 rgba(26,22,44,0.03),
            inset 0 0 0 1px rgba(22,20,31,0.07),
            0 1px 3px rgba(26,22,44,0.06),
            0 30px 50px -26px rgba(22,20,31,0.55);
        }
        .cc-in-console .live {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: 'Inter', sans-serif; font-weight: 800; font-size: 10px; letter-spacing: 1.6px;
          text-transform: uppercase; color: ${LIVE_INK};
        }
        .cc-in-console .live i {
          position: relative; width: 7px; height: 7px; border-radius: 50%; background: ${LIVE};
        }
        .cc-in-console .live i::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%; border: 1px solid ${LIVE};
          animation: cc-ping 2.4s cubic-bezier(.16,1,.3,1) infinite;
        }
        @keyframes cc-ping { 0% { transform: scale(1); opacity: .6; } 70%, 100% { transform: scale(2.8); opacity: 0; } }
        .cc-in-console .fig {
          font-family: 'Inter', sans-serif; font-variant-numeric: tabular-nums;
          display: flex; flex-direction: column; gap: 3px;
        }
        .cc-in-console .fig b { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; font-size: clamp(18px, 1.5vw, 24px); line-height: 1; }
        .cc-in-console .fig span {
          font-size: 10px; letter-spacing: 1.3px; text-transform: uppercase; font-weight: 700;
          color: rgba(22,20,31,0.45); white-space: nowrap;
        }
        .cc-in-console .bars { display: flex; align-items: flex-end; gap: 3px; height: 26px; }
        .cc-in-console .bars i {
          width: 4px; border-radius: 100px; background: ${ACCENT}; opacity: 0.8;
          transform-origin: bottom; height: 100%;
          transform: scaleY(var(--h)); will-change: transform;
          animation: cc-bar 1.3s cubic-bezier(.4,0,.6,1) infinite alternate;
          animation-delay: var(--d);
        }
        @keyframes cc-bar {
          from { transform: scaleY(calc(var(--h) * 0.3)); }
          to   { transform: scaleY(var(--h)); }
        }

        /* mobile rail replaces the wheel */
        .cc-in-rail { display: none; }

        /* ── responsive ── */
        @media (max-width: 1180px) {
          .cc-in-mast { grid-template-columns: minmax(0, 1fr); align-items: start; }
          .cc-in-body { grid-template-columns: minmax(0, 1fr); gap: clamp(32px, 5vw, 48px); }
          .cc-in-stage { order: -1; max-width: 720px; margin: 0 auto; width: 100%; }
        }
        @media (max-width: 860px) {
          .cc-in-picker, .cc-in-ticks { display: none; }
          .cc-in-stage { grid-template-columns: minmax(0, 1fr); max-width: 460px; }
          .cc-in-disc { width: 100%; }
          .cc-in-console { left: 50%; transform: translateX(-50%); bottom: 0; }
          .cc-in-rail {
            display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none;
            margin: clamp(18px, 3vw, 26px) 0 0; padding-bottom: 4px;
          }
          .cc-in-rail::-webkit-scrollbar { display: none; }
          .cc-in-rail button {
            flex: none; min-height: 44px; padding: 11px 18px; border-radius: 100px; cursor: pointer;
            border: 0; color: ${TEXT};
            background: linear-gradient(168deg, rgba(255,255,255,0.98), rgba(255,255,255,0.7));
            box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(22,20,31,0.14);
            font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 14px; white-space: nowrap;
          }
          .cc-in-rail button.on {
            background: ${GLOSS}; color: #fff;
            box-shadow: ${ACCENT_RIM}, 0 10px 22px -12px rgba(74,61,191,0.7);
          }
          .cc-in-stats { grid-template-columns: minmax(0, 1fr); gap: 16px; }
          .cc-in-stat { display: flex; align-items: baseline; gap: 14px; }
          .cc-in-stat b { min-width: 3.2ch; }
          .cc-in-stat span { margin-top: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-chip, .cc-beam, .cc-ticket, .cc-grid9 i.lit, .cc-cal i.lit,
          .cc-route-dot, .cc-arc-dot, .cc-ticks i, .cc-in-console .bars i, .cc-in-console .live i::after {
            animation: none;
          }
          .cc-ticks i { transform: scaleX(1); }
          .cc-in-opt, .cc-in-ticks i { transition: none; }
        }
      `}</style>

      <div className="cc-in-inner">
        {/* ── masthead ── */}
        <div className="cc-in-mast">
          <div>
            <motion.p className="cc-in-eyebrow" {...rise(0)}>
              <i aria-hidden /> Who We Serve
            </motion.p>
            <MaskReveal as="h2" className="cc-in-title" delay={0.05}>
              Six sectors. <span className="accent">One floor.</span>
            </MaskReveal>
          </div>
          <motion.div className="cc-in-index" {...rise(0.12)}>
            <p className="cc-in-count">
              <b>{String(sel + 1).padStart(2, '0')}</b>
              <span>/ 06 on the dial</span>
            </p>
            <p className="cc-in-note">
              Turn the dial, or leave it running. Each sector is staffed by agents who already know
              its products, its policies and its worst day.
            </p>
          </motion.div>
        </div>

        {/* ── body: panel + dial ── */}
        <div className="cc-in-body">
          {/* left: the sector, written out */}
          <motion.div className="cc-in-panel" {...rise(0.06)}>
            <span className="cc-in-code">{active.code}</span>

            <motion.div
              key={`name-${sel}`}
              className="cc-in-swap"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <h3 className="cc-in-name">{active.name}</h3>
              <p className="cc-in-desc">{active.desc}</p>
              <ul className="cc-in-runs">
                {active.runs.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </motion.div>

            <div className="cc-in-stats">
              {active.stats.map(([v, l]) => (
                <motion.div
                  className="cc-in-stat"
                  key={`${sel}-${l}`}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
                >
                  <b>{v}</b>
                  <span>{l}</span>
                </motion.div>
              ))}
            </div>

            <Link className="cc-in-cta" to="/contact#write">
              <span>Talk about {active.short}</span>
              <ArrowRight size={18} strokeWidth={2.3} aria-hidden />
            </Link>

            {/* mobile: the wheel is gone, so the sectors become a rail */}
            <div className="cc-in-rail" role="tablist" aria-label="Choose a sector">
              {SECTORS.map((s, i) => (
                <button
                  key={s.code}
                  type="button"
                  role="tab"
                  aria-selected={i === sel}
                  className={i === sel ? 'on' : undefined}
                  onClick={() => pick(i)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* right: the dial */}
          <motion.div
            className="cc-in-stage"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: EASE }}
          >
            <div className="cc-in-dial">
              <div className="cc-in-disc">
                {SECTORS.map((s, i) => <Scene key={s.code} s={s} on={i === sel} />)}

                <svg className="cc-in-ring" viewBox="0 0 100 100" aria-hidden>
                  <circle className="bg" cx="50" cy="50" r="47" />
                  <circle
                    className="fg" cx="50" cy="50" r="47" ref={progRef}
                    strokeDasharray={2 * Math.PI * 47}
                    strokeDashoffset={2 * Math.PI * 47}
                  />
                </svg>
              </div>

              <div className="cc-in-ticks" aria-hidden>
                {SECTORS.map((s, i) => (
                  <i
                    key={s.code}
                    className={i === sel ? 'on' : undefined}
                    style={{ ['--a' as string]: `${(i - sel) * SPREAD}deg` }}
                  />
                ))}
              </div>
            </div>

            {/* the names ride a cylinder that turns behind the needle */}
            <div className="cc-in-picker" role="tablist" aria-label="Choose a sector">
              {SECTORS.map((s, i) => {
                const off = i - sel
                return (
                  <div
                    className={`cc-in-opt${i === sel ? ' on' : ''}`}
                    key={s.code}
                    style={{
                      /* negative offset must ride up, not down */
                      ['--a' as string]: `${-off * SPREAD}deg`,
                      opacity: Math.max(0, 1 - Math.abs(off) * 0.26),
                      zIndex: 10 - Math.abs(off),
                    }}
                  >
                    <button type="button" role="tab" aria-selected={i === sel} onClick={() => pick(i)}>
                      {s.name}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* the extra panel: what the floor is doing for this sector, right now */}
            <div className="cc-in-console">
              <span className="live"><i aria-hidden /> Live</span>
              <span className="fig"><b>{queue}</b><span>In queue</span></span>
              <span className="fig"><b>{active.answer}</b><span>Answered in</span></span>
              <span className="bars" aria-hidden>
                {[0.4, 0.72, 0.55, 0.94, 0.62, 0.85, 0.48].map((h, i) => (
                  <i key={i} style={{ ['--h' as string]: h, ['--d' as string]: `${i * 0.1}s` }} />
                ))}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
