import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { MaskReveal, useParallax } from '../../lib/anim'

const MotionLink = motion.create(Link)

const TEXT   = '#2E3A34'
const ACCENT = '#D2704A'
const ACCENT_INK = '#A85434'   /* text-safe on white (5.3:1) - eyebrows, links, small labels */
/* Was a sage-mint slab (#DEE8E2). A second hue at low chroma, running
   alongside the terracotta, is what turned the whole page muddy - so the
   panel now sits in the same white-to-cream ramp as every other section. */
const CREAM  = '#F6F2EA'
const MUTED  = '#5A665F'
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const GLOSS       = 'linear-gradient(168deg, #F09A72 0%, #D2704A 48%, #9C4324 100%)'
const ACCENT_RIM  = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(84,34,16,0.3)'
const ACCENT_CAST = '0 2px 4px rgba(156,67,36,0.34), 0 12px 24px -10px rgba(156,67,36,0.5), 0 30px 54px -26px rgba(156,67,36,0.62)'

type RowProps = {
  reverse?: boolean
  eyebrow: string
  heading: string
  body: string
  cta: { label: string; to: string }
  img: { src: string; alt: string }
}

function Row({ reverse, eyebrow, heading, body, cta, img }: RowProps) {
  const reduce = useReducedMotion() ?? false
  const mediaRef = useRef<HTMLDivElement>(null)
  const imgY = useParallax(mediaRef, 42)
  const rise = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { delay: d, duration: 0.8, ease: EASE },
  })

  return (
    <div className={`cc-bp-row${reverse ? ' reverse' : ''}`}>
      <div className="cc-bp-media" ref={mediaRef}>
        <motion.img
          src={img.src}
          alt={img.alt}
          width={1600}
          height={1800}
          loading="lazy"
          decoding="async"
          style={reduce ? { scale: 1.16 } : { y: imgY, scale: 1.16 }}
        />
      </div>
      <div className="cc-bp-panel">
        <motion.p className="cc-bp-eyebrow" {...rise(0)}>{eyebrow}</motion.p>
        <MaskReveal as="h2" className="cc-bp-h2" delay={0.08}>{heading}</MaskReveal>
        <motion.p className="cc-bp-p" {...rise(0.16)}>{body}</motion.p>
        <MotionLink className="cc-bp-btn gl-shine" to={cta.to} {...rise(0.24)}>
          <span>{cta.label}</span>
          <ArrowRight size={19} strokeWidth={2.4} aria-hidden />
        </MotionLink>
      </div>
    </div>
  )
}

export function BrandPromise() {
  return (
    <section className="cc-bp" id="brand-promise" aria-label="Your brand, represented">
      <style>{`
        .cc-bp { background: #FFFFFF; overflow: hidden; }
        .cc-bp-row { display: grid; grid-template-columns: 1fr 1fr; }

        /* full-bleed photo */
        .cc-bp-media { position: relative; min-height: clamp(360px, 42vw, 640px); overflow: hidden; }
        .cc-bp-media img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          will-change: transform;
        }
        /* a glass edge where the photo meets the panel, so the seam catches light */
        .cc-bp-media::after {
          content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0) 22%);
        }

        /* content panel - white at the top, drifting into cream, with one soft
           terracotta bloom behind the copy */
        .cc-bp-panel {
          position: relative;
          display: flex; flex-direction: column; justify-content: center;
          padding: clamp(48px, 6vw, 120px) clamp(28px, 5vw, 96px);
          background: linear-gradient(168deg, #FFFFFF 0%, #FCFAF6 44%, ${CREAM} 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1);
        }
        .cc-bp-panel::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(58% 46% at 24% 10%, rgba(210,112,74,0.09), transparent 72%);
        }
        .cc-bp-panel > * { position: relative; z-index: 1; }
        .cc-bp-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px;
          color: ${ACCENT_INK}; margin: 0 0 clamp(20px, 2.4vw, 30px);
        }
        .cc-bp-eyebrow::before { content: ''; width: clamp(26px, 4vw, 54px); height: 1px; background: ${ACCENT}; opacity: 0.6; }
        .cc-bp-h2 {
          font-family: 'Poppins', sans-serif; font-weight: 500;
          font-size: clamp(38px, 5vw, 92px); line-height: 1.02; letter-spacing: -0.03em;
          margin: 0; color: ${TEXT}; max-width: 15ch;
        }
        .cc-bp-p {
          font-family: 'Inter', sans-serif;
          font-size: clamp(16px, 1.3vw, 20px); line-height: 1.72;
          color: ${MUTED}; margin: clamp(24px, 2.8vw, 38px) 0 0; max-width: 46ch;
        }
        .cc-bp-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 12px;
          align-self: flex-start; margin-top: clamp(32px, 4vw, 52px);
          min-height: 60px; padding: 18px clamp(34px, 3.6vw, 54px);
          background: ${GLOSS}; color: #fff; text-decoration: none; border-radius: 100px;
          font-family: 'Inter', sans-serif; font-weight: 700;
          font-size: clamp(15px, 1.2vw, 18px); letter-spacing: 0.2px;
          box-shadow: ${ACCENT_RIM}, ${ACCENT_CAST};
          transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .4s ease; will-change: transform;
        }
        .cc-bp-btn svg { transition: transform .45s cubic-bezier(.16,1,.3,1); will-change: transform; }
        .cc-bp-btn:hover {
          transform: translateY(-3px);
          box-shadow: ${ACCENT_RIM}, 0 16px 28px -10px rgba(156,67,36,0.6), 0 38px 66px -26px rgba(156,67,36,0.72);
        }
        .cc-bp-btn:hover svg { transform: translateX(4px); }

        /* reversed row: text left, image right (desktop) */
        .cc-bp-row.reverse .cc-bp-media { order: 2; }
        .cc-bp-row.reverse .cc-bp-panel { order: 1; }

        @media (max-width: 900px) {
          .cc-bp-row, .cc-bp-row.reverse { grid-template-columns: 1fr; }
          .cc-bp-media, .cc-bp-row.reverse .cc-bp-media { order: 1; min-height: clamp(300px, 66vw, 460px); }
          .cc-bp-panel, .cc-bp-row.reverse .cc-bp-panel { order: 2; padding: clamp(44px, 10vw, 72px) clamp(24px, 6vw, 56px); }
        }
      `}</style>

      <Row
        eyebrow="Your Brand, Represented"
        heading="A support team that feels like your own"
        body="Your customers never feel handed off. We train, staff and manage a dedicated team that speaks in your voice and follows your playbook - so every call, chat and email sounds like it came from inside your business."
        cta={{ label: 'Book a Free Consultation', to: '/contact#write' }}
        img={{ src: '/images/support-agent.jpg', alt: 'Customer support agent wearing a headset, assisting a customer' }}
      />

      <Row
        reverse
        eyebrow="Built To Scale"
        heading="Scale your support up or down, on demand"
        body="Launches, seasonal peaks, quiet weeks - your team flexes to match. Add trained agents in days, not months, and only pay for the capacity you actually use. No recruitment, no overheads, no idle staff to carry."
        cta={{ label: 'See How It Works', to: '/services' }}
        img={{ src: '/images/support-team.jpg', alt: 'Call centre agents on headsets supporting customers in a modern office' }}
      />
    </section>
  )
}
