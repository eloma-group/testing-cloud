import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { MaskReveal, useParallax } from '../../lib/anim'

const TEXT   = '#2E3A34'
const ACCENT = '#C6866B'
const DARK   = '#3E4A42'
const CREAM  = '#F4F1EB'
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* Statement copy as tokens so each word can be masked in individually. */
type Tok = { t: string; k?: 'brand' | 'mark' }
const plain = (s: string): Tok[] => s.split(' ').map((t) => ({ t }))

const STATEMENT: Tok[] = [
  ...plain('We are'),
  { t: 'Nexa', k: 'brand' },
  ...plain('- an outsourced support partner for growing brands. For over a decade we have staffed, trained and managed'),
  { t: 'dedicated', k: 'mark' },
  { t: 'teams', k: 'mark' },
  ...plain('that answer every call, chat and email as a true extension of your business.'),
]

const STATS = [
  { v: '10+',  l: 'Years building support teams' },
  { v: '24/7', l: 'Cover across every time zone' },
  { v: '92%',  l: 'Issues fixed on first contact' },
]

const wordV: Variants = { hidden: { y: '115%' }, show: { y: 0 } }
const lineV: Variants = { hidden: { scaleX: 0 }, show: { scaleX: 1 } }

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

        /* ── intro: rail / statement / stats ── */
        .cc-au-intro {
          position: relative;
          max-width: min(calc(100vw - 140px), 1760px);
          margin: 0 auto;
          padding: clamp(64px, 10vw, 150px) clamp(24px, 4vw, 64px) clamp(56px, 8vw, 118px);
          display: grid;
          grid-template-columns: minmax(150px, 0.5fr) minmax(0, 2.15fr) minmax(230px, 0.85fr);
          gap: clamp(28px, 4vw, 76px);
          align-items: start;
        }
        .cc-au-intro::before {
          content: ''; position: absolute; z-index: 0; pointer-events: none;
          top: -6%; right: -8%; width: min(46vw, 620px); aspect-ratio: 1;
          background: radial-gradient(closest-side, rgba(198,134,107,0.16), transparent 72%);
        }
        .cc-au-intro > * { position: relative; z-index: 1; }

        /* left rail */
        .cc-au-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 9px 16px 9px 13px; border-radius: 100px;
          border: 1px solid rgba(46,58,52,0.14); background: rgba(255,255,255,0.55);
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.78vw, 13px); letter-spacing: 2.4px;
          color: ${TEXT}; margin: 0;
        }
        .cc-au-eyebrow i {
          width: 7px; height: 7px; border-radius: 50%; background: ${ACCENT};
          animation: cc-au-pulse 2.6s cubic-bezier(.4,0,.6,1) infinite;
        }
        @keyframes cc-au-pulse {
          0%        { box-shadow: 0 0 0 0 rgba(198,134,107,0.5); }
          70%, 100% { box-shadow: 0 0 0 9px rgba(198,134,107,0); }
        }
        .cc-au-rail-line {
          width: 1px; height: clamp(40px, 5vw, 82px); margin: clamp(20px, 2.4vw, 34px) 0 0 14px;
          background: linear-gradient(180deg, ${ACCENT}, rgba(198,134,107,0));
          transform-origin: top; will-change: transform;
        }

        /* statement */
        .cc-au-para {
          font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
          font-size: clamp(26px, 3.05vw, 54px); line-height: 1.3; letter-spacing: -0.012em;
          color: ${TEXT}; margin: 0; max-width: 24ch;
        }
        .cc-au-w {
          display: inline-block; overflow: hidden; vertical-align: bottom;
          padding-bottom: 0.14em; margin: 0 0.24em 0 0;
        }
        .cc-au-w > span { display: inline-block; will-change: transform; }
        .cc-au-brand { position: relative; color: ${ACCENT}; }
        .cc-au-brand em {
          position: absolute; left: 0; right: 0; bottom: 0.1em; height: 0.055em;
          border-radius: 2px; background: ${ACCENT}; opacity: 0.75;
          transform-origin: left center; will-change: transform;
        }
        .cc-au-mark { color: ${ACCENT}; font-style: italic; }

        /* stats column */
        .cc-au-stats { display: grid; gap: 0; align-self: start; }
        .cc-au-stat { padding: clamp(14px, 1.5vw, 22px) 0; border-top: 1px solid rgba(46,58,52,0.13); }
        .cc-au-stat:first-child { border-top: 0; padding-top: 0; }
        .cc-au-stat b {
          display: block; font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
          font-size: clamp(30px, 2.5vw, 46px); line-height: 1; letter-spacing: -0.02em; color: ${TEXT};
        }
        .cc-au-stat span {
          display: block; margin-top: 8px;
          font-family: 'Inter', sans-serif; font-weight: 600; font-size: clamp(13px, 0.95vw, 15px);
          line-height: 1.6; color: rgba(46,58,52,0.55);
        }

        /* single smooth curve divider */
        .cc-au-wave { display: block; width: 100%; height: clamp(60px, 8vw, 130px); }
        .cc-au-wave path { fill: ${DARK}; }

        /* dark showcase: word / oval / word */
        .cc-au-showcase {
          background: ${DARK}; position: relative; isolation: isolate;
          padding: clamp(8px, 1.5vw, 24px) clamp(24px, 4vw, 64px) clamp(64px, 9vw, 140px);
          text-align: center; overflow: hidden;
        }
        .cc-au-word-wrap { position: relative; z-index: 4; pointer-events: none; }
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

        @media (min-width: 1920px) {
          .cc-au-intro { max-width: min(calc(100vw - 140px), 1900px); }
        }
        @media (min-width: 2560px) {
          .cc-au-intro { max-width: min(calc(100vw - 160px), 2400px); }
        }

        /* stats drop under the statement, still a row */
        @media (max-width: 1180px) {
          .cc-au-intro { grid-template-columns: minmax(0, 1fr); }
          .cc-au-para { max-width: 28ch; }
          .cc-au-stats {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: clamp(20px, 3vw, 40px);
            padding-top: clamp(28px, 4vw, 44px); border-top: 1px solid rgba(46,58,52,0.13);
          }
          .cc-au-stat { padding: 0; border-top: 0; }
          .cc-au-stat:first-child { padding-top: 0; }
        }
        @media (max-width: 900px) {
          .cc-au-intro { max-width: 100%; }
          .cc-au-para { max-width: 100%; }
          .cc-au-oval { width: calc(100vw - 36px); aspect-ratio: 4 / 5; border-radius: 46%; margin: -9vw auto; }
        }
        @media (max-width: 800px) {
          .cc-au-stats { grid-template-columns: minmax(0, 1fr); gap: 22px; }
          .cc-au-stat { display: flex; align-items: baseline; gap: 16px; }
          .cc-au-stat b { min-width: 3.4ch; }
          .cc-au-stat span { margin-top: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-au-eyebrow i { animation: none; }
        }
      `}</style>

      {/* ── Intro: rail / statement / stats ── */}
      <div className="cc-au-intro">
        <div>
          <motion.p className="cc-au-eyebrow" {...fade(0)}>
            <i aria-hidden /> About Us
          </motion.p>
          <motion.div
            className="cc-au-rail-line"
            aria-hidden
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.18, duration: 0.9, ease: EASE }}
          />
        </div>

        <motion.p
          className="cc-au-para"
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {STATEMENT.map((w, i) => (
            <span className="cc-au-w" key={`${w.t}-${i}`}>
              <motion.span
                className={w.k === 'brand' ? 'cc-au-brand' : w.k === 'mark' ? 'cc-au-mark' : undefined}
                variants={wordV}
                transition={{ duration: 0.9, ease: EASE, delay: 0.06 + i * 0.026 }}
              >
                {w.t}
                {w.k === 'brand' && (
                  <motion.em
                    aria-hidden
                    variants={lineV}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
                  />
                )}
              </motion.span>
            </span>
          ))}
        </motion.p>

        <motion.div className="cc-au-stats" {...fade(0.24)}>
          {STATS.map((s) => (
            <div className="cc-au-stat" key={s.v}>
              <b>{s.v}</b>
              <span>{s.l}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Single smooth curve ── */}
      <svg className="cc-au-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
        <path d="M0,32 C440,104 1000,104 1440,40 L1440,120 L0,120 Z" />
      </svg>

      {/* ── Dark showcase (word / oval / word) ── */}
      <div className="cc-au-showcase">
        <div className="cc-au-word-wrap">
          <MaskReveal as="h2" className="cc-au-word" duration={1} inView={false}>Always</MaskReveal>
        </div>

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

        <div className="cc-au-word-wrap">
          <MaskReveal as="h2" className="cc-au-word" duration={1} delay={0.06} inView={false}>Answered</MaskReveal>
        </div>
      </div>
    </section>
  )
}
