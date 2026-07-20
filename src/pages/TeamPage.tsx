import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { PageShell, InnerHero, Band, SectionHead, CTABand } from '../components/page/PageKit'
import {
  MaskReveal, Reveal, staggerParent, VIEWPORT, EASE,
  slideLeft, zoomIn, swingIn, unfoldLeft,
} from '../lib/anim'

const TEXT       = '#16141F'
const ACCENT     = '#998EFF'
const ACCENT_INK = '#6A5BE8'
const MUTED      = '#5E5B6B'
const LIVE       = '#2EBAC6'

/* ──────────────────────────────────────────────────────────────
   Team: the people, not the org chart.

   A roster where the portrait is the row, and hovering one pulls
   the whole person into the frame beside it. Under that, the four
   desks with their local time, because "where do the agents sit"
   is the question everyone actually wants answered.
   ────────────────────────────────────────────────────────────── */

type Person = {
  id: string
  name: string
  role: string
  city: string
  since: string
  line: string
  bio: string
  /** head-and-shoulders portrait, cropped from the top by every frame */
  photo: string
  alt: string
}

const PEOPLE: Person[] = [
  {
    id: 'rj',
    name: 'RJ',
    role: 'Founder of Eloma Group',
    city: 'Melbourne',
    since: '2016',
    line: 'Took the first overnight shift himself, and still reads every letter this site sends.',
    bio: 'Spent two years as the founder answering his own tickets at midnight, could not find an outsourcer who wanted to talk about why the tickets existed, and built one. Takes the first call with every new client personally, which does not scale and is the point.',
    photo: '/images/team/rj.jpg',
    alt: 'Portrait of RJ, Founder of Eloma Group',
  },
  {
    id: 'shashank',
    name: 'Shashank Namedo',
    role: 'VP of Digital Design',
    city: 'London',
    since: '2018',
    line: 'Designs the screens the agents live in, then sits on the floor watching them get used.',
    bio: 'Owns every surface a customer or an agent ever touches, from the ticket view to the letter that lands in your inbox at 3am. He builds nothing without watching somebody use the version before it, which is why the console has fewer buttons every year instead of more.',
    photo: '/images/team/shashank.jpg',
    alt: 'Portrait of Shashank Namedo, VP of Digital Design',
  },
  {
    id: 'arpita',
    name: 'Arpita Negi',
    role: 'Senior Digital Marketing Manager',
    city: 'Bengaluru',
    since: '2019',
    line: 'Would rather publish the number that did not move than the one that did.',
    bio: 'Writes everything this company says in public, including the case studies that carry the figures we failed to shift. She has killed more campaigns than she has shipped, on the grounds that a support company that oversells itself is just making its own queue longer.',
    photo: '/images/team/arpita.jpg',
    alt: 'Portrait of Arpita Negi, Senior Digital Marketing Manager',
  },
  {
    id: 'sawan',
    name: 'Sawan Chourasia',
    role: 'Developer',
    city: 'Sydney',
    since: '2021',
    line: 'Built the routing that decides which agent your call actually reaches.',
    bio: 'Wrote most of the layer that sits between your helpdesk and our floor, so a pod can be live on your systems in ten days without anybody exporting a spreadsheet. Treats every integration as something that has to survive a Tuesday at peak, not a demo.',
    photo: '/images/team/sawan.jpg',
    alt: 'Portrait of Sawan Chourasia, Developer',
  },
  {
    id: 'ritesh',
    name: 'Ritesh Raj',
    role: 'Developer',
    city: 'Manila',
    since: '2022',
    line: 'Keeps the dashboard honest, including on the days it reads badly.',
    bio: 'Owns the reporting every client sees, and the rule that nothing on it is ever rounded in our favour. He built the night desk view Manila runs on after sitting a full shift on it, which is still how anything here gets designed.',
    photo: '/images/team/ritesh.jpg',
    alt: 'Portrait of Ritesh Raj, Developer',
  },
]

/* the desks, and what time it is on each */
const DESKS: { city: string; zone: string; offset: number; seats: string; opened: string }[] = [
  { city: 'Sydney',    zone: 'AEDT', offset: 11,  seats: '40 seats',  opened: 'Opened 2022' },
  { city: 'Manila',    zone: 'PHT',  offset: 8,   seats: '96 seats',  opened: 'Opened 2018' },
  { city: 'Bengaluru', zone: 'IST',  offset: 5.5, seats: '78 seats',  opened: 'Opened 2018' },
  { city: 'London',    zone: 'GMT',  offset: 0,   seats: '26 seats',  opened: 'Opened 2021' },
]

/* how the floor is actually built */
const HOW: [string, string][] = [
  ['Everyone is salaried', 'No contractors, no gig agents, no subcontracted queues. If they answer your phone, they are on our payroll and our training.'],
  ['Nine percent attrition', 'The industry runs at forty. We pay a little better and manage a lot better, and the second one is doing most of the work.'],
  ['Built in house', 'Design, engineering and the floor sit in one company. Nobody here ships a tool for a queue they have never sat on.'],
]

export function TeamPage() {
  const reduce = useReducedMotion() ?? false
  const [on, setOn] = useState(0)
  const p = PEOPLE[on]

  /* The clock is read in an effect, never during render: reading it in the body
     is impure, and would drift between renders. Same pattern as the contact page. */
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(id)
  }, [])

  /* each desk's local time, from the browser's clock */
  const clocks = useMemo(() => {
    const utc = now.getTime() + now.getTimezoneOffset() * 60000
    return DESKS.map((d) => {
      const t = new Date(utc + d.offset * 3600000)
      const hh = t.getHours()
      return {
        ...d,
        label: `${String(hh).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`,
        onShift: hh >= 7 && hh < 23,
      }
    })
  }, [now])

  return (
    <PageShell>
      <style>{`
        /* ══════════ the hero figure: five faces, fanned ══════════ */
        .tm-fig {
          position: relative; width: 100%; max-width: 600px; justify-self: end;
          display: flex; align-items: flex-end; justify-content: center;
          padding-bottom: clamp(12px, 1.6vw, 22px);
        }
        .tm-fig figure {
          position: relative; margin: 0 clamp(-18px, -1.6vw, -12px);
          width: clamp(88px, 11vw, 168px); aspect-ratio: 3 / 4;
          border-radius: 16px; overflow: hidden;
          box-shadow: inset 0 0 0 1px rgba(26,22,44,0.08),
                      0 26px 52px -28px rgba(26,22,44,0.5);
          will-change: transform;
          transition: transform .7s cubic-bezier(.16,1,.3,1);
        }
        .tm-fig figure:nth-child(1) { transform: rotate(-7deg) translateY(14px); z-index: 1; }
        .tm-fig figure:nth-child(2) { transform: rotate(-3.5deg) translateY(4px); z-index: 2; }
        .tm-fig figure:nth-child(3) { transform: rotate(0deg) translateY(-6px); z-index: 3; }
        .tm-fig figure:nth-child(4) { transform: rotate(3.5deg) translateY(4px); z-index: 2; }
        .tm-fig figure:nth-child(5) { transform: rotate(7deg) translateY(14px); z-index: 1; }
        .tm-fig:hover figure:nth-child(1) { transform: rotate(-11deg) translateY(6px); }
        .tm-fig:hover figure:nth-child(2) { transform: rotate(-5deg) translateY(-2px); }
        .tm-fig:hover figure:nth-child(3) { transform: rotate(0deg) translateY(-16px); }
        .tm-fig:hover figure:nth-child(4) { transform: rotate(5deg) translateY(-2px); }
        .tm-fig:hover figure:nth-child(5) { transform: rotate(11deg) translateY(6px); }
        /* every portrait is cropped from the top, so a cover crop keeps the face
           whatever shape the frame is - 1:1 in the roster, 3:4 in the card */
        .tm-vec {
          width: 100%; height: 100%; display: block;
          object-fit: cover; object-position: 50% 16%;
        }

        /* ══════════ the roster ══════════ */
        .tm-roster { display: grid; grid-template-columns: minmax(0, 0.52fr) minmax(0, 0.48fr); gap: clamp(24px, 3.4vw, 64px); align-items: start; }

        .tm-list { display: grid; }
        .tm-row {
          position: relative; isolation: isolate; width: 100%; text-align: left; cursor: pointer;
          border: 0; background: none; color: inherit;
          display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center;
          gap: clamp(14px, 1.6vw, 22px);
          padding: clamp(14px, 1.6vw, 20px) clamp(10px, 1.2vw, 16px);
          border-bottom: 1px solid rgba(22,20,31,0.14);
        }
        .tm-row:first-child { border-top: 1px solid rgba(22,20,31,0.14); }
        .tm-row::before {
          content: ''; position: absolute; inset: 0; z-index: -1; border-radius: 12px;
          background: linear-gradient(90deg, rgba(153,142,255,0.13), rgba(153,142,255,0.01));
          transform: scaleX(0); transform-origin: left; will-change: transform;
          transition: transform .7s cubic-bezier(.16,1,.3,1);
        }
        .tm-row:hover::before, .tm-row.on::before, .tm-row:focus-visible::before { transform: scaleX(1); }
        /* the thumbnail: greyscale until it is the one being read */
        .tm-row-shot {
          flex: none; width: clamp(52px, 5vw, 74px); aspect-ratio: 1; border-radius: 14px;
          overflow: hidden; box-shadow: inset 0 0 0 1px rgba(26,22,44,0.1);
          will-change: transform; transition: transform .6s cubic-bezier(.16,1,.3,1), box-shadow .5s ease;
        }
        .tm-row-shot .tm-vec {
          filter: grayscale(1) contrast(1.04); transition: filter .6s ease;
        }
        .tm-row:hover .tm-row-shot, .tm-row.on .tm-row-shot { transform: scale(1.05); }
        .tm-row.on .tm-row-shot { box-shadow: 0 0 0 2px ${ACCENT}, 0 12px 26px -12px rgba(74,61,191,0.7); }
        .tm-row:hover .tm-row-shot .tm-vec, .tm-row.on .tm-row-shot .tm-vec { filter: none; }

        .tm-row b {
          display: block; font-family: 'Eloma Sans', sans-serif; font-weight: 600; letter-spacing: -0.025em;
          font-size: clamp(17px, 1.5vw, 27px); line-height: 1.16; color: ${TEXT};
          will-change: transform; transition: transform .7s cubic-bezier(.16,1,.3,1), color .45s ease;
        }
        .tm-row:hover b { transform: translateX(4px); }
        .tm-row.on b { color: ${ACCENT}; }
        .tm-row em {
          display: block; margin-top: 4px; font-style: normal; font-family: 'Eloma Sans', sans-serif;
          font-weight: 600; font-size: clamp(12px, 0.92vw, 14px); color: ${MUTED};
        }
        .tm-row .city {
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(9px, 0.72vw, 11px); letter-spacing: 1.6px; color: rgba(22,20,31,0.35);
          white-space: nowrap; transition: color .45s ease;
        }
        .tm-row:hover .city, .tm-row.on .city { color: ${ACCENT_INK}; }

        /* the person, pulled into the frame */
        .tm-card {
          position: sticky; top: 92px; overflow: hidden; border-radius: 20px;
          background: linear-gradient(168deg, #FFFFFF 0%, #FFFFFF 55%, #FAF9FE 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 1px 3px rgba(26,22,44,0.06), 0 30px 62px -34px rgba(26,22,44,0.3);
        }
        .tm-card-shot { position: relative; aspect-ratio: 4 / 3; overflow: hidden; }
        .tm-card-shot::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, transparent 40%, rgba(20,17,31,0.6) 100%);
        }
        .tm-card-name {
          position: absolute; z-index: 2; left: clamp(18px, 2vw, 28px); bottom: clamp(16px, 1.8vw, 24px);
        }
        .tm-card-name b {
          display: block; font-family: 'Eloma Sans', sans-serif; font-weight: 600; letter-spacing: -0.03em;
          font-size: clamp(26px, 2.4vw, 44px); line-height: 1; color: #fff;
          text-shadow: 0 2px 20px rgba(20,17,31,0.5);
        }
        .tm-card-name span {
          display: block; margin-top: 8px; font-family: 'Eloma Sans', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: 10px; letter-spacing: 1.8px; color: #D6D0FF;
        }
        .tm-card-body { padding: clamp(22px, 2.4vw, 36px); }
        .tm-card-line {
          margin: 0 0 clamp(16px, 1.8vw, 22px); padding-left: clamp(14px, 1.4vw, 18px);
          border-left: 2px solid rgba(153,142,255,0.4);
          font-family: 'Eloma Sans', sans-serif;
          font-size: clamp(15px, 1.3vw, 22px); line-height: 1.5; color: ${ACCENT_INK};
        }
        .tm-card-bio {
          margin: 0 0 clamp(20px, 2.2vw, 28px);
          font-family: 'Eloma Sans', sans-serif; font-size: clamp(13px, 1.02vw, 16px); line-height: 1.85; color: ${MUTED};
        }
        .tm-card-meta {
          display: flex; flex-wrap: wrap; gap: clamp(12px, 1.4vw, 22px);
          padding-top: clamp(16px, 1.8vw, 22px); border-top: 1px solid rgba(22,20,31,0.12);
        }
        .tm-card-meta div { flex: 1; min-width: 110px; }
        .tm-card-meta b {
          display: block; font-family: 'Eloma Sans', sans-serif; font-weight: 400;
          font-size: clamp(18px, 1.6vw, 27px); line-height: 1; color: ${TEXT};
        }
        .tm-card-meta span {
          display: block; margin-top: 6px; font-family: 'Eloma Sans', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: 10px; letter-spacing: 1.5px; color: ${MUTED};
        }

        /* ══════════ the desks ══════════ */
        .tm-desks {
          display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px;
          background: #2F2A42; border-radius: 18px; overflow: hidden; box-shadow: inset 0 0 0 1px #2F2A42;
        }
        .tm-desk {
          background-color: #211C33;
          background-image: linear-gradient(168deg, rgba(255,255,255,0.05), rgba(255,255,255,0));
          padding: clamp(22px, 2.6vw, 38px);
        }
        .tm-desk b {
          display: flex; align-items: center; gap: 9px;
          font-family: 'Eloma Sans', sans-serif; font-weight: 600; letter-spacing: -0.02em;
          font-size: clamp(17px, 1.5vw, 26px); color: #fff;
        }
        .tm-desk b i { flex: none; width: 8px; height: 8px; border-radius: 50%; background: #3E3852; }
        .tm-desk b i.live { background: ${LIVE}; box-shadow: 0 0 12px rgba(46,186,198,0.7); }
        .tm-desk time {
          display: block; margin: clamp(14px, 1.6vw, 20px) 0 clamp(10px, 1.2vw, 14px);
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; font-size: clamp(30px, 3.2vw, 56px);
          line-height: 1; letter-spacing: -0.03em; color: ${ACCENT}; font-variant-numeric: tabular-nums;
        }
        .tm-desk-z {
          font-family: 'Eloma Sans', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.6px; color: #858387;
        }
        .tm-desk-m {
          display: flex; flex-wrap: wrap; gap: 10px; margin-top: clamp(16px, 1.8vw, 22px);
          padding-top: clamp(14px, 1.6vw, 18px); border-top: 1px solid #2F2A42;
        }
        .tm-desk-m span {
          font-family: 'Eloma Sans', sans-serif; font-weight: 600; font-size: 12.5px; color: #BDBDBD;
        }
        /* the separator is drawn, not typed - the typeface carries ASCII only,
           so a glyph dot here would fall back to the system font */
        .tm-desk-m span + span::before {
          content: ''; display: inline-block; vertical-align: middle;
          width: 3px; height: 3px; border-radius: 50%; background: #3E3852;
          margin: -2px 10px 0 0;
        }

        /* ══════════ how the floor is built ══════════ */
        .tm-how { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(18px, 2vw, 32px); }
        .tm-how article { position: relative; padding-top: clamp(20px, 2.2vw, 28px); border-top: 2px solid rgba(22,20,31,0.16); }
        .tm-how article::before {
          content: ''; position: absolute; top: -2px; left: 0; width: 34%; height: 2px;
          background: linear-gradient(90deg, #C3BCFF, ${ACCENT});
        }
        .tm-how h3 {
          margin: 0 0 12px; font-family: 'Eloma Sans', sans-serif; letter-spacing: -0.025em;
          font-size: clamp(19px, 1.7vw, 30px); line-height: 1.14; color: ${TEXT};
        }
        .tm-how p {
          margin: 0; font-family: 'Eloma Sans', sans-serif; font-size: clamp(13px, 1vw, 16px);
          line-height: 1.8; color: ${MUTED};
        }
        .tm-hire {
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px;
          margin-top: clamp(34px, 4vw, 58px); padding-top: clamp(26px, 3vw, 40px);
          border-top: 1px solid rgba(22,20,31,0.16);
        }
        .tm-hire p {
          margin: 0; max-width: 54ch; font-family: 'Eloma Sans', sans-serif;
          font-size: clamp(14px, 1.05vw, 17px); line-height: 1.8; color: ${MUTED};
        }
        .tm-hire p b { color: ${TEXT}; font-weight: 700; }

        /* ══════════ responsive ══════════ */
        @media (max-width: 1100px) {
          .tm-roster { grid-template-columns: minmax(0, 1fr); }
          .tm-card { position: static; }
          .tm-desks { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 1024px) { .tm-fig { justify-self: center; } }
        @media (max-width: 800px) { .tm-how { grid-template-columns: minmax(0, 1fr); } }
        @media (max-width: 560px) { .tm-desks { grid-template-columns: minmax(0, 1fr); } }
        @media (prefers-reduced-motion: reduce) {
          .tm-fig figure, .tm-row-shot, .tm-row-shot .tm-vec { transition: none; }
        }
      `}</style>

      <InnerHero
        crumb="Team"
        eyebrow="The people"
        title={<>The floor has <span className="serif">names on it.</span></>}
        lead={
          <>
            Two hundred and forty agents across four cities, and every one of them on our payroll.
            <b> The five people below build and run that floor</b>, which is why nobody here ships a
            tool for a queue they have never sat on.
          </>
        }
        stats={[
          ['240', 'Agents, all salaried'],
          ['9%', 'Attrition, against 40% industry'],
          ['5', 'Leads across four cities'],
        ]}
        figure={
          <div className="tm-fig" aria-hidden>
            {PEOPLE.map((x) => (
              <figure key={x.id}>
                <img className="tm-vec" src={x.photo} alt="" width={1000} height={1500} decoding="async" loading="lazy" />
              </figure>
            ))}
          </div>
        }
      />

      {/* ══════════ the roster ══════════ */}
      <Band tone="white" label="Leadership">
        <SectionHead
          eyebrow="The roster"
          title={<>Five people who would <span className="accent">run your queue.</span></>}
          lead="Not a board, not an advisory panel. These are the people whose phone rings when something on your account goes wrong at 3am."
        />

        <div className="tm-roster">
          <motion.div
            className="tm-list"
            role="tablist"
            aria-label="Leadership team"
            variants={staggerParent(0.06)}
            initial={reduce ? false : 'hidden'}
            whileInView="show"
            viewport={VIEWPORT}
          >
            {PEOPLE.map((x, i) => (
              <motion.button
                variants={slideLeft}
                key={x.id}
                type="button"
                role="tab"
                aria-selected={on === i}
                aria-controls="tm-card"
                className={`tm-row${on === i ? ' on' : ''}`}
                onClick={() => setOn(i)}
                onMouseEnter={() => setOn(i)}
              >
                <span className="tm-row-shot">
                  <img className="tm-vec" src={x.photo} alt="" width={1000} height={1500} decoding="async" loading="lazy" />
                </span>
                <span>
                  <b>{x.name}</b>
                  <em>{x.role}</em>
                </span>
                <span className="city">{x.city}</span>
              </motion.button>
            ))}
          </motion.div>

          <motion.article
            className="tm-card"
            id="tm-card"
            role="tabpanel"
            key={p.id}
            initial={reduce ? false : { opacity: 0, scale: 0.94, rotateY: -8, transformPerspective: 1200 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="tm-card-shot">
              <img className="tm-vec" src={p.photo} alt={p.alt} width={1000} height={1500} decoding="async" />
              <div className="tm-card-name">
                <b>{p.name}</b>
                <span>{p.role}</span>
              </div>
            </div>
            <div className="tm-card-body">
              <p className="tm-card-line">{p.line}</p>
              <p className="tm-card-bio">{p.bio}</p>
              <div className="tm-card-meta">
                <div>
                  <b>{p.city}</b>
                  <span>Based in</span>
                </div>
                <div>
                  <b>{p.since}</b>
                  <span>At Nexa since</span>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </Band>

      {/* ══════════ the desks ══════════ */}
      <Band tone="ink" label="Where the floors are">
        <SectionHead
          eyebrow="The desks"
          title={<>Four cities, <span className="serif">one payroll.</span></>}
          lead="Nobody at Nexa works a night shift in their own time zone. When it is 3am for your customer, it is the middle of somebody's working day."
        />

        <motion.div
          className="tm-desks"
          variants={staggerParent(0.08)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {clocks.map((c) => (
            <motion.div className="tm-desk" key={c.city} variants={unfoldLeft}>
              <b>
                <i className={c.onShift ? 'live' : undefined} aria-hidden />
                {c.city}
              </b>
              <time>{c.label}</time>
              <span className="tm-desk-z">
                {c.zone} {c.onShift ? '- on shift' : '- night cover'}
              </span>
              <div className="tm-desk-m">
                <span>{c.seats}</span>
                <span>{c.opened}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Band>

      {/* ══════════ how the floor is built ══════════ */}
      <Band tone="paper" label="How the floor is built">
        <SectionHead
          eyebrow="How it holds"
          title={<>Three reasons the floor <span className="serif">does not churn.</span></>}
          lead="An agent who leaves takes your product knowledge with them. Keeping people is not a culture perk, it is the whole product."
        />

        <motion.div
          className="tm-how"
          variants={staggerParent(0.08)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {HOW.map(([t, d]) => (
            <motion.article key={t} variants={zoomIn}>
              <h3>{t}</h3>
              <p>{d}</p>
            </motion.article>
          ))}
        </motion.div>

        <Reveal className="tm-hire" variant={swingIn} delay={0.1}>
          <p>
            <b>We are hiring across all four desks.</b> Nine roles open, including three that come
            with the two days of reading and the promise you will never work a night shift in your
            own time zone.
          </p>
          <Link to="/careers" className="pg-btn">
            <span>See the open roles</span>
            <ArrowUpRight size={17} strokeWidth={2.4} aria-hidden />
          </Link>
        </Reveal>
      </Band>

      {/* ══════════ the line ══════════ */}
      <Band tone="white" label="In short">
        <MaskReveal as="p">
          <span style={{
            display: 'block',
            fontFamily: "'Eloma Sans', sans-serif",
            fontSize: 'clamp(24px, 3vw, 52px)',
            lineHeight: 1.36,
            letterSpacing: '-0.015em',
            color: TEXT,
            maxWidth: '27ch',
          }}>
            You will meet every agent before they take a single one of your calls.{' '}
            <span style={{ color: ACCENT }}>Nobody else offers that, and we do not know why.</span>
          </span>
        </MaskReveal>
      </Band>

      <CTABand
        title={<>Meet the team <span className="serif">before you hire it.</span></>}
        lead="Thirty minutes with the people above, not a sales desk. You will know inside ten whether the floor is right for you."
      />
    </PageShell>
  )
}
