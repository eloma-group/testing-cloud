import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { MaskReveal, useParallax } from '../../lib/anim'

const TEXT   = '#2E3A34'
const ACCENT = '#C6866B'
const DARK   = '#3E4A42'
const CREAM  = '#F4F1EB'
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

export function AboutUs() {
  const reduce = useReducedMotion() ?? false
  const ovalRef = useRef<HTMLDivElement>(null)
  const ovalImgY = useParallax(ovalRef, 34)
  const fade = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { delay: d, duration: 0.85, ease: EASE },
  })

  return (
    <section className="cc-au" id="about" aria-label="About us">
      <style>{`
        .cc-au { background: ${CREAM}; overflow: hidden; }

        /* intro paragraph block */
        .cc-au-intro {
          max-width: min(calc(100vw - 140px), 1200px);
          margin: 0 auto;
          padding: clamp(64px, 11vw, 160px) clamp(24px, 4vw, 64px) clamp(48px, 7vw, 96px);
          text-align: center;
        }
        .cc-au-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px;
          color: ${ACCENT}; margin: 0 0 clamp(24px, 3vw, 40px);
        }
        .cc-au-eyebrow::before,
        .cc-au-eyebrow::after {
          content: ''; width: clamp(26px, 4vw, 54px); height: 1px;
          background: ${ACCENT}; opacity: 0.6;
        }
        .cc-au-para {
          font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
          font-size: clamp(24px, 3.1vw, 52px); line-height: 1.32; letter-spacing: -0.01em;
          color: ${TEXT}; margin: 0 auto; max-width: 22ch;
        }
        .cc-au-para span { color: ${ACCENT}; }

        /* single smooth curve divider */
        .cc-au-wave { display: block; width: 100%; height: clamp(60px, 8vw, 130px); }
        .cc-au-wave path { fill: ${DARK}; }

        /* dark showcase: word / oval / word */
        .cc-au-showcase {
          background: ${DARK}; position: relative;
          padding: clamp(8px, 1.5vw, 24px) clamp(24px, 4vw, 64px) clamp(64px, 9vw, 140px);
          text-align: center; overflow: hidden;
        }
        .cc-au-word {
          font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
          font-size: clamp(64px, 15vw, 260px); line-height: 0.92; letter-spacing: -0.02em;
          color: ${CREAM}; margin: 0; position: relative; z-index: 2;
          pointer-events: none;
        }
        .cc-au-oval {
          position: relative; z-index: 1;
          width: min(calc(100vw - 100px), 2360px);
          margin: clamp(-130px, -7vw, -56px) auto;
          aspect-ratio: 12 / 5; border-radius: 50%; overflow: hidden;
          will-change: transform;
          box-shadow: 0 40px 90px -40px rgba(0,0,0,0.55);
        }
        .cc-au-oval img {
          width: 100%; height: 100%; object-fit: cover; object-position: center;
          will-change: transform;
        }
        .cc-au-btn {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(4deg);
          z-index: 3; display: inline-flex; align-items: center; gap: 10px;
          min-height: 56px; padding: 16px clamp(26px, 3vw, 42px);
          background: ${CREAM}; color: ${TEXT}; text-decoration: none; border-radius: 100px;
          font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: clamp(12px, 1vw, 15px); letter-spacing: 1.4px;
          box-shadow: 0 24px 50px -20px rgba(0,0,0,0.5);
          transition: transform .45s cubic-bezier(.16,1,.3,1), background .35s ease; will-change: transform;
        }
        .cc-au-btn svg { transition: transform .45s cubic-bezier(.16,1,.3,1); will-change: transform; }
        .cc-au-btn:hover { background: ${ACCENT}; color: #fff; transform: translate(-50%, -50%) rotate(4deg) translateY(-3px); }
        .cc-au-btn:hover svg { transform: translateX(4px); }

        @media (max-width: 900px) {
          .cc-au-intro { max-width: 100%; }
          .cc-au-para { max-width: 26ch; }
          .cc-au-oval { width: calc(100vw - 36px); aspect-ratio: 4 / 5; border-radius: 46%; margin: -9vw auto; }
        }
      `}</style>

      {/* ── Intro paragraph ── */}
      <div className="cc-au-intro">
        <motion.p className="cc-au-eyebrow" {...fade(0)}>About Us</motion.p>
        <motion.p className="cc-au-para" {...fade(0.08)}>
          We are Nexa - an outsourced support partner for growing brands. For over a decade we have
          staffed, trained and managed <span>dedicated teams</span> that answer every call, chat and
          email as a true extension of your business.
        </motion.p>
      </div>

      {/* ── Single smooth curve ── */}
      <svg className="cc-au-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
        <path d="M0,32 C440,104 1000,104 1440,40 L1440,120 L0,120 Z" />
      </svg>

      {/* ── Dark showcase (word / oval / word) ── */}
      <div className="cc-au-showcase">
        <MaskReveal as="h2" className="cc-au-word" duration={1}>Always</MaskReveal>

        <motion.div
          className="cc-au-oval"
          ref={ovalRef}
          initial={reduce ? { opacity: 1, y: 0, rotate: -4 } : { opacity: 0, y: 24, rotate: -4 }}
          whileInView={{ opacity: 1, y: 0, rotate: -4 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.12, duration: 0.85, ease: EASE }}
        >
          <motion.img
            src="/images/team-support.jpg"
            alt="Nexa support agents working on headsets and laptops in a warm shared workspace"
            width={1120} height={770} loading="lazy" decoding="async"
            style={reduce ? { scale: 1.12 } : { y: ovalImgY, scale: 1.12 }}
          />
          <a className="cc-au-btn" href="#contact">
            Book a Free Call
            <ArrowRight size={17} strokeWidth={2.4} aria-hidden />
          </a>
        </motion.div>

        <MaskReveal as="h2" className="cc-au-word" duration={1} delay={0.06}>Answered</MaskReveal>
      </div>
    </section>
  )
}
