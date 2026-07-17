import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { EASE } from '../../lib/anim'

/* ──────────────────────────────────────────────────────────────
   A premium glass frame holding two photographs back to back.
   The frame turns on rotateY every few seconds (or on click /
   Enter), preserve-3d keeping both faces honest through the turn.
   The whole card is a real <button>, so the flip is keyboard
   reachable, and with reduced motion the turn collapses to an
   instant swap.
   ────────────────────────────────────────────────────────────── */

export type FlipFace = { src: string; alt: string }

export function FlipImageCard({
  front,
  back,
  label,
  autoMs = 3500,
  startDelay = 0,
  className = '',
}: {
  front: FlipFace
  back: FlipFace
  label: string
  autoMs?: number
  startDelay?: number
  className?: string
}) {
  const reduce = useReducedMotion() ?? false
  const [flipped, setFlipped] = useState(false)
  /* bumping this key restarts the auto-flip timer after a manual flip */
  const [timerKey, setTimerKey] = useState(0)

  const ref = useRef<HTMLButtonElement>(null)
  const inView = useInView(ref, { margin: '-60px' })

  useEffect(() => {
    if (reduce || !inView) return
    let interval: ReturnType<typeof setInterval> | undefined
    const lead = setTimeout(() => {
      setFlipped((f) => !f)
      interval = setInterval(() => setFlipped((f) => !f), autoMs)
    }, autoMs + startDelay)
    return () => {
      clearTimeout(lead)
      if (interval) clearInterval(interval)
    }
  }, [reduce, inView, autoMs, startDelay, timerKey])

  return (
    <button
      ref={ref}
      type="button"
      className={`fc ${className}`}
      aria-label={label}
      onClick={() => {
        setFlipped((f) => !f)
        setTimerKey((k) => k + 1)
      }}
    >
      <style>{`
        .fc {
          position: relative; display: block; width: 100%;
          padding: 0;
          border: 0; cursor: pointer; text-align: inherit;
          /* leaf shape: big top-left / bottom-right, tight top-right / bottom-left */
          border-radius:
            clamp(86px, 8.8vw, 172px) clamp(12px, 1.3vw, 22px)
            clamp(86px, 8.8vw, 172px) clamp(12px, 1.3vw, 22px);
          transform: skewX(-8deg);
          background: none;
          box-shadow: 0 30px 60px -30px rgba(40,32,100,0.35);
          will-change: transform;
          transition: transform .55s cubic-bezier(.16,1,.3,1), box-shadow .55s cubic-bezier(.16,1,.3,1);
        }
        .fc:hover, .fc:focus-visible {
          transform: skewX(-8deg) translateY(-6px) scale(1.015);
          box-shadow:
            0 44px 80px -32px rgba(40,32,100,0.5),
            0 0 40px -8px rgba(153,142,255,0.3);
        }
        .fc:focus-visible { outline: 2px solid #6A5BE8; outline-offset: 3px; }
        /* the offset outer frame: a frosted glass slab tracing the leaf,
           translucent so the strip and blobs glow through its band */
        .fc::before {
          content: ''; position: absolute; z-index: 0;
          inset: clamp(-18px, -1.5vw, -12px);
          border: 1.5px solid rgba(255,255,255,0.75);
          border-radius:
            clamp(94px, 9.6vw, 188px) clamp(16px, 1.7vw, 28px)
            clamp(94px, 9.6vw, 188px) clamp(16px, 1.7vw, 28px);
          background: linear-gradient(160deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.24) 55%, rgba(233,229,252,0.38) 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.95),
            inset 0 -16px 36px -22px rgba(153,142,255,0.35),
            0 24px 50px -28px rgba(40,32,100,0.3);
          pointer-events: none;
        }
        .fc-3d { perspective: 1400px; border-radius: inherit; }
        .fc-inner {
          position: relative; width: 100%; aspect-ratio: 3 / 4;
          transform-style: preserve-3d; will-change: transform;
        }
        .fc-face {
          position: absolute; inset: 0; overflow: hidden;
          border-radius:
            clamp(86px, 8.8vw, 172px) clamp(12px, 1.3vw, 22px)
            clamp(86px, 8.8vw, 172px) clamp(12px, 1.3vw, 22px);
          backface-visibility: hidden; -webkit-backface-visibility: hidden;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.35), inset 0 0 40px rgba(153,142,255,0.12);
        }
        .fc-face img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          /* counter-skew keeps the people upright inside the leaning frame */
          transform: skewX(8deg) scale(1.22);
        }
        .fc-face::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 26%, rgba(40,32,100,0.14) 100%);
        }
        .fc-back { transform: rotateY(180deg); }
        @media (prefers-reduced-motion: reduce) {
          .fc, .fc:hover, .fc:focus-visible { transform: skewX(-8deg); }
        }
      `}</style>

      <div className="fc-3d">
        <motion.div
          className="fc-inner"
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.9, ease: EASE }}
        >
          <div className="fc-face">
            <img
              src={front.src}
              alt={front.alt}
              width={853}
              height={1067}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="fc-face fc-back" aria-hidden={!flipped}>
            <img
              src={back.src}
              alt={back.alt}
              width={853}
              height={1067}
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>
      </div>
    </button>
  )
}
