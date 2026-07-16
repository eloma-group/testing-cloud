import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { EASE, MaskReveal } from '../../lib/anim'

const ACCENT    = '#998EFF'
const ACCENT_HI = '#C3BCFF'

export function Hero() {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-3%', '6%'])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 110])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  const fade = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: d, duration: 0.9, ease: EASE },
  })

  return (
    <section className="cc-hero" id="top" aria-label="Hero" ref={ref}>
      <style>{`
        .cc-hero {
          position: relative; overflow: hidden;
          min-height: 100svh;
          display: flex; align-items: flex-end;
          padding: clamp(120px, 15vh, 220px) clamp(24px, 4vw, 64px) clamp(56px, 9vh, 120px);
          background-color: #14111F;
        }
        .cc-hero-bg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: center top;
          z-index: 0; pointer-events: none;
        }
        /* Scrim: keeps the copy legible over the brightest frames of the video.
           Weighted to the bottom, where the content sits. */
        .cc-hero-scrim {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            linear-gradient(
              to top,
              rgba(12,10,20,0.72) 0%,
              rgba(12,10,20,0.55) 26%,
              rgba(12,10,20,0.30) 52%,
              rgba(12,10,20,0.12) 76%,
              rgba(12,10,20,0.04) 100%
            );
        }
        /* the glass edge where the hero meets the section under it */
        .cc-hero-gloss {
          position: absolute; inset: auto 0 0 0; z-index: 1; height: 1px; pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
        }
        .cc-hero-inner {
          position: relative; z-index: 2;
          width: 100%; max-width: 1760px; margin: 0 auto;
        }
        .cc-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(11px, 0.82vw, 13px); letter-spacing: 2.8px;
          color: #FFFFFF; margin: 0 0 clamp(18px, 2.2vw, 28px);
          text-shadow: 0 1px 2px rgba(0,0,0,0.35);
        }
        .cc-hero-eyebrow::before { content: ''; width: clamp(26px, 4vw, 54px); height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, ${ACCENT_HI}, ${ACCENT}, transparent); }
        .cc-hero-h1 {
          font-family: 'Universal Sans', sans-serif; font-weight: 600;
          font-size: clamp(34px, 5.3vw, 84px); line-height: 1.03; letter-spacing: -0.025em;
          margin: 0; color: #fff; max-width: 18ch;
          text-shadow: 0 1px 2px rgba(0,0,0,0.28);
        }
        /* Solid fill, not a clipped gradient: a transparent text-fill lets the
           h1's text-shadow bleed through the glyphs, which reads as blur over
           the video and mutes the accent hue. */
        .cc-hero-h1 .accent {
          color: ${ACCENT_HI};
          -webkit-text-fill-color: ${ACCENT_HI};
        }
        .cc-hero-p {
          font-family: 'Universal Sans', sans-serif; font-weight: 400;
          font-size: clamp(15px, 1.35vw, 19px); line-height: 1.75;
          color: rgba(255,255,255,0.94); max-width: 560px;
          margin: clamp(22px, 2.6vw, 34px) 0 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        @media (min-width: 1920px) {
          .cc-hero-p { max-width: 680px; }
        }
        @media (min-width: 2560px) {
          .cc-hero-inner { max-width: 2400px; }
          .cc-hero-p { max-width: 860px; }
        }
        @media (max-width: 640px) {
          .cc-hero { min-height: 92svh; }
          .cc-hero-p { max-width: 100%; }
        }
      `}</style>

      {reduce ? (
        <img className="cc-hero-bg" src="/images/hero-poster.jpg" alt="" aria-hidden decoding="async" />
      ) : (
        <motion.video
          className="cc-hero-bg"
          style={{ y: bgY, scale: 1.12 }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
          disablePictureInPicture
          aria-hidden
          width={1920}
          height={1080}
        >
          <source src="/images/hero.mp4" type="video/mp4" />
        </motion.video>
      )}

      <span className="cc-hero-scrim" aria-hidden />
      <span className="cc-hero-gloss" aria-hidden />

      <motion.div className="cc-hero-inner" style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}>
        <motion.p className="cc-hero-eyebrow" {...fade(0.02)}>Outsourced Customer Support</motion.p>

        <MaskReveal as="h1" className="cc-hero-h1" delay={0.08} duration={1} inView={false}>
          Your customers' calls, answered in <span className="accent">your name</span>.
        </MaskReveal>

        <motion.p className="cc-hero-p" {...fade(0.34)}>
          We give you a fully trained, dedicated support team that handles every call,
          resolves every query, and represents your brand - so you never have to hire,
          train, or manage support staff again.
        </motion.p>
      </motion.div>
    </section>
  )
}
