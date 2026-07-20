import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useRef } from 'react'
import type { CSSProperties, ElementType, ReactNode, RefObject } from 'react'

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

/* ──────────────────────────────────────────────────────────────
   The entry vocabulary.

   Every page draws from this set, and no page draws only one
   card from it - a section that fades is followed by one that
   slides, then one that folds - so the scroll never settles into
   a single tic. All of them move transform and opacity only, so
   each one composites on the GPU and costs the same as a fade.
   ────────────────────────────────────────────────────────────── */

/** Settles downward - good for heads sitting above the thing they name. */
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

/** Enters from the left edge. Reads well on rows and list items. */
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -64 },
  show: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE } },
}

/** Enters from the right edge - the mirror, for alternating bands. */
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 64 },
  show: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE } },
}

/** Comes forward out of the page. Best on cards and figures. */
export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.86 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.75, ease: EASE } },
}

/** Falls open on its top edge, like a card being dealt face up. */
export const flipIn: Variants = {
  hidden: { opacity: 0, rotateX: -34, y: 40, transformPerspective: 1000 },
  show: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.9, ease: EASE } },
}

/** Swings in on its left hinge - a door opening toward the reader. */
export const swingIn: Variants = {
  hidden: { opacity: 0, rotateY: -28, x: -36, transformPerspective: 1200 },
  show: { opacity: 1, rotateY: 0, x: 0, transition: { duration: 0.9, ease: EASE } },
}

/** Lands with a slight rotation off true, then straightens. */
export const tiltIn: Variants = {
  hidden: { opacity: 0, y: 46, rotate: -3.5, scale: 0.97 },
  show: { opacity: 1, y: 0, rotate: 0, scale: 1, transition: { duration: 0.85, ease: EASE } },
}

/** Grows out of its left edge and settles - for bars, rails and wide slabs.
    Scales uniformly rather than on X alone, so type never stretches. */
export const unfoldLeft: Variants = {
  hidden: { opacity: 0, x: -48, scale: 0.94, originX: 0 },
  show: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.9, ease: EASE } },
}

/** A longer, heavier rise - for large single blocks rather than grids. */
export const driftUp: Variants = {
  hidden: { opacity: 0, y: 76 },
  show: { opacity: 1, y: 0, transition: { duration: 1.05, ease: EASE } },
}

/**
 * One element, one entry. Wraps a single block in any of the variants
 * above without having to hand-write initial / whileInView each time.
 */
export function Reveal({
  children,
  variant = fadeUp,
  delay = 0,
  className,
  style,
  as = 'div',
}: {
  children: ReactNode
  variant?: Variants
  delay?: number
  className?: string
  style?: CSSProperties
  as?: 'div' | 'p' | 'section' | 'article' | 'span'
}) {
  const reduce = useReducedMotion() ?? false
  const Tag = motion[as]

  return (
    <Tag
      className={className}
      style={{ ...style, willChange: 'transform, opacity' }}
      variants={variant}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </Tag>
  )
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

  /* Observe the clipping wrapper, never the masked child: the child starts
     translated fully outside the wrapper's overflow:hidden box, and an
     IntersectionObserver clips against ancestors, so it would never report
     itself as visible and the reveal would never fire. */
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, VIEWPORT)

  if (reduce) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <span
      ref={ref}
      style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.14em', marginBottom: '-0.14em' }}
    >
      <motion.span
        style={{ display: 'block', willChange: 'transform' }}
        initial={{ y: '118%' }}
        animate={{ y: inView && !seen ? '118%' : 0 }}
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
