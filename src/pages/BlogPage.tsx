import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { PageShell, InnerHero, Band, SectionHead, CTABand } from '../components/page/PageKit'
import { Reveal, staggerParent, VIEWPORT, EASE, unfoldLeft, slideLeft, slideRight, popUp } from '../lib/anim'

const TEXT       = '#16141F'
const ACCENT     = '#998EFF'
const ACCENT_INK = '#6A5BE8'
const MUTED      = '#5E5B6B'

/* ──────────────────────────────────────────────────────────────
   The archive grid enters column by column: every card in the
   left column slides in together, the middle follows 0.3s later,
   the right 0.3s after that. The delay is the card's column, not
   its index, so the cascade stays 0.6s long whether the filter
   shows three cards or thirty.
   ────────────────────────────────────────────────────────────── */
const COL_GAP = 0.3

const GRID: Variants = { hidden: {}, show: {} }

const cardIn: Variants = {
  hidden: { opacity: 0, x: -64 },
  show: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease: EASE, delay },
  }),
}

/* which column a card lands in depends on how many the grid is
   showing, and .bl-grid drops to two columns at 1100 and one at 720 */
function useGridColumns() {
  const [cols, setCols] = useState(3)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1101px)')
    const mid = window.matchMedia('(min-width: 721px)')
    const read = () => setCols(wide.matches ? 3 : mid.matches ? 2 : 1)

    read()
    wide.addEventListener('change', read)
    mid.addEventListener('change', read)
    return () => {
      wide.removeEventListener('change', read)
      mid.removeEventListener('change', read)
    }
  }, [])

  return cols
}

/* ──────────────────────────────────────────────────────────────
   Blog: a magazine, not a content marketing dump.

   One lead story given the whole width, a topic rail that filters
   in place, and a grid of pieces set like a features section. The
   date and read time carry the metadata so the cards themselves
   stay quiet.
   ────────────────────────────────────────────────────────────── */

type Topic = 'All' | 'Operations' | 'Hiring' | 'Cost' | 'Quality'

type Post = {
  slug: string
  topic: Exclude<Topic, 'All'>
  title: string
  dek: string
  date: string
  read: string
  by: string
  img: string
  alt: string
}

const LEAD: Post = {
  slug: 'the-ticket-that-should-not-exist',
  topic: 'Operations',
  title: 'The best support ticket is the one that never gets written',
  dek: 'We spent a quarter tracing every contact back to the moment it became inevitable. Sixty-one percent of them started with a sentence somebody wrote on a product page eighteen months ago. Here is the audit we now run on every new client, and what it usually finds.',
  date: '2 July 2026',
  read: '9 min read',
  by: 'RJ',
  img: '/images/blog/lead.jpg',
  alt: 'Two support agents leaning in to read a ticket together on screen',
}

const POSTS: Post[] = [
  {
    slug: 'interviewing-your-own-outsourcer',
    topic: 'Hiring',
    title: 'Why you should interview the agents your outsourcer hires',
    dek: 'It sounds like a courtesy. It is actually the single highest-leverage hour you will spend on the whole engagement, and almost nobody offers it.',
    date: '24 June 2026', read: '6 min read', by: 'Priya N',
    img: '/images/blog/hiring.jpg',
    alt: 'Hiring manager reading a candidate CV across the table in an interview',
  },
  {
    slug: 'cost-per-contact-is-lying-to-you',
    topic: 'Cost',
    title: 'Cost per contact is lying to you, and here is the arithmetic',
    dek: 'The metric rewards you for closing tickets fast and punishes you for closing them properly. Swap in cost per resolved customer and watch the whole picture invert.',
    date: '17 June 2026', read: '7 min read', by: 'RJ',
    img: '/images/blog/cost.jpg',
    alt: 'Hand with a pen pointing at cost charts on a printed finance review',
  },
  {
    slug: 'the-3am-shift',
    topic: 'Operations',
    title: 'What actually happens on a support floor at 3am',
    dek: 'We logged a full night desk in Manila, minute by minute. The volume is not the problem. The isolation is, and it is fixable.',
    date: '9 June 2026', read: '8 min read', by: 'Marco S',
    img: '/images/blog/night.jpg',
    alt: 'Lone worker at a laptop under a desk lamp in a dark office at night',
  },
  {
    slug: 'quality-scores-nobody-games',
    topic: 'Quality',
    title: 'How to write a quality score your agents cannot game',
    dek: 'Every QA rubric we inherited was optimised for the reviewer, not the customer. Four changes later, the scores went down and the CSAT went up.',
    date: '28 May 2026', read: '5 min read', by: 'Priya N',
    img: '/images/blog/quality.jpg',
    alt: 'Quality analyst in a headset reviewing a printed conversation transcript',
  },
  {
    slug: 'the-two-day-read',
    topic: 'Operations',
    title: 'The two days we spend reading your tickets before we take a call',
    dek: 'Every agent reads two hundred real conversations before they touch the live queue. It costs us a fortnight of billable time and it is the reason first-time-fix holds.',
    date: '19 May 2026', read: '6 min read', by: 'RJ',
    img: '/images/blog/reading.jpg',
    alt: 'Row of agents on headsets reading through tickets at a long shared desk',
  },
  {
    slug: 'attrition-is-a-design-problem',
    topic: 'Hiring',
    title: 'Agent attrition is a design problem, not a pay problem',
    dek: 'The industry runs at forty percent a year and blames the wage. We run at nine, and the wage is not why.',
    date: '11 May 2026', read: '7 min read', by: 'Marco S',
    img: '/images/blog/attrition.jpg',
    alt: 'Support agent in a headset smiling by an office window',
  },
]

const TOPICS: Topic[] = ['All', 'Operations', 'Hiring', 'Cost', 'Quality']

export function BlogPage() {
  const reduce = useReducedMotion() ?? false
  const [topic, setTopic] = useState<Topic>('All')
  const cols = useGridColumns()

  const shown = useMemo(
    () => (topic === 'All' ? POSTS : POSTS.filter((p) => p.topic === topic)),
    [topic],
  )

  return (
    <PageShell>
      <style>{`
        /* ══════════ the hero figure: an issue plate ══════════ */
        .bl-fig {
          position: relative; width: 100%; max-width: 560px; justify-self: end;
          border-radius: 20px; overflow: hidden;
          background: linear-gradient(168deg, #FFFFFF 0%, #FFFFFF 55%, #FAF9FE 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 1px 3px rgba(26,22,44,0.06), 0 40px 78px -44px rgba(26,22,44,0.34);
          will-change: transform;
          animation: bl-float 10s cubic-bezier(.4,0,.6,1) infinite;
        }
        @keyframes bl-float {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-0.8deg); }
          50%      { transform: translate3d(0, -10px, 0) rotate(0.2deg); }
        }
        .bl-fig-top {
          display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
          padding: clamp(18px, 2vw, 26px) clamp(20px, 2.2vw, 30px);
          border-bottom: 1px solid rgba(22,20,31,0.12);
        }
        .bl-fig-top b {
          font-family: 'Universal Sans', sans-serif; font-weight: 600; letter-spacing: -0.02em;
          font-size: clamp(15px, 1.2vw, 19px); color: ${TEXT};
        }
        .bl-fig-top span {
          font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.7px; color: ${ACCENT_INK};
        }
        .bl-fig-body { padding: clamp(20px, 2.2vw, 30px); display: grid; gap: clamp(14px, 1.6vw, 20px); }
        .bl-fig-row {
          display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 14px; align-items: baseline;
          padding-bottom: clamp(14px, 1.6vw, 20px); border-bottom: 1px dashed rgba(22,20,31,0.18);
        }
        .bl-fig-row:last-child { border-bottom: 0; padding-bottom: 0; }
        .bl-fig-row em {
          font-style: normal; font-family: 'Universal Sans', sans-serif; font-weight: 800;
          font-variant-numeric: tabular-nums; font-size: 11px; letter-spacing: 1.5px;
          color: rgba(22,20,31,0.32);
        }
        .bl-fig-row b {
          display: block; font-family: 'Universal Sans', sans-serif; font-weight: 400;
          font-size: clamp(16px, 1.35vw, 23px); line-height: 1.3; color: ${TEXT};
        }
        .bl-fig-row span {
          display: block; margin-top: 5px; font-family: 'Universal Sans', sans-serif;
          font-size: clamp(11px, 0.88vw, 13px); color: ${MUTED};
        }

        /* ══════════ the lead story ══════════ */
        .bl-lead {
          position: relative; isolation: isolate; overflow: hidden; display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          border-radius: 22px; text-decoration: none; color: inherit;
          background: linear-gradient(168deg, #FFFFFF 0%, #FFFFFF 55%, #FAF9FE 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 1px 3px rgba(26,22,44,0.06), 0 30px 62px -34px rgba(26,22,44,0.3);
          will-change: transform; transition: transform .6s cubic-bezier(.16,1,.3,1), box-shadow .6s ease;
        }
        .bl-lead:hover {
          transform: translateY(-5px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 1px 3px rgba(26,22,44,0.06), 0 44px 84px -40px rgba(26,22,44,0.4);
        }
        .bl-lead-body {
          padding: clamp(28px, 3.2vw, 56px); display: flex; flex-direction: column; justify-content: center;
        }
        .bl-tag {
          display: inline-flex; align-items: center; gap: 8px; align-self: flex-start;
          margin-bottom: clamp(16px, 1.8vw, 24px);
          padding: 7px 13px; border-radius: 100px;
          background: rgba(153,142,255,0.1); box-shadow: inset 0 0 0 1px rgba(153,142,255,0.26);
          font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.8px; color: ${ACCENT_INK};
        }
        .bl-tag i { width: 5px; height: 5px; border-radius: 50%; background: ${ACCENT}; }
        .bl-lead h3 {
          margin: 0 0 clamp(14px, 1.6vw, 22px); font-family: 'Universal Sans', sans-serif; 
          letter-spacing: -0.032em; font-size: clamp(26px, 2.9vw, 54px); line-height: 1.06; color: ${TEXT};
        }
        .bl-lead p {
          margin: 0 0 clamp(22px, 2.4vw, 32px); font-family: 'Universal Sans', sans-serif;
          font-size: clamp(14px, 1.08vw, 17px); line-height: 1.85; color: ${MUTED}; max-width: 56ch;
        }
        .bl-meta {
          display: flex; flex-wrap: wrap; align-items: center; gap: clamp(10px, 1.2vw, 16px);
          padding-top: clamp(18px, 2vw, 26px); border-top: 1px solid rgba(22,20,31,0.12);
          font-family: 'Universal Sans', sans-serif; font-weight: 600; font-size: clamp(12px, 0.92vw, 14px);
          color: ${MUTED};
        }
        .bl-meta i { width: 4px; height: 4px; border-radius: 50%; background: rgba(22,20,31,0.25); }
        .bl-meta .go {
          margin-left: auto; display: inline-flex; align-items: center; gap: 8px;
          font-weight: 700; color: ${ACCENT_INK};
        }
        .bl-meta .go svg { transition: transform .5s cubic-bezier(.16,1,.3,1); }
        .bl-lead:hover .bl-meta .go svg { transform: translate(3px, -3px); }

        .bl-lead-shot { position: relative; overflow: hidden; min-height: clamp(240px, 26vw, 460px); }
        .bl-lead-shot img {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
          will-change: transform; transition: transform 1.4s cubic-bezier(.16,1,.3,1);
        }
        .bl-lead:hover .bl-lead-shot img { transform: scale(1.05); }
        .bl-lead-shot::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(100deg, rgba(255,255,255,0.5) 0%, transparent 26%);
        }

        /* ══════════ the topic rail ══════════ */
        .bl-rail {
          display: flex; flex-wrap: wrap; gap: 9px;
          margin-bottom: clamp(26px, 3vw, 42px);
        }
        .bl-pill {
          cursor: pointer; border: 0; background: none;
          display: inline-flex; align-items: center; gap: 9px;
          min-height: 44px; padding: 11px clamp(16px, 1.6vw, 22px); border-radius: 100px;
          box-shadow: inset 0 0 0 1px rgba(22,20,31,0.16);
          font-family: 'Universal Sans', sans-serif; font-weight: 700; font-size: clamp(12px, 0.95vw, 14.5px);
          color: ${MUTED}; will-change: transform;
          transition: color .4s ease, box-shadow .4s ease, background .4s ease, transform .5s cubic-bezier(.16,1,.3,1);
        }
        .bl-pill:hover { color: ${TEXT}; box-shadow: inset 0 0 0 1px rgba(22,20,31,0.34); }
        .bl-pill.on {
          color: #fff; transform: translateY(-2px);
          background: linear-gradient(168deg, #C3BCFF 0%, ${ACCENT} 48%, #4A3DBF 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(40,32,100,0.3),
                      0 12px 24px -12px rgba(74,61,191,0.65);
        }
        .bl-pill em {
          font-style: normal; font-weight: 800; font-variant-numeric: tabular-nums;
          font-size: 11px; opacity: 0.7;
        }

        /* ══════════ the grid ══════════ */
        .bl-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(18px, 2vw, 30px); }
        .bl-card {
          position: relative; isolation: isolate; overflow: hidden; display: flex; flex-direction: column;
          border-radius: 18px; text-decoration: none; color: inherit;
          background: linear-gradient(168deg, #FFFFFF 0%, #FFFFFF 55%, #FAF9FE 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 1px 2px rgba(26,22,44,0.05), 0 10px 24px -14px rgba(26,22,44,0.18);
          will-change: transform; transition: transform .6s cubic-bezier(.16,1,.3,1), box-shadow .6s ease;
        }
        .bl-card:hover {
          transform: translateY(-6px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 1px 3px rgba(26,22,44,0.06), 0 30px 58px -28px rgba(26,22,44,0.32);
        }
        .bl-card-shot { position: relative; aspect-ratio: 16 / 10; overflow: hidden; }
        .bl-card-shot img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          will-change: transform; transition: transform 1.3s cubic-bezier(.16,1,.3,1);
        }
        .bl-card:hover .bl-card-shot img { transform: scale(1.06); }
        .bl-card-shot::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, rgba(20,17,31,0.34) 0%, transparent 46%);
        }
        .bl-card-shot .bl-tag {
          position: absolute; z-index: 2; top: 14px; left: 14px; margin: 0;
          background: rgba(255,255,255,0.94);
          box-shadow: inset 0 0 0 1px rgba(26,22,44,0.08), 0 8px 20px -12px rgba(26,22,44,0.6);
        }
        .bl-card-body { padding: clamp(20px, 2.2vw, 30px); display: flex; flex-direction: column; flex: 1; }
        .bl-card-body h3 {
          margin: 0 0 12px; font-family: 'Universal Sans', sans-serif; letter-spacing: -0.028em;
          font-size: clamp(19px, 1.6vw, 28px); line-height: 1.16; color: ${TEXT};
        }
        .bl-card-body p {
          margin: 0 0 clamp(18px, 2vw, 26px); font-family: 'Universal Sans', sans-serif;
          font-size: clamp(13px, 1vw, 15.5px); line-height: 1.8; color: ${MUTED};
        }
        .bl-card-body .bl-meta { margin-top: auto; }

        /* ══════════ the note in the margin ══════════ */
        .bl-sub {
          display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: clamp(24px, 3.4vw, 62px); align-items: center;
        }
        .bl-sub h2 {
          margin: 0 0 clamp(14px, 1.6vw, 22px); font-family: 'Universal Sans', sans-serif; 
          letter-spacing: -0.032em; font-size: clamp(28px, 3.2vw, 58px); line-height: 1.04; color: #fff;
          max-width: 16ch;
        }
        .bl-sub h2 .serif {
          font-family: 'Universal Sans', sans-serif;
          color: ${ACCENT}; letter-spacing: -0.02em;
        }
        /* classed, not a bare p: it would otherwise outrank the .pg-eyebrow above it */
        .bl-sub-lead {
          margin: 0; font-family: 'Universal Sans', sans-serif; font-size: clamp(14px, 1.05vw, 17px);
          line-height: 1.8; color: #BDBDBD; max-width: 48ch;
        }
        .bl-form { display: grid; gap: 14px; }
        .bl-form label {
          font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.8px; color: #C3BCFF;
        }
        .bl-form-row { display: flex; flex-wrap: wrap; gap: 12px; }
        .bl-form input {
          flex: 1; min-width: 220px; min-height: 52px;
          border: 0; outline: none; border-radius: 100px; padding: 15px 22px;
          background: #191527; box-shadow: inset 0 0 0 1px #2F2A42;
          font-family: 'Universal Sans', sans-serif; font-size: 15px; color: #fff;
          transition: box-shadow .4s ease;
        }
        .bl-form input::placeholder { color: #858387; }
        .bl-form input:focus { box-shadow: inset 0 0 0 2px ${ACCENT}; }
        .bl-form small {
          font-family: 'Universal Sans', sans-serif; font-size: 12.5px; line-height: 1.7; color: #858387;
        }

        /* ══════════ responsive ══════════ */
        @media (max-width: 1100px) { .bl-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 1024px) {
          .bl-fig { justify-self: center; }
          .bl-lead { grid-template-columns: minmax(0, 1fr); }
          .bl-lead-shot { grid-row: 1; min-height: clamp(220px, 40vw, 340px); }
          .bl-sub { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 720px) { .bl-grid { grid-template-columns: minmax(0, 1fr); } }
        @media (prefers-reduced-motion: reduce) {
          .bl-fig { animation: none; }
          .bl-card-shot img, .bl-lead-shot img { transition: none; }
        }
      `}</style>

      <InnerHero
        crumb="Blog"
        eyebrow="The Nexa journal"
        title={<>What we learned <span className="serif">on the floor.</span></>}
        lead={
          <>
            No listicles, no thought leadership, no eight hundred words on the future of AI in customer
            experience. <b>Just what we measured on a real support floor</b>, including the parts that
            made us look bad.
          </>
        }
        stats={[
          ['Monthly', 'One piece, when we have one'],
          ['0', 'Guest posts, ever'],
          ['6 min', 'Median read'],
        ]}
        figure={
          <div className="bl-fig" aria-hidden>
            <div className="bl-fig-top">
              <b>The journal</b>
              <span>Issue 14</span>
            </div>
            <div className="bl-fig-body">
              {[
                ['01', 'The ticket that should not exist', '61% traced to one sentence'],
                ['02', 'Interviewing your outsourcer', 'The highest-leverage hour'],
                ['03', 'Cost per contact is lying', 'Swap the denominator'],
              ].map(([n, t, s]) => (
                <div className="bl-fig-row" key={n}>
                  <em>{n}</em>
                  <div>
                    <b>{t}</b>
                    <span>{s}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* ══════════ the lead story ══════════ */}
      <Band tone="white" label="Lead story">
        <SectionHead
          eyebrow="This issue"
          title={<>The piece we would <span className="accent">read first.</span></>}
          lead="One long read a month, written by whoever actually did the work. Nobody here has a content calendar."
        />

        <motion.a
          href={`#${LEAD.slug}`}
          className="bl-lead"
          variants={unfoldLeft}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="bl-lead-body">
            <span className="bl-tag"><i aria-hidden /> {LEAD.topic}</span>
            <h3>{LEAD.title}</h3>
            <p>{LEAD.dek}</p>
            <div className="bl-meta">
              <span>{LEAD.by}</span>
              <i aria-hidden />
              <span>{LEAD.date}</span>
              <i aria-hidden />
              <span>{LEAD.read}</span>
              <span className="go">
                Read it <ArrowUpRight size={16} strokeWidth={2.4} aria-hidden />
              </span>
            </div>
          </div>
          <div className="bl-lead-shot">
            <img src={LEAD.img} alt={LEAD.alt} width={900} height={620} decoding="async" />
          </div>
        </motion.a>
      </Band>

      {/* ══════════ everything else ══════════ */}
      <Band tone="wash" label="All writing">
        <SectionHead
          eyebrow="The archive"
          title={<>Everything else <span className="serif">we have written.</span></>}
          lead="Filter it by what is bothering you. There are only four things anybody ever asks us about."
        />

        <motion.div
          className="bl-rail"
          role="tablist"
          aria-label="Topics"
          variants={staggerParent(0.05)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {TOPICS.map((t) => {
            const count = t === 'All' ? POSTS.length : POSTS.filter((p) => p.topic === t).length
            return (
              <motion.button
                key={t}
                type="button"
                role="tab"
                aria-selected={topic === t}
                className={`bl-pill${topic === t ? ' on' : ''}`}
                onClick={() => setTopic(t)}
                variants={popUp}
              >
                {t}
                <em>{count}</em>
              </motion.button>
            )
          })}
        </motion.div>

        <motion.div
          className="bl-grid"
          key={topic}
          variants={GRID}
          initial={reduce ? false : 'hidden'}
          animate="show"
        >
          {shown.map((p, i) => (
            <motion.a
              href={`#${p.slug}`}
              className="bl-card"
              key={p.slug}
              variants={cardIn}
              /* the column this card sits in decides when it starts, so a whole
                 column slides in at once and the next follows 0.3s behind */
              custom={cols === 1 ? i * 0.08 : (i % cols) * COL_GAP}
            >
              <div className="bl-card-shot">
                <img src={p.img} alt={p.alt} width={640} height={400} decoding="async" />
                <span className="bl-tag"><i aria-hidden /> {p.topic}</span>
              </div>
              <div className="bl-card-body">
                <h3>{p.title}</h3>
                <p>{p.dek}</p>
                <div className="bl-meta">
                  <span>{p.by}</span>
                  <i aria-hidden />
                  <span>{p.date}</span>
                  <span className="go">
                    <ArrowUpRight size={16} strokeWidth={2.4} aria-hidden />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </Band>

      {/* ══════════ the list ══════════ */}
      <Band tone="ink" label="Subscribe">
        <div className="bl-sub">
          <Reveal variant={slideLeft}>
            <p className="pg-eyebrow"><i aria-hidden /> The list</p>
            <h2>One email a month. <span className="serif">Nothing else.</span></h2>
            <p className="bl-sub-lead">
              When we publish, you get it. When we do not, you hear nothing at all, which is most
              months. No sequences, no offers, and one click to leave.
            </p>
          </Reveal>

          <motion.form
            className="bl-form"
            onSubmit={(e) => e.preventDefault()}
            variants={slideRight}
            initial={reduce ? false : 'hidden'}
            whileInView="show"
            viewport={VIEWPORT}
            transition={{ delay: 0.12 }}
            style={{ willChange: 'transform, opacity' }}
          >
            <label htmlFor="bl-email">Get the next one</label>
            <div className="bl-form-row">
              <input
                id="bl-email"
                type="email"
                placeholder="you@company.com"
                aria-label="Your work email"
              />
              <button type="submit" className="pg-btn">
                <span>Join</span>
                <ArrowRight size={17} strokeWidth={2.4} aria-hidden />
              </button>
            </div>
            <small>We have sent thirteen emails in two years. That is the whole track record.</small>
          </motion.form>
        </div>
      </Band>

      <CTABand
        title={<>Enough reading. <span className="serif">Let us look at your queue.</span></>}
        lead="Everything on this page came out of a real support floor. Thirty minutes and we will tell you what is happening on yours."
      />
    </PageShell>
  )
}
