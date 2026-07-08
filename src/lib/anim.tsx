import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { ElementType, ReactNode, RefObject } from 'react'

/* ──────────────────────────────────────────────────────────────
   Shared motion system. Compositor-only (transform / opacity),
   scroll-driven values via useScroll/useTransform. 120fps-safe.
   ────────────────────────────────────────────────────────────── */

export const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
export const VIEWPORT = { once: true, margin: '-90px' } as const

/* Stagger container + fade-up item variants */
export const staggerParent = (stagger = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
})

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
}

export const popUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE } },
}

/* Masked reveal: inner content rises up from behind a clip.
   Keeps child markup intact (accent spans, etc.). */
export function MaskReveal({
  children,
  className,
  as = 'div',
  delay = 0,
  duration = 0.9,
  inView = true,
}: {
  children: ReactNode
  className?: string
  as?: ElementType
  delay?: number
  duration?: number
  /** true: reveal when scrolled into view. false: reveal on mount (above-the-fold). */
  inView?: boolean
}) {
  const reduce = useReducedMotion() ?? false
  const Tag = as

  if (reduce) {
    return <Tag className={className}>{children}</Tag>
  }

  const trigger = inView
    ? { whileInView: { y: 0 }, viewport: VIEWPORT }
    : { animate: { y: 0 } }

  return (
    <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.14em', marginBottom: '-0.14em' }}>
      <motion.span
        style={{ display: 'block', willChange: 'transform' }}
        initial={{ y: '118%' }}
        {...trigger}
        transition={{ duration, ease: EASE, delay }}
      >
        <Tag className={className}>{children}</Tag>
      </motion.span>
    </span>
  )
}

/* Scroll-linked parallax: maps element progress through the viewport
   to a px offset. Always call the hooks; caller decides whether to apply. */
export function useParallax(
  target: RefObject<HTMLElement | null>,
  distance = 60,
  offset: [string, string] = ['start end', 'end start'],
) {
  const { scrollYProgress } = useScroll({
    target: target as RefObject<HTMLElement>,
    offset: offset as never,
  })
  return useTransform(scrollYProgress, [0, 1], [distance, -distance])
}
