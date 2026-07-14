import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin, Clock3 } from 'lucide-react'
import { PageShell, InnerHero, Band, SectionHead, CTABand } from '../components/page/PageKit'
import { MaskReveal, staggerParent, fadeUp, VIEWPORT } from '../lib/anim'

const TEXT       = '#2E3A34'
const ACCENT     = '#D2704A'
const ACCENT_INK = '#A85434'
const MUTED      = '#63706A'
const SAGE       = '#4E9E77'

/* ──────────────────────────────────────────────────────────────
   Careers: an honest job ad.

   Nine roles on a board you can filter by city. Each one opens
   into what the day actually is, what we pay, and - the part
   nobody writes - the part of the job that is genuinely hard.
   If somebody bounces off that paragraph, the hire was going to
   fail anyway, and it would have failed in month three instead
   of on this page.
   ────────────────────────────────────────────────────────────── */

type City = 'All' | 'Sydney' | 'Manila' | 'Bengaluru' | 'London'

type Role = {
  id: string
  title: string
  team: string
  city: Exclude<City, 'All'>
  type: string
  pay: string
  day: string
  hard: string
  want: string[]
}

const ROLES: Role[] = [
  {
    id: 'agent-voice-manila',
    title: 'Support Agent, Voice',
    team: 'Operations', city: 'Manila', type: 'Full time', pay: 'PHP 38,000 - 46,000 / month',
    day: 'You hold a live voice queue for one brand, in their name, on their systems. Around forty calls a day, every one of them a person who has already had a bad morning by the time they reach you.',
    hard: 'The first fortnight is reading, not talking. Two hundred real conversations before your first live call, and most people find that harder than the calls.',
    want: ['Clear spoken English', 'Two years on a phone queue', 'Patience under a queue that is growing', 'Willing to be recorded and reviewed'],
  },
  {
    id: 'agent-chat-bengaluru',
    title: 'Support Agent, Chat and Email',
    team: 'Operations', city: 'Bengaluru', type: 'Full time', pay: 'INR 5.4 - 7.2 LPA',
    day: 'Three chats at once and an inbox behind them, written in a brand voice that is not your own. You will write more in a week here than most people write in a year.',
    hard: 'Writing in somebody else\'s voice is a skill, and it takes about six weeks before it stops feeling like a costume.',
    want: ['Excellent written English', 'Fast, accurate typing', 'Comfortable with three threads at once', 'Zendesk or Intercom experience'],
  },
  {
    id: 'agent-night-manila',
    title: 'Night Desk Agent',
    team: 'Operations', city: 'Manila', type: 'Full time', pay: 'PHP 44,000 - 52,000 / month',
    day: 'You cover the Australian and UK overnight from a desk where it is the middle of the working day. Nobody at Nexa works a night shift in their own time zone, and this role is why that rule exists.',
    hard: 'It is quiet for hours and then it is not. The hard part is staying sharp through the quiet, and we will not pretend otherwise.',
    want: ['Two years on a live queue', 'Calm under a sudden spike', 'Comfortable working alone for stretches', 'Fluent English'],
  },
  {
    id: 'team-lead-sydney',
    title: 'Team Lead',
    team: 'Operations', city: 'Sydney', type: 'Full time', pay: 'AUD 95,000 - 115,000',
    day: 'You run a pod of eight to twelve agents on two or three brands. Rota, quality, coaching, and the call the client makes when something has gone wrong.',
    hard: 'You will be the one who tells an agent their score is not good enough, and then sits with them until it is. If you would rather not have that conversation, this is not the job.',
    want: ['You have worked a queue yourself', 'Three years leading agents', 'Can read a QA score and act on it', 'Will say the hard thing kindly'],
  },
  {
    id: 'qa-analyst-bengaluru',
    title: 'Quality Analyst',
    team: 'Quality', city: 'Bengaluru', type: 'Full time', pay: 'INR 8 - 11 LPA',
    day: 'You score real conversations against a rubric that measures the customer, not the reviewer, and you feed what you find back into training within the week.',
    hard: 'You will find our own misses before the client does, and then you have to publish them. That is the job, and some weeks it is uncomfortable.',
    want: ['Two years in QA on a support floor', 'You can defend a score with evidence', 'Comfortable being unpopular on a Friday', 'Sharp written English'],
  },
  {
    id: 'wfm-manila',
    title: 'Workforce Planner',
    team: 'Operations', city: 'Manila', type: 'Full time', pay: 'PHP 70,000 - 90,000 / month',
    day: 'You forecast volume across four cities and thirty-one brands, and you build the rota that means nobody gets caught short at 3am on a Sunday in November.',
    hard: 'When you get it right nobody notices. When you get it wrong everybody does, immediately, and by name.',
    want: ['Erlang C is not a mystery to you', 'Three years in WFM', 'Spreadsheets you would defend in public', 'Calm about peak season'],
  },
  {
    id: 'onboarding-lead-sydney',
    title: 'Onboarding Lead',
    team: 'Onboarding', city: 'Sydney', type: 'Full time', pay: 'AUD 105,000 - 125,000',
    day: 'You take a signed client from nothing to a live queue in ten days: read their tickets, build the training, run the interviews, hold the first week.',
    hard: 'You will be asked, on nearly every engagement, to shorten the two days of reading. The job is to say no, to a client, in week one.',
    want: ['You have onboarded support teams before', 'Comfortable in front of a client', 'Can write training that people finish', 'Will hold a line under pressure'],
  },
  {
    id: 'client-lead-london',
    title: 'Client Lead',
    team: 'Commercial', city: 'London', type: 'Full time', pay: 'GBP 62,000 - 78,000 + bonus',
    day: 'You own the relationship with six or seven brands: the numbers, the quarterly review, and the honest conversation about what is and is not working.',
    hard: 'We do not have lock-in, so a client can leave on fourteen days. Your job security is entirely the quality of the floor, which means you have to police it.',
    want: ['Five years in an account role', 'You know what a support metric actually means', 'Will tell a client bad news early', 'No interest in a lock-in clause'],
  },
  {
    id: 'people-partner-london',
    title: 'People Partner',
    team: 'People', city: 'London', type: 'Full time', pay: 'GBP 55,000 - 68,000',
    day: 'You hire agents across four cities, sit in on client interviews, and own the reason our attrition is nine percent in an industry that runs at forty.',
    hard: 'You will be measured on retention at twelve months, not on time to hire. That is a slow scoreboard and it takes a year to know if you are winning.',
    want: ['You have hired for a support floor', 'Comfortable across four jurisdictions', 'You think attrition is a design problem', 'Three years in a people role'],
  },
]

const CITIES: City[] = ['All', 'Sydney', 'Manila', 'Bengaluru', 'London']

/* what the job is actually like, without the fruit bowl */
const REAL: [string, string][] = [
  ['You will never work a night shift in your own time zone', 'The follow-the-sun rota exists so that 3am for a customer is the middle of somebody\'s working day. It costs us a city. It is not negotiable.'],
  ['You get two days of reading before your first call', 'Two hundred real conversations, on the clock, paid. Clients ask us to cut it on every engagement and we have never once agreed.'],
  ['Your score is published, including ours', 'Quality is reviewed weekly and the misses go up on the board, starting with the ones the leads made.'],
  ['Four of five leads started on a queue', 'Nobody here manages a floor they have never worked, and the promotion ladder starts on the phones on purpose.'],
]

export function CareersPage() {
  const reduce = useReducedMotion() ?? false
  const [city, setCity] = useState<City>('All')
  const [open, setOpen] = useState<string | null>(ROLES[0].id)

  const shown = useMemo(
    () => (city === 'All' ? ROLES : ROLES.filter((r) => r.city === city)),
    [city],
  )

  return (
    <PageShell>
      <style>{`
        /* ══════════ the hero figure: the board ══════════ */
        .cr-fig {
          position: relative; width: 100%; max-width: 560px; justify-self: end;
          border-radius: 20px; overflow: hidden;
          background: linear-gradient(168deg, #FFFFFF 0%, #FFFFFF 55%, #FBF8F3 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(20,20,22,0.07),
                      0 1px 3px rgba(20,20,22,0.06), 0 40px 78px -44px rgba(20,20,22,0.34);
        }
        .cr-fig-top {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: clamp(17px, 1.9vw, 24px) clamp(19px, 2.1vw, 28px);
          border-bottom: 1px solid rgba(26,33,29,0.12);
        }
        .cr-fig-top b {
          display: inline-flex; align-items: center; gap: 9px;
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(12px, 0.95vw, 14px); color: ${TEXT};
        }
        .cr-fig-top b i {
          position: relative; width: 7px; height: 7px; border-radius: 50%; background: ${SAGE};
        }
        .cr-fig-top b i::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%; border: 1px solid ${SAGE};
          animation: cr-ping 2.4s cubic-bezier(.16,1,.3,1) infinite; will-change: transform, opacity;
        }
        @keyframes cr-ping {
          0%        { transform: scale(1);   opacity: .6; }
          70%, 100% { transform: scale(2.8); opacity: 0; }
        }
        .cr-fig-top span {
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.6px; color: ${ACCENT_INK};
        }
        .cr-fig-rows { display: grid; }
        .cr-fig-row {
          display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px;
          padding: clamp(13px, 1.5vw, 18px) clamp(19px, 2.1vw, 28px);
          border-bottom: 1px solid rgba(26,33,29,0.08);
        }
        .cr-fig-row:last-child { border-bottom: 0; }
        .cr-fig-row b {
          display: block; font-family: 'Inter', sans-serif; font-weight: 600;
          font-size: clamp(13px, 1.02vw, 15.5px); color: ${TEXT};
        }
        .cr-fig-row em {
          display: block; margin-top: 3px; font-style: normal; font-family: 'Inter', sans-serif;
          font-size: clamp(11px, 0.86vw, 13px); color: ${MUTED};
        }
        .cr-fig-row span {
          font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: 9.5px; letter-spacing: 1.4px; color: ${ACCENT};
          padding: 6px 11px; border-radius: 100px; background: rgba(210,112,74,0.1);
          box-shadow: inset 0 0 0 1px rgba(210,112,74,0.24); white-space: nowrap;
        }

        /* ══════════ the board ══════════ */
        .cr-rail { display: flex; flex-wrap: wrap; gap: 9px; margin-bottom: clamp(24px, 2.8vw, 40px); }
        .cr-pill {
          cursor: pointer; border: 0; background: none;
          display: inline-flex; align-items: center; gap: 9px;
          min-height: 44px; padding: 11px clamp(16px, 1.6vw, 22px); border-radius: 100px;
          box-shadow: inset 0 0 0 1px rgba(26,33,29,0.16);
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(12px, 0.95vw, 14.5px);
          color: ${MUTED}; will-change: transform;
          transition: color .4s ease, box-shadow .4s ease, background .4s ease, transform .5s cubic-bezier(.16,1,.3,1);
        }
        .cr-pill:hover { color: ${TEXT}; box-shadow: inset 0 0 0 1px rgba(26,33,29,0.34); }
        .cr-pill.on {
          color: #fff; transform: translateY(-2px);
          background: linear-gradient(168deg, #F09A72 0%, ${ACCENT} 48%, #9C4324 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(84,34,16,0.3),
                      0 12px 24px -12px rgba(156,67,36,0.65);
        }
        .cr-pill em { font-style: normal; font-weight: 800; font-variant-numeric: tabular-nums; font-size: 11px; opacity: 0.7; }

        .cr-board { border-top: 1px solid rgba(26,33,29,0.14); }
        .cr-row {
          position: relative; isolation: isolate; width: 100%; text-align: left; cursor: pointer;
          border: 0; background: none; color: inherit; display: grid;
          grid-template-columns: minmax(0, 1fr) auto auto auto;
          gap: clamp(14px, 2vw, 32px); align-items: center;
          padding: clamp(19px, 2.2vw, 30px) clamp(10px, 1.2vw, 20px);
          border-bottom: 1px solid rgba(26,33,29,0.14);
        }
        .cr-row::before {
          content: ''; position: absolute; inset: 0; z-index: -1; border-radius: 10px;
          background: linear-gradient(90deg, rgba(210,112,74,0.12), rgba(210,112,74,0.01));
          transform: scaleX(0); transform-origin: left; will-change: transform;
          transition: transform .7s cubic-bezier(.16,1,.3,1);
        }
        .cr-row:hover::before, .cr-row.on::before, .cr-row:focus-visible::before { transform: scaleX(1); }
        .cr-row-t {
          font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.028em;
          font-size: clamp(19px, 1.75vw, 32px); line-height: 1.16; color: ${TEXT}; will-change: transform;
          transition: transform .7s cubic-bezier(.16,1,.3,1), color .45s ease;
        }
        .cr-row:hover .cr-row-t { transform: translateX(clamp(4px, 0.6vw, 10px)); }
        .cr-row.on .cr-row-t { color: ${ACCENT}; }
        .cr-row-t em {
          display: block; margin-top: 5px; font-style: normal; font-family: 'Inter', sans-serif;
          font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 1.6px;
          color: rgba(26,33,29,0.4); transform: none;
        }
        .cr-row-m {
          display: inline-flex; align-items: center; gap: 7px; white-space: nowrap;
          font-family: 'Inter', sans-serif; font-weight: 600; font-size: clamp(12px, 0.95vw, 14.5px);
          color: ${MUTED};
        }
        .cr-row-m svg { color: rgba(26,33,29,0.35); flex: none; transition: color .45s ease; }
        .cr-row:hover .cr-row-m svg, .cr-row.on .cr-row-m svg { color: ${ACCENT}; }
        .cr-row-x {
          position: relative; flex: none; width: 44px; height: 44px; border-radius: 50%;
          display: grid; place-items: center; color: ${TEXT};
          border: 1px solid rgba(26,33,29,0.18); will-change: transform;
          transition: transform .6s cubic-bezier(.16,1,.3,1), background .4s ease, color .4s ease, border-color .4s ease;
        }
        .cr-row:hover .cr-row-x { border-color: rgba(210,112,74,0.5); }
        .cr-row.on .cr-row-x { background: ${ACCENT}; border-color: transparent; color: #fff; transform: rotate(45deg); }
        .cr-row-x i { position: absolute; background: currentColor; border-radius: 2px; }
        .cr-row-x i:first-child { width: 13px; height: 1.8px; }
        .cr-row-x i:last-child  { width: 1.8px; height: 13px; }

        /* the role, unrolled */
        .cr-open {
          display: grid; grid-template-rows: 0fr; border-bottom: 1px solid rgba(26,33,29,0.14);
          transition: grid-template-rows .75s cubic-bezier(.16,1,.3,1);
        }
        .cr-open.on { grid-template-rows: 1fr; }
        .cr-open-in { overflow: hidden; }
        .cr-open-grid {
          display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: clamp(22px, 3vw, 54px);
          padding: 0 clamp(10px, 1.2vw, 20px) clamp(28px, 3vw, 44px);
          opacity: 0; transform: translateY(10px); will-change: transform, opacity;
          transition: opacity .55s ease .1s, transform .7s cubic-bezier(.16,1,.3,1) .1s;
        }
        .cr-open.on .cr-open-grid { opacity: 1; transform: translateY(0); }
        .cr-k {
          margin: 0 0 10px; font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.8px; color: ${ACCENT_INK};
        }
        .cr-open-grid p.day {
          margin: 0 0 clamp(20px, 2.2vw, 28px); font-family: 'Inter', sans-serif;
          font-size: clamp(14px, 1.05vw, 17px); line-height: 1.85; color: ${MUTED};
        }
        /* the paragraph nobody else writes */
        .cr-hard {
          margin: 0; padding: clamp(16px, 1.8vw, 22px); border-radius: 14px;
          background: rgba(210,112,74,0.07); box-shadow: inset 0 0 0 1px rgba(210,112,74,0.2);
        }
        .cr-hard b {
          display: block; margin-bottom: 8px; font-family: 'Inter', sans-serif; font-weight: 800;
          text-transform: uppercase; font-size: 10px; letter-spacing: 1.7px; color: ${ACCENT_INK};
        }
        .cr-hard span {
          font-family: Georgia, 'Times New Roman', serif; font-style: italic;
          font-size: clamp(15px, 1.25vw, 21px); line-height: 1.55; color: ${TEXT};
        }
        .cr-want { list-style: none; display: grid; gap: 11px; margin: 0 0 clamp(20px, 2.2vw, 28px); padding: 0; }
        .cr-want li {
          display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 12px; align-items: start;
          font-family: 'Inter', sans-serif; font-size: clamp(13px, 1.02vw, 16px); line-height: 1.7; color: ${TEXT};
        }
        .cr-want li i { flex: none; margin-top: 8px; width: 6px; height: 6px; border-radius: 50%; background: ${ACCENT}; }
        .cr-pay {
          display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px;
          padding: clamp(15px, 1.7vw, 20px); border-radius: 14px; margin-bottom: clamp(18px, 2vw, 26px);
          background: rgba(26,33,29,0.04); box-shadow: inset 0 0 0 1px rgba(26,33,29,0.1);
        }
        .cr-pay b {
          font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
          font-size: clamp(18px, 1.6vw, 27px); line-height: 1.2; letter-spacing: -0.02em; color: ${TEXT};
        }
        .cr-pay span {
          font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.6px; color: ${MUTED};
        }

        /* ══════════ what the job is really like ══════════ */
        .cr-real { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(18px, 2vw, 32px); }
        .cr-real article { position: relative; padding-top: clamp(20px, 2.2vw, 28px); border-top: 2px solid #2A2A2A; }
        .cr-real article::before {
          content: ''; position: absolute; top: -2px; left: 0; width: 30%; height: 2px;
          background: linear-gradient(90deg, #F09A72, ${ACCENT});
        }
        .cr-real h3 {
          margin: 0 0 12px; font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.026em;
          font-size: clamp(19px, 1.7vw, 31px); line-height: 1.14; color: #fff; max-width: 20ch;
        }
        .cr-real p {
          margin: 0; font-family: 'Inter', sans-serif; font-size: clamp(13px, 1vw, 16px);
          line-height: 1.8; color: #BDBDBD;
        }

        /* the way in */
        .cr-steps {
          display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(14px, 1.6vw, 26px);
          margin-top: clamp(34px, 4vw, 58px); padding-top: clamp(26px, 3vw, 40px);
          border-top: 1px solid #2A2A2A;
        }
        .cr-step em {
          display: block; margin-bottom: 10px; font-style: normal; font-family: 'Inter', sans-serif;
          font-weight: 800; font-variant-numeric: tabular-nums; font-size: 11px; letter-spacing: 1.8px;
          color: #F09A72;
        }
        .cr-step b {
          display: block; margin-bottom: 7px; font-family: 'Inter', sans-serif; font-weight: 700;
          font-size: clamp(14px, 1.1vw, 17px); color: #fff;
        }
        .cr-step span {
          font-family: 'Inter', sans-serif; font-size: clamp(12px, 0.95vw, 14.5px); line-height: 1.7; color: #858387;
        }

        /* ══════════ responsive ══════════ */
        @media (max-width: 1024px) {
          .cr-fig { justify-self: center; }
          .cr-open-grid { grid-template-columns: minmax(0, 1fr); }
          .cr-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 860px) {
          .cr-real { grid-template-columns: minmax(0, 1fr); }
          .cr-row { grid-template-columns: minmax(0, 1fr) auto; row-gap: 12px; }
          .cr-row-m { grid-column: span 1; }
        }
        @media (max-width: 560px) {
          .cr-steps { grid-template-columns: minmax(0, 1fr); }
          .cr-row { grid-template-columns: minmax(0, 1fr); }
          .cr-row-x { justify-self: start; }
        }
        @media (prefers-reduced-motion: reduce) { .cr-fig-top b i::after { animation: none; } }
      `}</style>

      <InnerHero
        crumb="Careers"
        eyebrow="Careers"
        title={<>Nine roles, and <span className="serif">the honest version.</span></>}
        lead={
          <>
            Every advert below has a paragraph explaining the part of the job that is genuinely hard.
            <b> If you bounce off it, the hire was going to fail anyway</b> - and it is far kinder for
            that to happen on this page than in month three.
          </>
        }
        stats={[
          ['9', 'Roles open, four cities'],
          ['9%', 'Attrition, against 40% industry'],
          ['0', 'Night shifts in your own time zone'],
        ]}
        figure={
          <div className="cr-fig" aria-hidden>
            <div className="cr-fig-top">
              <b><i /> Hiring now</b>
              <span>9 open</span>
            </div>
            <div className="cr-fig-rows">
              {ROLES.slice(0, 4).map((r) => (
                <div className="cr-fig-row" key={r.id}>
                  <div>
                    <b>{r.title}</b>
                    <em>{r.team} - {r.type}</em>
                  </div>
                  <span>{r.city}</span>
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* ══════════ the board ══════════ */}
      <Band tone="white" label="Open roles">
        <SectionHead
          eyebrow="The board"
          title={<>Nine open roles, <span className="accent">no ghosting.</span></>}
          lead="Every application gets a written answer inside five working days, including the no. We have never once broken that, and it is the easiest promise on this site to check."
        />

        <div className="cr-rail" role="tablist" aria-label="Cities">
          {CITIES.map((c) => {
            const count = c === 'All' ? ROLES.length : ROLES.filter((r) => r.city === c).length
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={city === c}
                className={`cr-pill${city === c ? ' on' : ''}`}
                onClick={() => setCity(c)}
              >
                {c}
                <em>{count}</em>
              </button>
            )
          })}
        </div>

        <motion.div
          className="cr-board"
          key={city}
          variants={staggerParent(0.05)}
          initial={reduce ? false : 'hidden'}
          animate="show"
        >
          {shown.map((r) => {
            const on = open === r.id
            return (
              <motion.div key={r.id} variants={fadeUp}>
                <button
                  type="button"
                  className={`cr-row${on ? ' on' : ''}`}
                  aria-expanded={on}
                  aria-controls={`cr-${r.id}`}
                  onClick={() => setOpen(on ? null : r.id)}
                >
                  <span className="cr-row-t">
                    {r.title}
                    <em>{r.team}</em>
                  </span>
                  <span className="cr-row-m">
                    <MapPin size={15} strokeWidth={2} aria-hidden />
                    {r.city}
                  </span>
                  <span className="cr-row-m">
                    <Clock3 size={15} strokeWidth={2} aria-hidden />
                    {r.type}
                  </span>
                  <span className="cr-row-x" aria-hidden><i /><i /></span>
                </button>

                <div className={`cr-open${on ? ' on' : ''}`} id={`cr-${r.id}`} role="region">
                  <div className="cr-open-in">
                    <div className="cr-open-grid">
                      <div>
                        <p className="cr-k">What the day actually is</p>
                        <p className="day">{r.day}</p>
                        <p className="cr-hard">
                          <b>The hard part</b>
                          <span>{r.hard}</span>
                        </p>
                      </div>

                      <div>
                        <div className="cr-pay">
                          <b>{r.pay}</b>
                          <span>Published, not negotiated in the dark</span>
                        </div>
                        <p className="cr-k">What we are looking for</p>
                        <ul className="cr-want">
                          {r.want.map((w) => (
                            <li key={w}><i aria-hidden />{w}</li>
                          ))}
                        </ul>
                        <Link to="/contact#write" className="pg-btn">
                          <span>Apply for this role</span>
                          <ArrowUpRight size={17} strokeWidth={2.4} aria-hidden />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </Band>

      {/* ══════════ what it is really like ══════════ */}
      <Band tone="ink" label="What the job is really like">
        <SectionHead
          eyebrow="No fruit bowl"
          title={<>Four things that are true <span className="serif">on your first week.</span></>}
          lead="We are not going to tell you about the snacks. These are the four things that actually change what your Tuesday looks like."
        />

        <motion.div
          className="cr-real"
          variants={staggerParent(0.08)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {REAL.map(([t, d]) => (
            <motion.article key={t} variants={fadeUp}>
              <h3>{t}</h3>
              <p>{d}</p>
            </motion.article>
          ))}
        </motion.div>

        <div className="cr-steps">
          {[
            ['01', 'You apply', 'A form, or an email. No cover letter, and we mean that.'],
            ['02', 'A written answer', 'Inside five working days, always, including the no.'],
            ['03', 'Two conversations', 'One with the lead you would work for, one on the floor.'],
            ['04', 'An offer, or a reason', 'If it is a no, you get the actual reason, in writing.'],
          ].map(([n, t, d]) => (
            <div className="cr-step" key={n}>
              <em>{n}</em>
              <b>{t}</b>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </Band>

      {/* ══════════ the line ══════════ */}
      <Band tone="paper" label="In short">
        <MaskReveal as="p">
          <span style={{
            display: 'block',
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 'clamp(24px, 3vw, 52px)',
            lineHeight: 1.36,
            letterSpacing: '-0.015em',
            color: TEXT,
            maxWidth: '28ch',
          }}>
            The industry loses four in ten people a year and blames the wage.{' '}
            <span style={{ color: ACCENT, fontStyle: 'italic' }}>We lose one in eleven, and the wage is not why.</span>
          </span>
        </MaskReveal>
        <p style={{
          marginTop: 'clamp(20px, 2.4vw, 32px)',
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(14px, 1.05vw, 17px)',
          lineHeight: 1.8,
          color: MUTED,
          maxWidth: '58ch',
        }}>
          People leave support floors because the work is designed badly, not because the pay is bad.
          Fix the rota, fix the training, publish the scores, and promote off the phones. That is the
          entire retention strategy, and it took us ten years to be sure of it.
        </p>
        <div style={{ marginTop: 'clamp(24px, 2.8vw, 38px)', display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <Link to="/team" className="pg-btn">
            <span>Meet the people you would work for</span>
            <ArrowUpRight size={17} strokeWidth={2.4} aria-hidden />
          </Link>
          <Link to="/about" className="pg-btn ghost">
            <span>Read the story</span>
          </Link>
        </div>
      </Band>

      <CTABand
        title={<>Not on the board? <span className="serif">Write to us anyway.</span></>}
        lead="Half the people on the floor arrived without a role open. If you can do something we clearly need, tell us what it is and we will make the time."
      />
    </PageShell>
  )
}
