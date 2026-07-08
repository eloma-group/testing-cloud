# Call Center Landing — Project Rules

## Punctuation (MANDATORY)

- **Never use em-dashes (`—`) or en-dashes (`–`) in any user-facing copy** (headings, paragraphs, captions, eyebrows, alt text, etc.). Always use a normal hyphen (`-`), surrounded by spaces when separating clauses: `... reliable support - built for scale`.
- This applies to all new and edited components, pages, and content.
- Exception: the box-drawing glyph `──` used inside JSX section-divider comments (e.g. `{/* ── Hero ── */}`) is allowed, since it is a structural comment marker, not copy.

## Responsive Design (MANDATORY)

Every page and component **must** be fully responsive across all breakpoints below.
This rule applies to every code change, new section, new page, or UI edit — no exceptions.

### Breakpoints

| Name        | Width range      | Notes                                 |
|-------------|------------------|---------------------------------------|
| Mobile S    | 320px – 374px    | Small Android phones                  |
| Mobile      | 375px – 539px    | iPhone SE → iPhone 15                 |
| Mobile L    | 540px – 767px    | Large phones, landscape mode          |
| Tablet      | 768px – 1023px   | iPad portrait, Android tablets        |
| Tablet L    | 1024px – 1279px  | iPad landscape, small laptops         |
| Desktop     | 1280px – 1535px  | Standard laptop / 1080p monitor       |
| Desktop L   | 1536px – 1919px  | 1.5K / large laptop                   |
| 2K          | 1920px – 2559px  | Full HD / 2K monitors (Australian)    |
| 4K / Ultra  | 2560px+          | 4K, ultra-wide, Studio Display        |

### Rules

1. **No hard pixel widths** on layout containers — use `clamp()`, `%`, `vw`, or CSS Grid/Flexbox.
2. **Content max-width** must scale up for large screens. Use `maxWidth: 1760` (not 1280) as the base, and add `@media (min-width: 1920px)` overrides to push wider.
3. **Wide content, minimal bezel (MOST IMPORTANT)** — content must sit close to the screen edges on all screen sizes. Keep horizontal padding tight and capped low so content feels full-width and edge-to-edge, not like a narrow box floating in the middle of a wide screen.
   - Use `clamp(24px, 4vw, 64px)` for horizontal section padding — the max must never exceed **80px**
   - Never add extra left/right margin or padding just because the screen is bigger
   - On 1920px: content should occupy ~1780px of the 1920px viewport (only ~70px bezel each side)
   - On 2560px: content should occupy ~2420px (only ~70–80px bezel each side)
   - The `maxWidth` inner container must match this — use `min(calc(100vw - 140px), 2400px)` for fluid wide layouts
4. **Section padding (vertical)** must use `clamp()`: `clamp(48px, 8vw, 140px)` for top/bottom.
4. **Typography** must use `clamp(minPx, Xvw, maxPx)` — never fixed `px` font-sizes on headings or body text.
5. **Grids** must collapse via CSS class + `@media` rules:
   - 3-col → 1-col at ≤ 800px
   - 2-col → 1-col at ≤ 768px
6. **Images/banners** must use `object-fit: cover` and `width: 100%` so they never overflow or go letterboxed.
7. **Touch targets** (buttons, links) must be at least 44×44px on mobile.
8. **Sticky/fixed elements** (Header) must not obscure content on any viewport.
9. **Overflow** — every page wrapper must have `overflowX: hidden` to prevent horizontal scroll on mobile.
10. **Test mentally at every breakpoint** listed above before marking a task done.

### Large-screen pattern (2K / 4K)

```css
/* Default: works up to ~1920px */
.section-inner { max-width: 1760px; margin: 0 auto; }

/* 2K */
@media (min-width: 1920px) {
  .section-inner { max-width: 1900px; }
}

/* 4K / Ultra-wide */
@media (min-width: 2560px) {
  .section-inner { max-width: 2400px; }
}
```

---

## Typography Scale (MANDATORY)

This project uses **large, editorial font sizes** — much bigger than typical websites. Always match the scale below. Never use timid/small type on headings.

### Type roles & clamp values

| Role | Usage | clamp value |
|------|-------|-------------|
| **Display / Wordmark** | Full-bleed hero text, giant background letters | `clamp(80px, 16–26vw, 220–440px)` |
| **Hero heading** (H1) | InnerHero main line, page-level title | `clamp(52px, 10.5vw, 136px)` |
| **Section heading** (H2) | CTA blocks, manifesto lines | `clamp(52px, 10–11vw, 140–152px)` |
| **Sub-heading** | Culture cards, feature headings | `clamp(32px, 4–7vw, 62–92px)` |
| **Card heading** | Value row titles, bento headings | `clamp(24px, 3.2vw, 56px)` |
| **Body / paragraph** | Standard prose, descriptions | `clamp(14px, 1.15–1.35vw, 17–19px)` |
| **Meta value** | Stats, sidebar figures | `clamp(15px, 1.2vw, 20px)` |
| **Label / eyebrow** | Uppercase badge text above headings | `clamp(10px, 0.75–0.85vw, 12–14px)` |

### Rules

- **All headings are uppercase** with `letterSpacing: '-0.04em'` to `-0.05em` and `fontWeight: 900` — EXCEPT the editorial serif display headings (see below), which keep natural case.
- **Section headings start at 52px minimum** — never below that, even on mobile.
- Display text (wordmarks, giant background numbers) uses `vw` as the primary unit so it truly scales with the viewport — the clamp max can go as high as needed.
- Body text sits between 14–19px — don't go smaller than 14px even on mobile.
- Eyebrow/badge labels are always `fontWeight: 800`, `letterSpacing: '2–2.5px'`, `textTransform: 'uppercase'`.
- Line height for headings: `0.88–1.0`. Line height for body: `1.75–1.88`.

---

## 120fps Scroll Smoothness (MANDATORY)

Every page must target 120fps scrolling. No exceptions — this applies to every component, animation, and scroll-driven effect.

### Rules

1. **Compositor-only transforms** — animate only `transform` and `opacity`. Never animate `top`, `left`, `width`, `height`, `margin`, `padding`, `border`, or any property that triggers layout or paint.
2. **`will-change`** — add `will-change: transform` (or `transform, opacity`) to any element that animates on scroll. Remove it from static elements.
3. **No layout thrashing** — never read and write DOM geometry in the same frame. Batch reads first, then writes.
4. **Framer Motion** — always use `useTransform` / `useScroll` for scroll-driven values. Never compute scroll position inside `useEffect` with `window.addEventListener('scroll', ...)`.
5. **Lenis** — all pages must run through the global Lenis smooth-scroll instance. Never disable or bypass it.
6. **CSS animations** — use `animation` + `@keyframes` only for looping ambient effects. Set `animation-timing-function: linear` or `cubic-bezier` — never `ease` on scroll-synced elements.
7. **`pointer-events: none`** on all decorative/ambient layers (floating shapes, watermarks, background blobs) so they never interrupt hit-testing during scroll.
8. **Avoid `backdrop-filter`** on large or scroll-pinned surfaces — it forces a compositing layer and can halve frame rate on mid-range devices. Use it only on small, fixed-size UI elements (badges, pills, modals).
9. **No scroll jank from images/video** — all `<img>` and `<video>` elements in scroll containers must have `decoding="async"` and explicit `width`/`height` or an `aspect-ratio` set so the browser doesn't reflow on load.
10. **Test on a mid-range device mental model** — if an animation requires GPU compositing of more than 3 overlapping layers, simplify it.

---

## Tech Stack

- React 19 + TypeScript
- Vite
- Framer Motion (animations)
- React Router v7
- Lenis (smooth scroll)
- Lucide React (icons)
- Inline styles + scoped `<style>` blocks (no CSS modules or Tailwind utility classes for layout)

## Fonts

Same as the Eloma Group site: **Inter** (body / UI) and **Poppins** (headings / display). Loaded from Google Fonts in `index.html`.

## Colour Tokens

```ts
TEXT   = '#2E3A34'              // deep charcoal-green — primary text & headings
ACCENT = '#C6866B'             // terracotta — buttons, CTAs, highlights
DARK   = '#3E4A42'             // muted sage — footer, dark sections
CREAM  = '#F4F1EB'             // warm off-white — page background
MUTED  = 'rgba(46,58,52,0.55)' // secondary text
```

Never hardcode these hex values directly — define them as `const` at the top of each component file.
