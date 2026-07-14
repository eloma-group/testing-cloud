import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { PageShell, InnerHero, Band, SectionHead, CTABand } from '../components/page/PageKit'
import { MaskReveal, staggerParent, fadeUp, VIEWPORT, EASE } from '../lib/anim'

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
  img: string
  alt: string
}

const PEOPLE: Person[] = [
  {
    id: 'rj',
    name: 'RJ',
    role: 'Founder',
    city: 'Melbourne',
    since: '2016',
    line: 'Took the first overnight shift himself, and still reads every letter this site sends.',
    bio: 'Spent two years as the founder answering his own tickets at midnight, could not find an outsourcer who wanted to talk about why the tickets existed, and built one. Takes the first call with every new client personally, which does not scale and is the point.',
    img: '/images/team/rj.jpg',
    alt: 'Portrait of RJ, founder of Nexa',
  },
  {
    id: 'priya',
    name: 'Priya N',
    role: 'Head of Quality',
    city: 'Bengaluru',
    since: '2018',
    line: 'Rewrote the QA rubric so it scores the customer, not the reviewer.',
    bio: 'Joined as an agent on the second week Bengaluru was open. Now owns every quality score on the floor and the training that sits behind it. She is the reason a Nexa agent reads two hundred of your tickets before taking a call.',
    img: '/images/team/priya.jpg',
    alt: 'Portrait of Priya N, Head of Quality',
  },
  {
    id: 'marco',
    name: 'Marco S',
    role: 'Head of Operations',
    city: 'Manila',
    since: '2019',
    line: 'Runs the night desk, and has opinions about what 3am does to people.',
    bio: 'Built the follow-the-sun rota that means nobody at Nexa works a night shift in their own time zone. He logged a full night desk minute by minute to prove the volume was never the problem, and then fixed the thing that was.',
    img: '/images/team/marco.jpg',
    alt: 'Portrait of Marco S, Head of Operations',
  },
  {
    id: 'aisha',
    name: 'Aisha R',
    role: 'Head of People',
    city: 'London',
    since: '2021',
    line: 'Keeps attrition at nine percent in an industry that runs at forty.',
    bio: 'Hires every agent on the floor and sits in on every client interview. She will tell you plainly that the industry blames the wage for attrition and that the wage is not why, and she has four years of numbers behind her when she says it.',
    img: '/images/team/aisha.jpg',
    alt: 'Portrait of Aisha R, Head of People',
  },
  {
    id: 'nadia',
    name: 'Nadia K',
    role: 'Head of Onboarding',
    city: 'Sydney',
    since: '2022',
    line: 'Gets a pod from signature to first call in ten days, without cutting the reading.',
    bio: 'Owns the two days every agent spends reading your real tickets before they touch the live queue. It costs Nexa a fortnight of billable time on every engagement and she has never once agreed to shorten it.',
    img: '/images/team/nadia.jpg',
    alt: 'Portrait of Nadia K, Head of Onboarding',
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
  ['Promoted from the phones', 'Four of the five people above started on a queue. Nobody here manages a floor they have never worked.'],
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
        .tm-fig img { width: 100%; height: 100%; object-fit: cover; display: block; }

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
        .tm-row-shot img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: grayscale(1) contrast(1.04); transition: filter .6s ease;
        }
        .tm-row:hover .tm-row-shot, .tm-row.on .tm-row-shot { transform: scale(1.05); }
        .tm-row.on .tm-row-shot { box-shadow: 0 0 0 2px ${ACCENT}, 0 12px 26px -12px rgba(74,61,191,0.7); }
        .tm-row:hover .tm-row-shot img, .tm-row.on .tm-row-shot img { filter: none; }

        .tm-row b {
          display: block; font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.025em;
          font-size: clamp(17px, 1.5vw, 27px); line-height: 1.16; color: ${TEXT};
          will-change: transform; transition: transform .7s cubic-bezier(.16,1,.3,1), color .45s ease;
        }
        .tm-row:hover b { transform: translateX(4px); }
        .tm-row.on b { color: ${ACCENT}; }
        .tm-row em {
          display: block; margin-top: 4px; font-style: normal; font-family: 'Inter', sans-serif;
          font-weight: 600; font-size: clamp(12px, 0.92vw, 14px); color: ${MUTED};
        }
        .tm-row .city {
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
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
        .tm-card-shot img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .tm-card-shot::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, transparent 40%, rgba(20,17,31,0.6) 100%);
        }
        .tm-card-name {
          position: absolute; z-index: 2; left: clamp(18px, 2vw, 28px); bottom: clamp(16px, 1.8vw, 24px);
        }
        .tm-card-name b {
          display: block; font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.03em;
          font-size: clamp(26px, 2.4vw, 44px); line-height: 1; color: #fff;
          text-shadow: 0 2px 20px rgba(20,17,31,0.5);
        }
        .tm-card-name span {
          display: block; margin-top: 8px; font-family: 'Inter', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: 10px; letter-spacing: 1.8px; color: #D6D0FF;
        }
        .tm-card-body { padding: clamp(22px, 2.4vw, 36px); }
        .tm-card-line {
          margin: 0 0 clamp(16px, 1.8vw, 22px); padding-left: clamp(14px, 1.4vw, 18px);
          border-left: 2px solid rgba(153,142,255,0.4);
          font-family: Georgia, 'Times New Roman', serif; font-style: italic;
          font-size: clamp(15px, 1.3vw, 22px); line-height: 1.5; color: ${ACCENT_INK};
        }
        .tm-card-bio {
          margin: 0 0 clamp(20px, 2.2vw, 28px);
          font-family: 'Inter', sans-serif; font-size: clamp(13px, 1.02vw, 16px); line-height: 1.85; color: ${MUTED};
        }
        .tm-card-meta {
          display: flex; flex-wrap: wrap; gap: clamp(12px, 1.4vw, 22px);
          padding-top: clamp(16px, 1.8vw, 22px); border-top: 1px solid rgba(22,20,31,0.12);
        }
        .tm-card-meta div { flex: 1; min-width: 110px; }
        .tm-card-meta b {
          display: block; font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
          font-size: clamp(18px, 1.6vw, 27px); line-height: 1; color: ${TEXT};
        }
        .tm-card-meta span {
          display: block; margin-top: 6px; font-family: 'Inter', sans-serif; font-weight: 700;
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
          font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.02em;
          font-size: clamp(17px, 1.5vw, 26px); color: #fff;
        }
        .tm-desk b i { flex: none; width: 8px; height: 8px; border-radius: 50%; background: #3E3852; }
        .tm-desk b i.live { background: ${LIVE}; box-shadow: 0 0 12px rgba(46,186,198,0.7); }
        .tm-desk time {
          display: block; margin: clamp(14px, 1.6vw, 20px) 0 clamp(10px, 1.2vw, 14px);
          font-family: Georgia, 'Times New Roman', serif; font-size: clamp(30px, 3.2vw, 56px);
          line-height: 1; letter-spacing: -0.03em; color: ${ACCENT}; font-variant-numeric: tabular-nums;
        }
        .tm-desk-z {
          font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.6px; color: #858387;
        }
        .tm-desk-m {
          display: flex; flex-wrap: wrap; gap: 10px; margin-top: clamp(16px, 1.8vw, 22px);
          padding-top: clamp(14px, 1.6vw, 18px); border-top: 1px solid #2F2A42;
        }
        .tm-desk-m span {
          font-family: 'Inter', sans-serif; font-weight: 600; font-size: 12.5px; color: #BDBDBD;
        }
        .tm-desk-m span + span::before {
          content: '·'; margin-right: 10px; color: #3E3852;
        }

        /* ══════════ how the floor is built ══════════ */
        .tm-how { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(18px, 2vw, 32px); }
        .tm-how article { position: relative; padding-top: clamp(20px, 2.2vw, 28px); border-top: 2px solid rgba(22,20,31,0.16); }
        .tm-how article::before {
          content: ''; position: absolute; top: -2px; left: 0; width: 34%; height: 2px;
          background: linear-gradient(90deg, #C3BCFF, ${ACCENT});
        }
        .tm-how h3 {
          margin: 0 0 12px; font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.025em;
          font-size: clamp(19px, 1.7vw, 30px); line-height: 1.14; color: ${TEXT};
        }
        .tm-how p {
          margin: 0; font-family: 'Inter', sans-serif; font-size: clamp(13px, 1vw, 16px);
          line-height: 1.8; color: ${MUTED};
        }
        .tm-hire {
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px;
          margin-top: clamp(34px, 4vw, 58px); padding-top: clamp(26px, 3vw, 40px);
          border-top: 1px solid rgba(22,20,31,0.16);
        }
        .tm-hire p {
          margin: 0; max-width: 54ch; font-family: 'Inter', sans-serif;
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
          .tm-fig figure, .tm-row-shot { transition: none; }
        }
      `}</style>

      <InnerHero
        crumb="Team"
        eyebrow="The people"
        title={<>The floor has <span className="serif">names on it.</span></>}
        lead={
          <>
            Two hundred and forty agents across four cities, and every one of them on our payroll.
            <b> Four of the five people below started on a queue</b>, which is why nobody here manages
            a floor they have never worked.
          </>
        }
        stats={[
          ['240', 'Agents, all salaried'],
          ['9%', 'Attrition, against 40% industry'],
          ['4/5', 'Leads promoted off the phones'],
        ]}
        figure={
          <div className="tm-fig" aria-hidden>
            {PEOPLE.map((x) => (
              <figure key={x.id}>
                <img src={x.img} alt="" width={220} height={293} decoding="async" />
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
          <div className="tm-list" role="tablist" aria-label="Leadership team">
            {PEOPLE.map((x, i) => (
              <button
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
                  <img src={x.img} alt="" width={148} height={148} decoding="async" />
                </span>
                <span>
                  <b>{x.name}</b>
                  <em>{x.role}</em>
                </span>
                <span className="city">{x.city}</span>
              </button>
            ))}
          </div>

          <motion.article
            className="tm-card"
            id="tm-card"
            role="tabpanel"
            key={p.id}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <div className="tm-card-shot">
              <img src={p.img} alt={p.alt} width={720} height={540} decoding="async" />
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

        <div className="tm-desks">
          {clocks.map((c) => (
            <div className="tm-desk" key={c.city}>
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
            </div>
          ))}
        </div>
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
            <motion.article key={t} variants={fadeUp}>
              <h3>{t}</h3>
              <p>{d}</p>
            </motion.article>
          ))}
        </motion.div>

        <div className="tm-hire">
          <p>
            <b>We are hiring across all four desks.</b> Nine roles open, including three that come
            with the two days of reading and the promise you will never work a night shift in your
            own time zone.
          </p>
          <Link to="/careers" className="pg-btn">
            <span>See the open roles</span>
            <ArrowUpRight size={17} strokeWidth={2.4} aria-hidden />
          </Link>
        </div>
      </Band>

      {/* ══════════ the line ══════════ */}
      <Band tone="white" label="In short">
        <MaskReveal as="p">
          <span style={{
            display: 'block',
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 'clamp(24px, 3vw, 52px)',
            lineHeight: 1.36,
            letterSpacing: '-0.015em',
            color: TEXT,
            maxWidth: '27ch',
          }}>
            You will meet every agent before they take a single one of your calls.{' '}
            <span style={{ color: ACCENT, fontStyle: 'italic' }}>Nobody else offers that, and we do not know why.</span>
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
