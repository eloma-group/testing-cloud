import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Quote } from 'lucide-react'
import { PageShell, InnerHero, Band, SectionHead, CTABand } from '../components/page/PageKit'
import {
  MaskReveal, Reveal, staggerParent, VIEWPORT,
  zoomIn, slideRight, swingIn, popUp,
} from '../lib/anim'

const TEXT       = '#16141F'
const ACCENT     = '#998EFF'
const ACCENT_INK = '#6A5BE8'
const MUTED      = '#5E5B6B'
const LIVE       = '#2EBAC6'
const LIVE_INK   = '#0E7C88'   /* the label beside a live dot - teal itself is only 2.2:1 on white */

/* ──────────────────────────────────────────────────────────────
   Case studies: the results, and what they cost.

   Every case carries the same four beats - the state we found it
   in, what we changed, what moved, and one line from the person
   who signed it off. The featured case gets a switcher so you can
   read the before and the after in the same frame, which is the
   only honest way to show a number moving.
   ────────────────────────────────────────────────────────────── */

type Case = {
  id: string
  sector: string
  client: string
  tag: string
  headline: string
  found: string
  did: string[]
  moved: [string, string, string][]   // [figure, label, from]
  quote: string
  who: string
  role: string
  img: string
  alt: string
}

const FEATURED: Case = {
  id: 'harlow',
  sector: 'E-commerce',
  client: 'Harlow & Co',
  tag: 'Peak season',
  headline: 'Twelve thousand tickets in November, and nobody worked a weekend',
  found:
    'A team of six holding a queue built for sixteen. Every November the backlog hit four days, refunds went out late, and the chargebacks landed in January when everyone had already forgotten why. The founder was clearing tickets on Sunday nights, which is where most of these stories start.',
  did: [
    'Shared pod live in nine days, working the backlog oldest first',
    'Rewrote forty-one macros that were generating their own follow-ups',
    'Moved returns to a self-serve flow that deflected a third of the volume',
    'Night desk from Manila so Sunday stopped being a shift',
  ],
  moved: [
    ['0:21', 'Average answer', 'was 4 hrs'],
    ['-38%', 'Contacts per order', 'was 1.4'],
    ['96%', 'Peak SLA held', 'was 61%'],
    ['0', 'Weekends worked', 'was every one'],
  ],
  quote:
    'We did not hire a call centre, we got our Sundays back. The backlog was gone before I had finished worrying about it, and the refund complaints simply stopped arriving.',
  who: 'Elena M',
  role: 'Founder, Harlow & Co',
  img: '/images/cases/harlow.jpg',
  alt: 'Online retailer packing and labelling orders at a desk beside a rail of clothing',
}

const CASES: Case[] = [
  {
    id: 'ledgerline',
    sector: 'Fintech',
    client: 'Ledgerline',
    tag: 'Compliance',
    headline: 'An audit trail under every conversation, without slowing a single one down',
    found:
      'Two findings in one year, both for calls that were handled correctly and logged badly. The compliance officer was reviewing recordings by hand.',
    did: [
      'Every call logged against the case in their own CRM',
      'Four-eyes review on every claim over a threshold',
      'QA rubric rewritten around the regulator, not the reviewer',
    ],
    moved: [
      ['100%', 'Calls audited', 'was 12%'],
      ['0', 'Findings since', 'was 2 a year'],
      ['0:26', 'Average answer', 'was 1:40'],
    ],
    quote: 'The first quarter with Nexa was the first quarter I did not have to explain anything to anybody.',
    who: 'Dan R',
    role: 'Head of Compliance, Ledgerline',
    img: '/images/cases/ledgerline.jpg',
    alt: 'Two colleagues reviewing a signed contract document across a desk',
  },
  {
    id: 'northbound',
    sector: 'Logistics',
    client: 'Northbound',
    tag: 'Exceptions',
    headline: 'The chase call that stopped happening',
    found:
      'One failed delivery generated four contacts across three channels. Nobody owned the exception, so the customer became the project manager.',
    did: [
      'A dedicated exception desk running 24 hours',
      'Proactive outbound before the customer noticed',
      'Driver support line in the same team, on the same screen',
    ],
    moved: [
      ['-38%', 'Chase calls', 'was 4 per failure'],
      ['24 hrs', 'Exception cover', 'was office hours'],
      ['+22', 'NPS', 'was 11'],
    ],
    quote: 'They ring the customer before the customer rings us. That is the entire difference, and it was worth every cent.',
    who: 'Priya K',
    role: 'Operations Director, Northbound',
    img: '/images/cases/northbound.jpg',
    alt: 'Two warehouse workers carrying a parcel down a stocked distribution aisle',
  },
  {
    id: 'atlas-cloud',
    sector: 'SaaS',
    client: 'Atlas Cloud',
    tag: 'Deflection',
    headline: 'Eighty-six percent of tickets closed without a single engineer',
    found:
      'Every ticket that reached an engineer cost a day of roadmap. Most of them never needed to, but nobody had time to work out which.',
    did: [
      'Tier 1 and tier 2 both held by the Nexa team',
      'Repro steps written on every bug before escalation',
      'Root cause programme run monthly against the top ten',
    ],
    moved: [
      ['86%', 'Closed without a dev', 'was 44%'],
      ['-61%', 'Engineer hours on support', 'was 12 a week'],
      ['0:52', 'Helpdesk answer', 'was 6 hrs'],
    ],
    quote: 'My engineers got a day a week back each. I did not know that was a thing you could buy.',
    who: 'Sam O',
    role: 'VP Engineering, Atlas Cloud',
    img: '/images/cases/atlas.jpg',
    alt: 'Engineer working alone at a laptop in a quiet, dimly lit office',
  },
]

export function CaseStudiesPage() {
  const reduce = useReducedMotion() ?? false
  const [open, setOpen] = useState<string | null>(CASES[0].id)

  return (
    <PageShell>
      <style>{`
        /* ══════════ the hero figure: a results card ══════════ */
        .cs-fig {
          position: relative; width: 100%; max-width: 560px; justify-self: end;
          border-radius: 20px; overflow: hidden;
          background-color: #211C33;
          background-image: linear-gradient(168deg, rgba(255,255,255,0.06), rgba(255,255,255,0));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px #2F2A42,
                      0 44px 84px -44px rgba(26,22,44,0.6);
        }
        .cs-fig-top {
          display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
          padding: clamp(18px, 2vw, 26px) clamp(20px, 2.2vw, 30px);
          border-bottom: 1px solid #2F2A42;
        }
        .cs-fig-top b {
          font-family: 'Eloma Sans', sans-serif; font-weight: 600; letter-spacing: -0.02em;
          font-size: clamp(15px, 1.2vw, 19px); color: #fff;
        }
        .cs-fig-top span {
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.7px; color: #C3BCFF;
        }
        .cs-fig-rows { display: grid; }
        .cs-fig-row {
          display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 14px;
          padding: clamp(15px, 1.7vw, 21px) clamp(20px, 2.2vw, 30px);
          border-bottom: 1px solid #2F2A42;
        }
        .cs-fig-row:last-child { border-bottom: 0; }
        .cs-fig-row b {
          display: block; font-family: 'Eloma Sans', sans-serif; font-weight: 600;
          font-size: clamp(13px, 1.05vw, 16px); color: #fff;
        }
        .cs-fig-row em {
          display: block; margin-top: 4px; font-style: normal; font-family: 'Eloma Sans', sans-serif;
          font-size: clamp(11px, 0.88vw, 13px); color: #858387;
          text-decoration: line-through; text-decoration-color: rgba(133,131,135,0.55);
        }
        .cs-fig-row time {
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; font-size: clamp(20px, 1.9vw, 32px);
          color: ${ACCENT}; font-variant-numeric: tabular-nums; letter-spacing: -0.02em;
        }
        /* the sparkline, drawn once */
        .cs-spark { display: block; width: 100%; height: 64px; }
        .cs-spark path {
          fill: none; stroke: ${ACCENT}; stroke-width: 2; stroke-linecap: round;
          stroke-dasharray: 320; stroke-dashoffset: 320;
          animation: cs-draw 2.6s cubic-bezier(.16,1,.3,1) forwards;
        }
        @keyframes cs-draw { to { stroke-dashoffset: 0; } }

        /* ══════════ the featured case ══════════ */
        .cs-hero-case {
          position: relative; overflow: hidden; border-radius: 22px;
          background: linear-gradient(168deg, #FFFFFF 0%, #FFFFFF 55%, #FAF9FE 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 1px 3px rgba(26,22,44,0.06), 0 34px 68px -36px rgba(26,22,44,0.32);
        }
        .cs-shot { position: relative; aspect-ratio: 21 / 9; overflow: hidden; }
        .cs-shot img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          will-change: transform; transition: transform 1.5s cubic-bezier(.16,1,.3,1);
        }
        .cs-hero-case:hover .cs-shot img { transform: scale(1.04); }
        .cs-shot::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, rgba(20,17,31,0.5) 0%, transparent 40%, rgba(20,17,31,0.55) 100%);
        }
        .cs-shot-tags {
          position: absolute; z-index: 2; top: clamp(16px, 1.8vw, 24px); left: clamp(16px, 1.8vw, 24px);
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .cs-tag {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 14px; border-radius: 100px;
          background: rgba(255,255,255,0.94);
          box-shadow: inset 0 0 0 1px rgba(26,22,44,0.08), 0 8px 20px -12px rgba(26,22,44,0.6);
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.7px; color: ${ACCENT_INK};
        }
        .cs-tag i { width: 5px; height: 5px; border-radius: 50%; background: ${ACCENT}; }
        /* the client name, laid over the photo */
        .cs-shot-name {
          position: absolute; z-index: 2; left: clamp(16px, 1.8vw, 26px); bottom: clamp(16px, 1.8vw, 26px);
          font-family: 'Eloma Sans', sans-serif; font-weight: 600; letter-spacing: -0.03em;
          font-size: clamp(24px, 3vw, 54px); line-height: 1; color: #fff;
          text-shadow: 0 2px 24px rgba(20,17,31,0.6);
        }

        .cs-case-body {
          display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
          gap: clamp(24px, 3.2vw, 60px);
          padding: clamp(26px, 3.2vw, 54px);
        }
        .cs-case-body h3 {
          margin: 0 0 clamp(16px, 1.8vw, 24px); font-family: 'Eloma Sans', sans-serif; 
          letter-spacing: -0.032em; font-size: clamp(24px, 2.6vw, 48px); line-height: 1.06; color: ${TEXT};
        }
        .cs-k {
          margin: 0 0 10px; font-family: 'Eloma Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.8px; color: ${ACCENT_INK};
        }
        .cs-found {
          margin: 0 0 clamp(22px, 2.4vw, 32px); padding-bottom: clamp(22px, 2.4vw, 32px);
          border-bottom: 1px solid rgba(22,20,31,0.12);
          font-family: 'Eloma Sans', sans-serif; font-size: clamp(14px, 1.05vw, 17px); line-height: 1.85; color: ${MUTED};
        }
        .cs-did { list-style: none; display: grid; gap: 12px; margin: 0; padding: 0; }
        .cs-did li {
          display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 12px; align-items: start;
          font-family: 'Eloma Sans', sans-serif; font-size: clamp(13px, 1.02vw, 16px); line-height: 1.7; color: ${TEXT};
        }
        .cs-did li i {
          flex: none; margin-top: 8px; width: 6px; height: 6px; border-radius: 50%;
          background: ${ACCENT};
        }

        /* the numbers that moved */
        .cs-moved {
          display: grid; gap: 1px; background: rgba(22,20,31,0.12);
          border-radius: 16px; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(22,20,31,0.12);
          align-content: start;
        }
        .cs-moved div {
          display: flex; align-items: baseline; justify-content: space-between; gap: 14px;
          background: linear-gradient(168deg, rgba(255,255,255,0.97), rgba(255,255,255,0.72));
          padding: clamp(15px, 1.7vw, 22px) clamp(16px, 1.8vw, 24px);
        }
        .cs-moved b {
          font-family: 'Eloma Sans', sans-serif; font-weight: 800;
          font-size: clamp(24px, 2.3vw, 42px); line-height: 1; letter-spacing: -0.025em; color: ${ACCENT};
          font-variant-numeric: tabular-nums;
        }
        .cs-moved span {
          text-align: right; font-family: 'Eloma Sans', sans-serif; font-weight: 600;
          font-size: clamp(12px, 0.95vw, 15px); line-height: 1.4; color: ${TEXT};
        }
        .cs-moved span em {
          display: block; margin-top: 4px; font-style: normal; font-weight: 500;
          font-size: clamp(11px, 0.85vw, 12.5px); color: ${MUTED};
          text-decoration: line-through; text-decoration-color: rgba(94,91,107,0.5);
        }

        /* the quote */
        .cs-quote {
          position: relative; margin-top: clamp(20px, 2.2vw, 28px);
          border-radius: 16px; padding: clamp(20px, 2.2vw, 30px);
          background: rgba(153,142,255,0.07); box-shadow: inset 0 0 0 1px rgba(153,142,255,0.2);
        }
        .cs-quote svg { color: rgba(153,142,255,0.4); margin-bottom: 10px; }
        .cs-quote p {
          margin: 0 0 16px; font-family: 'Eloma Sans', sans-serif;
          font-size: clamp(15px, 1.3vw, 22px); line-height: 1.55; color: ${TEXT};
        }
        .cs-quote footer {
          display: flex; align-items: center; gap: 11px;
          padding-top: 14px; border-top: 1px solid rgba(153,142,255,0.24);
        }
        .cs-quote footer i {
          display: grid; place-items: center; flex: none; width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(168deg, #C3BCFF 0%, ${ACCENT} 48%, #4A3DBF 100%);
          color: #fff; font-family: 'Eloma Sans', sans-serif; font-style: normal; font-size: 14px;
          box-shadow: 0 8px 18px -10px rgba(74,61,191,0.8);
        }
        .cs-quote footer b {
          display: block; font-family: 'Eloma Sans', sans-serif; font-weight: 700; font-size: 14px; color: ${TEXT};
        }
        .cs-quote footer span {
          display: block; margin-top: 2px; font-family: 'Eloma Sans', sans-serif; font-size: 12.5px; color: ${MUTED};
        }

        /* ══════════ the rest, as an index that opens ══════════ */
        .cs-list { border-top: 1px solid rgba(22,20,31,0.14); }
        .cs-row {
          position: relative; isolation: isolate; width: 100%; text-align: left; cursor: pointer;
          border: 0; background: none; color: inherit; display: grid;
          grid-template-columns: clamp(66px, 7vw, 110px) minmax(0, 1fr) auto auto;
          gap: clamp(14px, 2vw, 34px); align-items: center;
          padding: clamp(20px, 2.3vw, 32px) clamp(10px, 1.2vw, 20px);
          border-bottom: 1px solid rgba(22,20,31,0.14);
        }
        .cs-row::before {
          content: ''; position: absolute; inset: 0; z-index: -1; border-radius: 10px;
          background: linear-gradient(90deg, rgba(153,142,255,0.12), rgba(153,142,255,0.01));
          transform: scaleX(0); transform-origin: left; will-change: transform;
          transition: transform .7s cubic-bezier(.16,1,.3,1);
        }
        .cs-row:hover::before, .cs-row.on::before, .cs-row:focus-visible::before { transform: scaleX(1); }
        .cs-row-sec {
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.78vw, 12px); letter-spacing: 1.8px; color: rgba(22,20,31,0.35);
          transition: color .45s ease;
        }
        .cs-row:hover .cs-row-sec, .cs-row.on .cs-row-sec { color: ${ACCENT_INK}; }
        .cs-row-t {
          font-family: 'Eloma Sans', sans-serif; font-weight: 600; letter-spacing: -0.028em;
          font-size: clamp(18px, 1.75vw, 32px); line-height: 1.16; color: ${TEXT}; will-change: transform;
          transition: transform .7s cubic-bezier(.16,1,.3,1), color .45s ease;
        }
        .cs-row:hover .cs-row-t { transform: translateX(clamp(4px, 0.6vw, 10px)); }
        .cs-row.on .cs-row-t { color: ${ACCENT}; }
        .cs-row-fig {
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; font-size: clamp(20px, 1.9vw, 34px);
          line-height: 1; letter-spacing: -0.02em; color: ${ACCENT}; white-space: nowrap;
          font-variant-numeric: tabular-nums;
        }
        .cs-row-x {
          position: relative; flex: none; width: 44px; height: 44px; border-radius: 50%;
          display: grid; place-items: center; color: ${TEXT};
          border: 1px solid rgba(22,20,31,0.18); will-change: transform;
          transition: transform .6s cubic-bezier(.16,1,.3,1), background .4s ease, color .4s ease, border-color .4s ease;
        }
        .cs-row:hover .cs-row-x { border-color: rgba(153,142,255,0.5); }
        .cs-row.on .cs-row-x { background: ${ACCENT}; border-color: transparent; color: #fff; transform: rotate(45deg); }
        .cs-row-x i { position: absolute; background: currentColor; border-radius: 2px; }
        .cs-row-x i:first-child { width: 13px; height: 1.8px; }
        .cs-row-x i:last-child  { width: 1.8px; height: 13px; }

        /* the panel that unrolls under a row */
        .cs-open {
          display: grid; grid-template-rows: 0fr; border-bottom: 1px solid rgba(22,20,31,0.14);
          transition: grid-template-rows .75s cubic-bezier(.16,1,.3,1);
        }
        .cs-open.on { grid-template-rows: 1fr; }
        .cs-open-in { overflow: hidden; }
        .cs-open-grid {
          display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.9fr);
          gap: clamp(20px, 2.6vw, 46px);
          padding: 0 clamp(10px, 1.2vw, 20px) clamp(28px, 3vw, 44px)
                   calc(clamp(66px, 7vw, 110px) + clamp(14px, 2vw, 34px));
          opacity: 0; transform: translateY(10px); will-change: transform, opacity;
          transition: opacity .55s ease .1s, transform .7s cubic-bezier(.16,1,.3,1) .1s;
        }
        .cs-open.on .cs-open-grid { opacity: 1; transform: translateY(0); }
        .cs-open-grid > figure { margin: 0; border-radius: 16px; overflow: hidden; aspect-ratio: 4 / 3; }
        .cs-open-grid > figure img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cs-open-grid p {
          margin: 0 0 clamp(16px, 1.8vw, 22px); font-family: 'Eloma Sans', sans-serif;
          font-size: clamp(13px, 1.02vw, 16px); line-height: 1.85; color: ${MUTED};
        }

        /* ══════════ the caveat ══════════ */
        .cs-fine {
          display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(24px, 3.4vw, 62px); align-items: center;
        }
        .cs-fine-q {
          margin: 0; font-family: 'Eloma Sans', sans-serif;
          font-size: clamp(22px, 2.6vw, 46px); line-height: 1.38; letter-spacing: -0.015em; color: #fff;
          max-width: 20ch;
        }
        .cs-fine-q b { font-weight: 400; color: ${ACCENT}; }
        .cs-fine-note {
          display: grid; gap: 16px; padding-left: clamp(18px, 2vw, 28px);
          border-left: 2px solid #2F2A42;
        }
        .cs-fine-note p {
          margin: 0; font-family: 'Eloma Sans', sans-serif; font-size: clamp(13px, 1.02vw, 16px);
          line-height: 1.85; color: #BDBDBD;
        }
        .cs-fine-note p b { color: #fff; font-weight: 600; }
        .cs-fine-dot {
          display: inline-flex; align-items: center; gap: 9px; margin-top: 6px;
          font-family: 'Eloma Sans', sans-serif; font-weight: 700; font-size: 13px; color: ${LIVE_INK};
        }
        .cs-fine-dot i { width: 7px; height: 7px; border-radius: 50%; background: ${LIVE}; }

        /* ══════════ responsive ══════════ */
        @media (max-width: 1180px) {
          .cs-open-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .cs-open-grid > figure { grid-column: 1 / -1; aspect-ratio: 16 / 7; }
        }
        @media (max-width: 1024px) {
          .cs-fig { justify-self: center; }
          .cs-case-body { grid-template-columns: minmax(0, 1fr); }
          .cs-fine { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 760px) {
          .cs-row { grid-template-columns: minmax(0, 1fr) auto; row-gap: 10px; }
          .cs-row-sec { grid-column: 1 / -1; }
          .cs-row-fig { grid-column: 1 / -1; }
          .cs-open-grid { grid-template-columns: minmax(0, 1fr); padding-left: clamp(10px, 1.2vw, 20px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-spark path { animation: none; stroke-dashoffset: 0; }
          .cs-shot img { transition: none; }
        }
      `}</style>

      <InnerHero
        crumb="Case Studies"
        eyebrow="Case studies"
        title={<>The numbers, <span className="serif">and what they cost.</span></>}
        lead={
          <>
            Every case below carries the same four things: the state we found it in, what we changed,
            what actually moved, and the line from the person who signed it off.
            <b> Including the figures that did not move</b>, because those are the interesting ones.
          </>
        }
        stats={[
          ['31', 'Brands on the floor'],
          ['9 days', 'Median time to a clean queue'],
          ['0', 'Clients who left over quality'],
        ]}
        figure={
          <div className="cs-fig" aria-hidden>
            <div className="cs-fig-top">
              <b>Harlow &amp; Co</b>
              <span>Peak season</span>
            </div>
            <div className="cs-fig-rows">
              {FEATURED.moved.slice(0, 3).map(([v, l, from]) => (
                <div className="cs-fig-row" key={l}>
                  <span>
                    <b>{l}</b>
                    <em>{from}</em>
                  </span>
                  <time>{v}</time>
                </div>
              ))}
            </div>
            <svg className="cs-spark" viewBox="0 0 320 64" preserveAspectRatio="none" focusable="false">
              <path d="M0,54 C40,52 60,48 84,40 C112,30 132,34 156,26 C186,16 208,20 236,13 C268,6 292,8 320,4" />
            </svg>
          </div>
        }
      />

      {/* ══════════ the featured case ══════════ */}
      <Band tone="white" label="Featured case">
        <SectionHead
          eyebrow="The one we would show first"
          title={<>Nine days to a <span className="accent">clean queue.</span></>}
          lead="A retailer whose founder had been clearing tickets on Sunday nights for two years. This is what changed, and how quickly."
        />

        <motion.article
          className="cs-hero-case"
          variants={zoomIn}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="cs-shot">
            <img src={FEATURED.img} alt={FEATURED.alt} width={1400} height={600} decoding="async" />
            <div className="cs-shot-tags">
              <span className="cs-tag"><i aria-hidden /> {FEATURED.sector}</span>
              <span className="cs-tag"><i aria-hidden /> {FEATURED.tag}</span>
            </div>
            <span className="cs-shot-name">{FEATURED.client}</span>
          </div>

          <div className="cs-case-body">
            <div>
              <h3>{FEATURED.headline}</h3>
              <p className="cs-k">How we found it</p>
              <p className="cs-found">{FEATURED.found}</p>
              <p className="cs-k">What we changed</p>
              <ul className="cs-did">
                {FEATURED.did.map((d) => (
                  <li key={d}><i aria-hidden />{d}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="cs-moved">
                {FEATURED.moved.map(([v, l, from]) => (
                  <div key={l}>
                    <b>{v}</b>
                    <span>
                      {l}
                      <em>{from}</em>
                    </span>
                  </div>
                ))}
              </div>

              <blockquote className="cs-quote">
                <Quote size={22} strokeWidth={2} aria-hidden />
                <p>{FEATURED.quote}</p>
                <footer>
                  <i aria-hidden>{FEATURED.who.charAt(0)}</i>
                  <div>
                    <b>{FEATURED.who}</b>
                    <span>{FEATURED.role}</span>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </motion.article>
      </Band>

      {/* ══════════ the rest ══════════ */}
      <Band tone="wash" label="More cases">
        <SectionHead
          eyebrow="The rest"
          title={<>Three more, <span className="serif">opened up.</span></>}
          lead="Different sectors, same four beats. Open one and you get the whole thing, not a teaser and a download form."
        />

        <motion.div
          className="cs-list"
          variants={staggerParent(0.07)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {CASES.map((c) => {
            const on = open === c.id
            return (
              <motion.div key={c.id} variants={swingIn}>
                <button
                  type="button"
                  className={`cs-row${on ? ' on' : ''}`}
                  aria-expanded={on}
                  aria-controls={`cs-${c.id}`}
                  onClick={() => setOpen(on ? null : c.id)}
                >
                  <span className="cs-row-sec">{c.sector}</span>
                  <span className="cs-row-t">{c.headline}</span>
                  <span className="cs-row-fig">{c.moved[0][0]}</span>
                  <span className="cs-row-x" aria-hidden><i /><i /></span>
                </button>

                <div className={`cs-open${on ? ' on' : ''}`} id={`cs-${c.id}`} role="region">
                  <div className="cs-open-in">
                    <div className="cs-open-grid">
                      <div>
                        <p className="cs-k">How we found it</p>
                        <p>{c.found}</p>
                        <p className="cs-k">What we changed</p>
                        <ul className="cs-did">
                          {c.did.map((d) => (
                            <li key={d}><i aria-hidden />{d}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="cs-moved">
                          {c.moved.map(([v, l, from]) => (
                            <div key={l}>
                              <b>{v}</b>
                              <span>
                                {l}
                                <em>{from}</em>
                              </span>
                            </div>
                          ))}
                        </div>
                        <blockquote className="cs-quote">
                          <Quote size={20} strokeWidth={2} aria-hidden />
                          <p>{c.quote}</p>
                          <footer>
                            <i aria-hidden>{c.who.charAt(0)}</i>
                            <div>
                              <b>{c.who}</b>
                              <span>{c.role}</span>
                            </div>
                          </footer>
                        </blockquote>
                      </div>

                      <figure>
                        <img src={c.img} alt={c.alt} width={640} height={480} decoding="async" loading="lazy" />
                      </figure>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </Band>

      {/* ══════════ the caveat ══════════ */}
      <Band tone="ink" label="The caveat">
        <div className="cs-fine">
          <MaskReveal as="p" className="cs-fine-q">
            Every number on this page moved because somebody on our floor stayed late.{' '}
            <b>None of them moved in week one.</b>
          </MaskReveal>

          <Reveal className="cs-fine-note" variant={slideRight} delay={0.1}>
            <p>
              We are showing you the good quarters, the same as everybody else. The difference is that
              we will also walk you through the two accounts we lost, and why, on the first call if
              you ask.
            </p>
            <p>
              <b>What we will not do is promise you week one.</b> A pod clears a backlog in nine days.
              A cost curve takes a quarter. Anyone quoting you a faster number is quoting you a
              different metric.
            </p>
            <span className="cs-fine-dot"><i aria-hidden /> References available, live, on request</span>
          </Reveal>
        </div>

        <Reveal variant={popUp} delay={0.14} style={{ marginTop: 'clamp(30px, 3.5vw, 52px)', display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <Link to="/solutions" className="pg-btn">
            <span>Price a team like these</span>
            <ArrowUpRight size={17} strokeWidth={2.4} aria-hidden />
          </Link>
          <Link to="/industries" className="pg-btn ghost">
            <span>Find your sector</span>
          </Link>
        </Reveal>
      </Band>

      <CTABand
        title={<>Your queue, <span className="serif">on this page next year.</span></>}
        lead="Thirty minutes and we will tell you which of these numbers we think we could move for you, and which we could not."
      />
    </PageShell>
  )
}
