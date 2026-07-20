import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Package, Ticket, CalendarCheck, Truck, ShieldCheck, Plane } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageShell, InnerHero, Band, SectionHead, CTABand } from '../components/page/PageKit'
import {
  MaskReveal, Reveal, staggerParent, VIEWPORT,
  unfoldLeft, zoomIn, slideLeft, fadeDown, driftUp,
} from '../lib/anim'

const TEXT       = '#16141F'
const ACCENT     = '#998EFF'
const ACCENT_INK = '#6A5BE8'
const MUTED      = '#5E5B6B'

/* ──────────────────────────────────────────────────────────────
   Industries: six sectors, each given a full page-width slab.

   The trick here is that every sector gets the same six fields -
   the queue it runs, the thing that goes wrong in it, the words
   its agents have to know, and three figures. Same frame, six
   times, so the differences between sectors are the only thing
   your eye has to do any work on.
   ────────────────────────────────────────────────────────────── */

type Sector = {
  code: string
  name: string
  Icon: LucideIcon
  lead: string
  breaks: string
  runs: string[]
  words: string[]
  figs: [string, string][]
}

const SECTORS: Sector[] = [
  {
    code: 'E-COM', name: 'E-commerce and Retail', Icon: Package,
    lead: 'Order tracking, returns and refunds answered in minutes, right through the peak that breaks everyone else.',
    breaks: 'Volume triples in November and the team that was coping in October is now three days behind. Every unanswered "where is my order" becomes a chargeback four weeks later.',
    runs: ['Where is my order', 'Returns and refunds', 'Sizing and fit', 'Failed delivery', 'Chargeback defence'],
    words: ['RMA', 'Chargeback', 'Split shipment', 'Restock fee'],
    figs: [['5 days', 'To full peak cover'], ['92%', 'Fixed first time'], ['0:18', 'Average answer']],
  },
  {
    code: 'SAAS', name: 'SaaS and Technology', Icon: Ticket,
    lead: 'Tier 1 and tier 2 triaged, reproduced and resolved inside your own stack, never ours.',
    breaks: 'Every ticket that reaches an engineer costs a day of roadmap. Most of them never needed to, but nobody has time to work out which ones.',
    runs: ['Tier 1 triage', 'Tier 2 diagnosis', 'Bug repro', 'Onboarding', 'Release day cover'],
    words: ['Repro steps', 'Sev 1', 'Regression', 'Sandbox'],
    figs: [['86%', 'Closed without a dev'], ['2', 'Tiers held in house'], ['24/7', 'Release cover']],
  },
  {
    code: 'CARE', name: 'Healthcare and Clinics', Icon: CalendarCheck,
    lead: 'Booking, reminders and patient queries, handled by agents specifically trained to slow down.',
    breaks: 'A missed appointment costs the clinic the slot and the patient the month. The phone rings while the front desk is already with someone.',
    runs: ['Bookings', 'Reminders', 'Rescheduling', 'Referrals', 'Results triage'],
    words: ['Referral', 'Triage', 'Consent', 'No show'],
    figs: [['0:15', 'Average answer'], ['31%', 'Fewer no shows'], ['100%', 'Confidential']],
  },
  {
    code: 'MOVE', name: 'Logistics and Delivery', Icon: Truck,
    lead: 'Exceptions, driver support and live status chased down before the customer asks a second time.',
    breaks: 'One failed delivery generates four contacts across three channels, and the driver is on a road with no signal. The exception desk is the whole job.',
    runs: ['Delivery exceptions', 'Driver support', 'Live status', 'Claims', 'Reattempts'],
    words: ['POD', 'Reattempt', 'Exception', 'Last mile'],
    figs: [['24 hrs', 'Exception desk'], ['38%', 'Fewer chase calls'], ['7 days', 'A week, covered']],
  },
  {
    code: 'FIN', name: 'Fintech and Insurance', Icon: ShieldCheck,
    lead: 'Account queries, claims intake and verification, with an audit trail sitting under every single case.',
    breaks: 'Every conversation is a compliance event. One unlogged call is a finding, and a finding is a fine.',
    runs: ['Account queries', 'Claims intake', 'Verification', 'Disputes', 'Fraud escalation'],
    words: ['KYC', 'Chargeback', 'Excess', 'Underwriting'],
    figs: [['100%', 'Audited notes'], ['4 eyes', 'On every claim'], ['0', 'Cases left open']],
  },
  {
    code: 'TRVL', name: 'Travel and Hospitality', Icon: Plane,
    lead: 'Bookings, changes and cancellations answered in the language your guest actually booked in.',
    breaks: 'A cancelled flight is two hundred calls in ten minutes, all of them from someone standing in an airport, none of them patient.',
    runs: ['Bookings', 'Changes', 'Cancellations', 'Disruption', 'Loyalty'],
    words: ['PNR', 'Rebook', 'Disruption', 'Fare rules'],
    figs: [['6', 'Languages, day one'], ['0:19', 'Average answer'], ['365', 'Days covered']],
  },
]

/* what every sector gets, regardless */
const COMMON: [string, string][] = [
  ['Trained on your product', 'Two days reading real tickets before a single call is taken. The vocabulary above is learned, not guessed.'],
  ['Working in your systems', 'Your CRM and helpdesk, named logins, audited. We never ask you to adopt a tool of ours.'],
  ['Held to your numbers', 'Your SLA becomes our target, and we publish our own misses before you have to find them.'],
]

export function IndustriesPage() {
  const reduce = useReducedMotion() ?? false

  return (
    <PageShell>
      <style>{`
        /* ══════════ the hero figure: six sectors on a board ══════════ */
        .in-fig {
          position: relative; width: 100%; max-width: 620px; justify-self: end;
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(9px, 1vw, 14px);
        }
        .in-fig-cell {
          position: relative; overflow: hidden; aspect-ratio: 1 / 1; border-radius: 16px;
          display: grid; align-content: space-between;
          padding: clamp(13px, 1.5vw, 20px);
          background: linear-gradient(168deg, #FFFFFF 0%, #FFFFFF 55%, #FAF9FE 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 1px 2px rgba(26,22,44,0.05), 0 14px 30px -18px rgba(26,22,44,0.22);
          will-change: transform;
          animation: in-float 8s cubic-bezier(.4,0,.6,1) infinite;
        }
        .in-fig-cell:nth-child(1) { animation-delay: 0s; }
        .in-fig-cell:nth-child(2) { animation-delay: 0.5s; }
        .in-fig-cell:nth-child(3) { animation-delay: 1s; }
        .in-fig-cell:nth-child(4) { animation-delay: 1.5s; }
        .in-fig-cell:nth-child(5) { animation-delay: 2s; }
        .in-fig-cell:nth-child(6) { animation-delay: 2.5s; }
        @keyframes in-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -8px, 0); }
        }
        .in-fig-cell i {
          display: grid; place-items: center; width: 38px; height: 38px; border-radius: 11px;
          background: rgba(153,142,255,0.11); box-shadow: inset 0 0 0 1px rgba(153,142,255,0.26);
          color: ${ACCENT};
        }
        .in-fig-cell b {
          font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(9px, 0.72vw, 11px); letter-spacing: 1.6px; color: ${ACCENT_INK};
        }
        .in-fig-cell em {
          display: block; margin-top: 5px; font-style: normal;
          font-family: 'Universal Sans', sans-serif; font-weight: 800; letter-spacing: -0.02em; font-size: clamp(14px, 1.2vw, 19px);
          color: ${TEXT}; font-variant-numeric: tabular-nums;
        }

        /* ══════════ the sector slabs ══════════ */
        .in-slabs { display: grid; }
        .in-slab {
          position: relative; isolation: isolate;
          display: grid; grid-template-columns: clamp(96px, 10vw, 172px) minmax(0, 1.15fr) minmax(0, 0.85fr);
          gap: clamp(18px, 2.6vw, 52px); align-items: start;
          padding: clamp(30px, 3.4vw, 56px) clamp(10px, 1.4vw, 22px);
          border-bottom: 1px solid rgba(22,20,31,0.14);
        }
        .in-slab:first-child { border-top: 1px solid rgba(22,20,31,0.14); }
        .in-slab::before {
          content: ''; position: absolute; inset: 0; z-index: -1; border-radius: 14px;
          background: linear-gradient(90deg, rgba(153,142,255,0.1), rgba(153,142,255,0.01));
          transform: scaleX(0); transform-origin: left; will-change: transform;
          transition: transform .75s cubic-bezier(.16,1,.3,1);
        }
        .in-slab:hover::before { transform: scaleX(1); }

        /* the sector's mark */
        .in-mark { display: grid; gap: 14px; justify-items: start; }
        .in-mark i {
          display: grid; place-items: center; width: 52px; height: 52px; border-radius: 15px;
          background: rgba(153,142,255,0.11); box-shadow: inset 0 0 0 1px rgba(153,142,255,0.26);
          color: ${ACCENT}; will-change: transform;
          transition: transform .55s cubic-bezier(.16,1,.3,1), background .45s ease, color .45s ease, box-shadow .45s ease;
        }
        .in-slab:hover .in-mark i {
          transform: rotate(-7deg);
          background: linear-gradient(168deg, #C3BCFF 0%, ${ACCENT} 48%, #4A3DBF 100%);
          color: #fff;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55), 0 14px 26px -12px rgba(74,61,191,0.8);
        }
        .in-mark b {
          font-family: 'Universal Sans', sans-serif; font-weight: 800; font-size: clamp(10px, 0.8vw, 12px);
          letter-spacing: 2px; text-transform: uppercase; color: rgba(22,20,31,0.36);
          transition: color .5s ease;
        }
        .in-slab:hover .in-mark b { color: ${ACCENT_INK}; }

        .in-slab h3 {
          margin: 0 0 clamp(12px, 1.4vw, 18px); font-family: 'Universal Sans', sans-serif; 
          letter-spacing: -0.03em; font-size: clamp(24px, 2.5vw, 46px); line-height: 1.06; color: ${TEXT};
          will-change: transform; transition: transform .75s cubic-bezier(.16,1,.3,1);
        }
        .in-slab:hover h3 { transform: translateX(clamp(4px, 0.5vw, 10px)); }
        .in-lead {
          margin: 0 0 clamp(16px, 1.8vw, 24px);
          font-family: 'Universal Sans', sans-serif;
          font-size: clamp(16px, 1.35vw, 23px); line-height: 1.5; color: ${ACCENT};
        }
        /* what actually goes wrong in this sector */
        .in-breaks {
          margin: 0 0 clamp(18px, 2vw, 26px); padding: clamp(14px, 1.6vw, 20px);
          border-radius: 12px; background: rgba(22,20,31,0.04);
          box-shadow: inset 0 0 0 1px rgba(22,20,31,0.08);
          font-family: 'Universal Sans', sans-serif; font-size: clamp(13px, 1.02vw, 16px); line-height: 1.8; color: ${MUTED};
        }
        .in-breaks b {
          display: block; margin-bottom: 6px; font-weight: 800; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.6px; color: ${ACCENT_INK};
        }
        .in-runs { display: flex; flex-wrap: wrap; gap: 8px; }
        .in-runs span {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 13px; border-radius: 100px;
          background: rgba(153,142,255,0.09); box-shadow: inset 0 0 0 1px rgba(153,142,255,0.24);
          font-family: 'Universal Sans', sans-serif; font-weight: 600; font-size: clamp(11px, 0.9vw, 14px);
          color: ${ACCENT_INK};
        }

        /* the right column: the words, then the figures */
        .in-side { display: grid; gap: clamp(18px, 2vw, 26px); }
        .in-words { display: grid; gap: 10px; }
        .in-k {
          margin: 0; font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.8px; color: rgba(22,20,31,0.4);
        }
        .in-words-row { display: flex; flex-wrap: wrap; gap: 7px; }
        .in-words-row code {
          font-family: 'Universal Sans', sans-serif; font-weight: 700; font-size: clamp(11px, 0.88vw, 13px);
          padding: 6px 11px; border-radius: 7px; color: ${TEXT};
          background: rgba(22,20,31,0.05); box-shadow: inset 0 0 0 1px rgba(22,20,31,0.1);
        }
        .in-figs {
          display: grid; gap: 1px; background: rgba(22,20,31,0.12);
          border-radius: 13px; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(22,20,31,0.12);
        }
        .in-figs div {
          display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
          background: linear-gradient(168deg, rgba(255,255,255,0.97), rgba(255,255,255,0.72));
          padding: clamp(12px, 1.4vw, 17px) clamp(13px, 1.5vw, 18px);
        }
        .in-figs b {
          font-family: 'Universal Sans', sans-serif; font-weight: 800;
          font-size: clamp(19px, 1.7vw, 30px); line-height: 1; letter-spacing: -0.02em; color: ${TEXT};
          font-variant-numeric: tabular-nums;
        }
        .in-figs span {
          text-align: right; font-family: 'Universal Sans', sans-serif; font-weight: 600;
          font-size: clamp(11px, 0.88vw, 13px); line-height: 1.4; color: ${MUTED};
        }

        /* ══════════ what every sector gets ══════════ */
        .in-common { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(18px, 2vw, 32px); }
        .in-common article { padding-top: clamp(20px, 2.2vw, 28px); border-top: 2px solid #2F2A42; position: relative; }
        .in-common article::before {
          content: ''; position: absolute; top: -2px; left: 0; width: 34%; height: 2px;
          background: linear-gradient(90deg, #C3BCFF, ${ACCENT});
        }
        .in-common h3 {
          margin: 0 0 12px; font-family: 'Universal Sans', sans-serif; letter-spacing: -0.025em;
          font-size: clamp(19px, 1.7vw, 30px); line-height: 1.14; color: #fff;
        }
        .in-common p {
          margin: 0; font-family: 'Universal Sans', sans-serif; font-size: clamp(13px, 1vw, 16px);
          line-height: 1.8; color: #BDBDBD;
        }

        /* the sector nobody listed */
        .in-none {
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px;
          margin-top: clamp(36px, 4vw, 60px); padding-top: clamp(26px, 3vw, 40px);
          border-top: 1px solid #2F2A42;
        }
        .in-none p {
          margin: 0; max-width: 54ch; font-family: 'Universal Sans', sans-serif;
          font-size: clamp(14px, 1.05vw, 17px); line-height: 1.8; color: #BDBDBD;
        }
        .in-none p b { color: #fff; font-weight: 600; }

        /* ══════════ responsive ══════════ */
        @media (max-width: 1180px) {
          .in-slab { grid-template-columns: clamp(80px, 9vw, 120px) minmax(0, 1fr); }
          .in-side { grid-column: 1 / -1; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }
        }
        @media (max-width: 1024px) { .in-fig { justify-self: center; } }
        @media (max-width: 800px) {
          .in-common { grid-template-columns: minmax(0, 1fr); }
          .in-slab { grid-template-columns: minmax(0, 1fr); }
          .in-mark { grid-auto-flow: column; justify-content: start; align-items: center; gap: 14px; }
          .in-side { grid-template-columns: minmax(0, 1fr); }
        }
        @media (prefers-reduced-motion: reduce) { .in-fig-cell { animation: none; } }
      `}</style>

      <InnerHero
        crumb="Industries"
        eyebrow="Industries"
        title={<>We already speak <span className="serif">your customer's language.</span></>}
        lead={
          <>
            An agent who does not know what an RMA is, or a PNR, or a sev 1, is a very expensive way
            of reading a script. <b>Every Nexa agent learns your sector before your product</b>, and
            your product before your queue.
          </>
        }
        stats={[
          ['6', 'Sectors we run today'],
          ['31', 'Brands on the floor'],
          ['2 days', 'Reading tickets, before day one'],
        ]}
        figure={
          <div className="in-fig" aria-hidden>
            {SECTORS.map(({ code, Icon, figs }) => (
              <div className="in-fig-cell" key={code}>
                <i><Icon size={18} strokeWidth={1.9} /></i>
                <span>
                  <b>{code}</b>
                  <em>{figs[0][0]}</em>
                </span>
              </div>
            ))}
          </div>
        }
      />

      {/* ══════════ the sectors ══════════ */}
      <Band tone="white" label="Sectors">
        <SectionHead
          eyebrow="The sectors"
          title={<>Six queues, and <span className="accent">what breaks in each.</span></>}
          lead="Same frame, six times over. The queue we hold, the thing that actually goes wrong, the vocabulary your customer expects, and the figures we hold ourselves to."
        />

        <motion.div
          className="in-slabs"
          variants={staggerParent(0.07)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {SECTORS.map(({ code, name, Icon, lead, breaks, runs, words, figs }) => (
            <motion.article className="in-slab" key={code} variants={unfoldLeft}>
              <div className="in-mark">
                <i aria-hidden><Icon size={22} strokeWidth={1.9} /></i>
                <b>{code}</b>
              </div>

              <div>
                <h3>{name}</h3>
                <p className="in-lead">{lead}</p>
                <p className="in-breaks">
                  <b>What actually breaks</b>
                  {breaks}
                </p>
                <div className="in-runs">
                  {runs.map((r) => <span key={r}>{r}</span>)}
                </div>
              </div>

              <div className="in-side">
                <div className="in-words">
                  <p className="in-k">Words your agent will know</p>
                  <div className="in-words-row">
                    {words.map((w) => <code key={w}>{w}</code>)}
                  </div>
                </div>
                <div className="in-figs">
                  {figs.map(([v, l]) => (
                    <div key={l}>
                      <b>{v}</b>
                      <span>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Band>

      {/* ══════════ what everyone gets ══════════ */}
      <Band tone="ink" label="What every sector gets">
        <SectionHead
          eyebrow="Regardless"
          title={<>Three things that hold <span className="serif">in every sector.</span></>}
          lead="The vocabulary changes. These do not."
        />

        <motion.div
          className="in-common"
          variants={staggerParent(0.08)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {COMMON.map(([t, d]) => (
            <motion.article key={t} variants={zoomIn}>
              <h3>{t}</h3>
              <p>{d}</p>
            </motion.article>
          ))}
        </motion.div>

        <Reveal className="in-none" variant={slideLeft} delay={0.1}>
          <p>
            <b>Your sector is not on the list?</b> Neither were four of the six, until somebody rang
            and explained the queue. Tell us what your customers ask for and we will tell you honestly
            whether we can hold it.
          </p>
          <Link to="/case-studies" className="pg-btn ghost">
            <span>See the results</span>
            <ArrowUpRight size={17} strokeWidth={2.4} aria-hidden />
          </Link>
        </Reveal>
      </Band>

      {/* ══════════ the line ══════════ */}
      <Band tone="paper" label="In short">
        <MaskReveal as="p">
          <span style={{
            display: 'block',
            fontFamily: "'Universal Sans', sans-serif",
            fontSize: 'clamp(24px, 3vw, 52px)',
            lineHeight: 1.36,
            letterSpacing: '-0.015em',
            color: TEXT,
            maxWidth: '26ch',
          }}>
            A script can be learned in a day. A sector takes a fortnight.{' '}
            <span style={{ color: ACCENT }}>We spend the fortnight.</span>
          </span>
        </MaskReveal>
        <Reveal variant={driftUp} delay={0.08} as="p" style={{
          marginTop: 'clamp(20px, 2.4vw, 32px)',
          fontFamily: "'Universal Sans', sans-serif",
          fontSize: 'clamp(14px, 1.05vw, 17px)',
          lineHeight: 1.8,
          color: MUTED,
          maxWidth: '58ch',
        }}>
          It is the least glamorous thing we do and the only reason the first-time-fix number holds up.
          Agents who understand the sector stop guessing, and an agent who stops guessing stops
          escalating.
        </Reveal>
        <Reveal variant={fadeDown} delay={0.16} style={{ marginTop: 'clamp(24px, 2.8vw, 38px)', display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <Link to="/services" className="pg-btn">
            <span>See the six services</span>
            <ArrowUpRight size={17} strokeWidth={2.4} aria-hidden />
          </Link>
          <Link to="/solutions" className="pg-btn ghost">
            <span>Price a team</span>
          </Link>
        </Reveal>
      </Band>

      <CTABand
        title={<>Your sector, <span className="serif">held properly.</span></>}
        lead="Thirty minutes and we will tell you what your queue actually needs, including the parts of it we would not take on."
      />
    </PageShell>
  )
}
