import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { MaskReveal, useParallax } from '../../lib/anim'

const TEXT   = '#2E3A34'
const ACCENT = '#C6866B'
const MINT   = '#DEE8E2' // soft sage-mint panel
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

type RowProps = {
  reverse?: boolean
  eyebrow: string
  heading: string
  body: string
  cta: { label: string; href: string }
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
        <motion.a className="cc-bp-btn" href={cta.href} {...rise(0.24)}>
          {cta.label}
          <ArrowRight size={19} strokeWidth={2.4} aria-hidden />
        </motion.a>
      </div>
    </div>
  )
}

export function BrandPromise() {
  return (
    <section className="cc-bp" id="brand-promise" aria-label="Your brand, represented">
      <style>{`
        .cc-bp { background: ${MINT}; overflow: hidden; }
        .cc-bp-row { display: grid; grid-template-columns: 1fr 1fr; }

        /* full-bleed photo */
        .cc-bp-media { position: relative; min-height: clamp(360px, 42vw, 640px); overflow: hidden; }
        .cc-bp-media img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          will-change: transform;
        }

        /* content panel */
        .cc-bp-panel {
          display: flex; flex-direction: column; justify-content: center;
          padding: clamp(48px, 6vw, 120px) clamp(28px, 5vw, 96px);
        }
        .cc-bp-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px;
          color: ${ACCENT}; margin: 0 0 clamp(20px, 2.4vw, 30px);
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
          color: rgba(46,58,52,0.72); margin: clamp(24px, 2.8vw, 38px) 0 0; max-width: 46ch;
        }
        .cc-bp-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 12px;
          align-self: flex-start; margin-top: clamp(32px, 4vw, 52px);
          min-height: 60px; padding: 18px clamp(34px, 3.6vw, 54px);
          background: ${ACCENT}; color: #fff; text-decoration: none; border-radius: 100px;
          font-family: 'Inter', sans-serif; font-weight: 700;
          font-size: clamp(15px, 1.2vw, 18px); letter-spacing: 0.2px;
          box-shadow: 0 18px 40px -20px rgba(198,134,107,0.7);
          transition: transform .45s cubic-bezier(.16,1,.3,1), background .4s ease; will-change: transform;
        }
        .cc-bp-btn svg { transition: transform .45s cubic-bezier(.16,1,.3,1); will-change: transform; }
        .cc-bp-btn:hover { background: #b5765c; transform: translateY(-3px); }
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
        cta={{ label: 'Book a Free Consultation', href: '#contact' }}
        img={{ src: '/images/support-agent.jpg', alt: 'Customer support agent wearing a headset, assisting a customer' }}
      />

      <Row
        reverse
        eyebrow="Built To Scale"
        heading="Scale your support up or down, on demand"
        body="Launches, seasonal peaks, quiet weeks - your team flexes to match. Add trained agents in days, not months, and only pay for the capacity you actually use. No recruitment, no overheads, no idle staff to carry."
        cta={{ label: 'See How It Works', href: '#services' }}
        img={{ src: '/images/support-team.jpg', alt: 'Call centre agents on headsets supporting customers in a modern office' }}
      />
    </section>
  )
}
