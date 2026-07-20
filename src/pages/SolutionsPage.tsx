import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Clock, Flame, Globe2, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageShell, InnerHero, Band, SectionHead, CTABand } from '../components/page/PageKit'
import {
  MaskReveal, staggerParent, VIEWPORT, EASE,
  tiltIn, popUp, fadeDown,
} from '../lib/anim'

const TEXT       = '#16141F'
const ACCENT     = '#998EFF'
const ACCENT_INK = '#6A5BE8'
const MUTED      = '#5E5B6B'
const LIVE_INK   = '#0E7C88'   /* teal is only 2.2:1 on white, so the type takes the deep one */

/* ──────────────────────────────────────────────────────────────
   Solutions: the page that starts from the problem.

   Services answers "what do you do". This answers "what is wrong
   with my week". Four symptoms, three ways to buy, and a straight
   answer on the money - which is the thing everyone scrolls for
   and nobody publishes.
   ────────────────────────────────────────────────────────────── */

type Problem = {
  n: string
  Icon: LucideIcon
  symptom: string
  says: string
  fix: string
  moves: string[]
  proof: [string, string]
}

const PROBLEMS: Problem[] = [
  {
    n: '01', Icon: Flame,
    symptom: 'The queue is winning',
    says: '"We are three days behind and it grows faster than we clear it."',
    fix: 'A shared pod on your helpdesk inside ten days, working the backlog from the oldest ticket forward while your own team holds the new ones. The backlog is gone before your team even notices the help arrived.',
    moves: ['Backlog sweep', 'Tier 1 triage', 'Macros rebuilt', 'Tagging cleaned up'],
    proof: ['9 days', 'To a clean queue, median'],
  },
  {
    n: '02', Icon: Clock,
    symptom: 'Nights and weekends are dead air',
    says: '"Anything that breaks after six on Friday sits there until Monday."',
    fix: 'A night desk in a time zone where it is the middle of the working day. Not a skeleton rota of tired people, but a full shift of agents for whom 3am in Sydney is simply lunchtime.',
    moves: ['Follow the sun rota', 'Weekend cover', 'Public holidays', 'Escalation to your on-call'],
    proof: ['0:23', 'Average answer at 3am'],
  },
  {
    n: '03', Icon: Wallet,
    symptom: 'Support costs more than it returns',
    says: '"Every new customer makes the support line more expensive, not less."',
    fix: 'Pay per resolution instead of per seat, so the bill tracks the work and not the chair. Then we go after the reason the tickets exist, which is the only thing that ever actually lowers the number.',
    moves: ['Pay per resolution', 'Deflection at the source', 'Ticket root cause', 'Monthly cost per contact'],
    proof: ['41%', 'Median cost per contact, down'],
  },
  {
    n: '04', Icon: Globe2,
    symptom: 'A new market you cannot staff',
    says: '"We just launched in Germany and nobody on the team speaks German."',
    fix: 'Native agents in the language, on your stack, answering a local number. You get the market without opening an office in it, and without a recruiter taking three months to find one person.',
    moves: ['Native language agents', 'Local numbers', 'Timezone matched', 'Tone localised'],
    proof: ['6', 'Languages, live from day one'],
  },
]

/* three ways to buy the same floor */
type Model = {
  id: string
  name: string
  price: string
  unit: string
  who: string
  blurb: string
  has: string[]
  notice: string
  live: string
  best?: boolean
}

const MODELS: Model[] = [
  {
    id: 'pod',
    name: 'Shared Pod',
    price: 'From $6',
    unit: 'per resolved contact',
    who: 'Under 2,000 contacts a month',
    blurb: 'A pod of agents split across a handful of brands, all trained on yours. The fastest way onto the floor, and the cheapest way to find out whether any of this works for you.',
    has: ['Live in 10 days', 'Voice, chat and email', 'Your helpdesk, your macros', 'Weekly quality review', 'One named pod lead'],
    notice: '14 days notice',
    live: '10 days',
  },
  {
    id: 'dedicated',
    name: 'Dedicated Team',
    price: 'From $1,850',
    unit: 'per agent, per month',
    who: '2,000 to 20,000 contacts a month',
    blurb: 'Agents who work on nothing but your queue, whom you interview and approve before they are hired. They learn your product the way a new starter would, because that is what they are.',
    has: ['You interview every agent', 'Named team, no rotation', 'Your CRM on named logins', 'Daily standup with your lead', 'Call recording, all of it', 'Quality scored weekly'],
    notice: '30 days notice',
    live: '3 weeks',
    best: true,
  },
  {
    id: 'managed',
    name: 'Managed Floor',
    price: 'Quoted',
    unit: 'on volume and cover',
    who: 'Over 20,000 contacts a month',
    blurb: 'The whole function, run end to end: rota, quality, hiring, tooling and reporting. You keep the strategy and the customer relationship. We keep the pager.',
    has: ['Everything in Dedicated', 'Multi-city cover', 'Workforce planning', 'Your own QA analyst', 'Root cause programme', 'Quarterly business review'],
    notice: '60 days notice',
    live: '6 weeks',
  },
]

/* what stays yours, whatever you buy */
const KEEPS: [string, string][] = [
  ['Your data', 'It never leaves your systems. Agents work on named, audited logins inside your CRM.'],
  ['Your brand', 'Every call and reply goes out in your name, in your tone. We are never mentioned.'],
  ['Your veto', 'No agent joins your queue without your approval, and none stays on it without it.'],
  ['Your exit', 'Fourteen to sixty days notice, no clawback, and a handover pack we write for free.'],
]

export function SolutionsPage() {
  const reduce = useReducedMotion() ?? false
  const [pick, setPick] = useState(1)

  return (
    <PageShell>
      <style>{`
        /* ══════════ the hero figure: the stack, built up ══════════ */
        .so-fig {
          position: relative; width: 100%; max-width: 600px; justify-self: end;
          display: grid; gap: 12px;
        }
        .so-layer {
          position: relative; overflow: hidden; border-radius: 14px;
          display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 14px;
          padding: clamp(15px, 1.7vw, 21px) clamp(16px, 1.8vw, 24px);
          background: linear-gradient(168deg, #FFFFFF 0%, #FFFFFF 55%, #FAF9FE 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 1px 2px rgba(26,22,44,0.05), 0 14px 30px -18px rgba(26,22,44,0.24);
          will-change: transform;
          animation: so-rise 7s cubic-bezier(.4,0,.6,1) infinite;
        }
        .so-layer:nth-child(1) { animation-delay: 0s;    margin-right: 0; }
        .so-layer:nth-child(2) { animation-delay: 0.35s; margin-right: clamp(14px, 3vw, 42px); }
        .so-layer:nth-child(3) { animation-delay: 0.7s;  margin-right: clamp(28px, 6vw, 84px); }
        .so-layer:nth-child(4) { animation-delay: 1.05s; margin-right: clamp(42px, 9vw, 126px); }
        @keyframes so-rise {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -7px, 0); }
        }
        .so-layer i.k {
          display: grid; place-items: center; flex: none; width: 38px; height: 38px; border-radius: 11px;
          background: rgba(153,142,255,0.11); box-shadow: inset 0 0 0 1px rgba(153,142,255,0.26);
          color: ${ACCENT};
        }
        .so-layer b {
          display: block; font-family: 'Universal Sans', sans-serif; font-weight: 700;
          font-size: clamp(13px, 1.05vw, 16px); color: ${TEXT};
        }
        .so-layer em {
          display: block; margin-top: 3px; font-style: normal; font-family: 'Universal Sans', sans-serif;
          font-size: clamp(11px, 0.88vw, 13px); color: ${MUTED};
        }
        .so-layer time {
          font-family: 'Universal Sans', sans-serif; font-weight: 800; letter-spacing: -0.02em;
          font-size: clamp(14px, 1.2vw, 19px);
          color: ${ACCENT}; font-variant-numeric: tabular-nums;
        }
        /* the total, sitting under the stack */
        .so-tot {
          margin-top: 6px; border-radius: 14px; padding: clamp(16px, 1.8vw, 22px) clamp(16px, 1.8vw, 24px);
          display: flex; align-items: center; justify-content: space-between; gap: 14px;
          background-color: #211C33;
          background-image: linear-gradient(168deg, rgba(255,255,255,0.05), rgba(255,255,255,0));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px #2F2A42;
        }
        .so-tot b {
          font-family: 'Universal Sans', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.8px; color: #858387;
        }
        .so-tot span {
          font-family: 'Universal Sans', sans-serif; font-size: clamp(19px, 1.7vw, 28px);
          color: #fff; letter-spacing: -0.02em;
        }
        .so-tot span em { font-style: normal; color: ${ACCENT}; }

        /* ══════════ the four symptoms ══════════ */
        .so-probs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(16px, 1.8vw, 28px); }
        .so-prob {
          position: relative; isolation: isolate; overflow: hidden;
          display: flex; flex-direction: column;
          border-radius: 20px; padding: clamp(24px, 2.8vw, 42px);
          background: linear-gradient(168deg, #FFFFFF 0%, #FFFFFF 55%, #FAF9FE 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 1px 2px rgba(26,22,44,0.05), 0 10px 24px -14px rgba(26,22,44,0.18);
          will-change: transform;
          transition: transform .6s cubic-bezier(.16,1,.3,1), box-shadow .6s ease;
        }
        .so-prob:hover {
          transform: translateY(-5px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 1px 3px rgba(26,22,44,0.06), 0 28px 54px -26px rgba(26,22,44,0.3);
        }
        .so-prob::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #C3BCFF, ${ACCENT} 45%, rgba(153,142,255,0.3));
          transform: scaleX(0); transform-origin: left; will-change: transform;
          transition: transform .8s cubic-bezier(.16,1,.3,1);
        }
        .so-prob:hover::after { transform: scaleX(1); }
        .so-prob-top {
          display: flex; align-items: center; justify-content: space-between; gap: 14px;
          margin-bottom: clamp(16px, 1.8vw, 24px);
        }
        .so-prob-ic {
          display: grid; place-items: center; flex: none; width: 46px; height: 46px; border-radius: 13px;
          background: rgba(153,142,255,0.11); box-shadow: inset 0 0 0 1px rgba(153,142,255,0.26);
          color: ${ACCENT}; will-change: transform;
          transition: transform .55s cubic-bezier(.16,1,.3,1), background .45s ease, color .45s ease, box-shadow .45s ease;
        }
        .so-prob:hover .so-prob-ic {
          transform: rotate(-6deg);
          background: linear-gradient(168deg, #C3BCFF 0%, ${ACCENT} 48%, #4A3DBF 100%);
          color: #fff;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55), 0 12px 24px -12px rgba(74,61,191,0.8);
        }
        .so-prob-n {
          font-family: 'Universal Sans', sans-serif; font-weight: 800; font-variant-numeric: tabular-nums;
          font-size: 12px; letter-spacing: 2px; color: rgba(22,20,31,0.3);
        }
        .so-prob h3 {
          margin: 0 0 clamp(12px, 1.4vw, 16px); font-family: 'Universal Sans', sans-serif; 
          letter-spacing: -0.028em; font-size: clamp(21px, 2vw, 36px); line-height: 1.1; color: ${TEXT};
        }
        .so-prob blockquote {
          margin: 0 0 clamp(16px, 1.8vw, 22px); padding-left: clamp(14px, 1.4vw, 18px);
          border-left: 2px solid rgba(153,142,255,0.4);
          font-family: 'Universal Sans', sans-serif;
          font-size: clamp(15px, 1.25vw, 21px); line-height: 1.55; color: ${ACCENT_INK};
        }
        .so-prob > p {
          margin: 0 0 clamp(18px, 2vw, 26px);
          font-family: 'Universal Sans', sans-serif; font-size: clamp(13px, 1vw, 16px); line-height: 1.85; color: ${MUTED};
        }
        .so-prob-moves { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: clamp(18px, 2vw, 26px); }
        .so-prob-moves span {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 12px; border-radius: 100px;
          background: rgba(22,20,31,0.05); box-shadow: inset 0 0 0 1px rgba(22,20,31,0.1);
          font-family: 'Universal Sans', sans-serif; font-weight: 600; font-size: clamp(11px, 0.88vw, 13px); color: ${TEXT};
        }
        .so-prob-proof {
          display: flex; align-items: baseline; gap: 12px; margin-top: auto;
          padding-top: clamp(16px, 1.8vw, 22px); border-top: 1px dashed rgba(22,20,31,0.2);
        }
        .so-prob-proof b {
          font-family: 'Universal Sans', sans-serif; font-weight: 800;
          font-size: clamp(24px, 2.2vw, 40px); line-height: 1; letter-spacing: -0.02em; color: ${ACCENT};
        }
        .so-prob-proof span {
          font-family: 'Universal Sans', sans-serif; font-weight: 600; font-size: clamp(11px, 0.9vw, 14px);
          line-height: 1.5; color: ${MUTED};
        }

        /* ══════════ the money ══════════ */
        .so-pick { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: clamp(24px, 3vw, 40px); }
        .so-tab {
          position: relative; cursor: pointer; border: 0; background: none;
          display: inline-flex; align-items: center; gap: 10px;
          min-height: 48px; padding: 13px clamp(18px, 1.8vw, 26px); border-radius: 100px;
          box-shadow: inset 0 0 0 1px #2F2A42;
          font-family: 'Universal Sans', sans-serif; font-weight: 700; font-size: clamp(13px, 1vw, 15px);
          color: #BDBDBD;
          transition: color .4s ease, box-shadow .4s ease, background .4s ease, transform .5s cubic-bezier(.16,1,.3,1);
          will-change: transform;
        }
        .so-tab:hover { color: #fff; box-shadow: inset 0 0 0 1px #3E3852; }
        .so-tab.on {
          color: #fff; background: linear-gradient(168deg, #C3BCFF 0%, ${ACCENT} 48%, #4A3DBF 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(40,32,100,0.3),
                      0 14px 28px -12px rgba(74,61,191,0.7);
          transform: translateY(-2px);
        }
        .so-tab em {
          font-style: normal; font-weight: 800; font-variant-numeric: tabular-nums;
          font-size: 11px; letter-spacing: 1.4px; opacity: 0.75;
        }

        .so-plan { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: clamp(24px, 3.4vw, 62px); align-items: start; }
        .so-price {
          border-radius: 20px; padding: clamp(26px, 3vw, 46px);
          background-color: #211C33;
          background-image: linear-gradient(168deg, rgba(255,255,255,0.06), rgba(255,255,255,0));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px #2F2A42;
        }
        .so-price-badge {
          display: inline-flex; align-items: center; gap: 8px; margin-bottom: clamp(18px, 2vw, 26px);
          padding: 7px 13px; border-radius: 100px;
          background: rgba(153,142,255,0.16); box-shadow: inset 0 0 0 1px rgba(153,142,255,0.34);
          font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.8px; color: #C3BCFF;
        }
        .so-price h3 {
          margin: 0 0 clamp(14px, 1.6vw, 20px); font-family: 'Universal Sans', sans-serif; 
          letter-spacing: -0.03em; font-size: clamp(26px, 2.6vw, 46px); line-height: 1.06; color: #fff;
        }
        .so-price-fig {
          display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px;
          padding-bottom: clamp(18px, 2vw, 26px); margin-bottom: clamp(18px, 2vw, 26px);
          border-bottom: 1px solid #2F2A42;
        }
        .so-price-fig b {
          font-family: 'Universal Sans', sans-serif; font-weight: 800;
          font-size: clamp(34px, 3.6vw, 62px); line-height: 1; letter-spacing: -0.03em; color: ${ACCENT};
        }
        .so-price-fig span {
          font-family: 'Universal Sans', sans-serif; font-weight: 600; font-size: clamp(12px, 0.95vw, 15px); color: #858387;
        }
        .so-price > p {
          margin: 0 0 clamp(22px, 2.4vw, 32px); font-family: 'Universal Sans', sans-serif;
          font-size: clamp(13px, 1.02vw, 16px); line-height: 1.85; color: #BDBDBD;
        }
        .so-price-meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; background: #2F2A42; border-radius: 12px; overflow: hidden; box-shadow: inset 0 0 0 1px #2F2A42; }
        .so-price-meta div { background: #191527; padding: clamp(14px, 1.6vw, 20px); }
        .so-price-meta b {
          display: block; font-family: 'Universal Sans', sans-serif; font-weight: 800; letter-spacing: -0.02em;
          font-size: clamp(18px, 1.6vw, 27px); line-height: 1; color: #fff;
        }
        .so-price-meta span {
          display: block; margin-top: 7px; font-family: 'Universal Sans', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: 10px; letter-spacing: 1.5px; color: #858387;
        }

        /* what is in the box */
        .so-has { display: grid; }
        .so-has-k {
          margin: 0 0 clamp(16px, 2vw, 24px); font-family: 'Universal Sans', sans-serif; font-weight: 800;
          text-transform: uppercase; font-size: clamp(10px, 0.78vw, 12px); letter-spacing: 2px; color: #C3BCFF;
        }
        .so-has-row {
          display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 14px;
          padding: clamp(14px, 1.6vw, 19px) clamp(6px, 0.8vw, 12px);
          border-bottom: 1px solid #2F2A42;
        }
        .so-has-row:first-of-type { border-top: 1px solid #2F2A42; }
        .so-has-row i {
          display: grid; place-items: center; flex: none; width: 26px; height: 26px; border-radius: 50%;
          background: rgba(46,186,198,0.15); box-shadow: inset 0 0 0 1px rgba(46,186,198,0.34);
          color: ${LIVE_INK};
        }
        .so-has-row span {
          font-family: 'Universal Sans', sans-serif; font-weight: 600; font-size: clamp(14px, 1.08vw, 17px); color: #fff;
        }
        .so-has-foot {
          display: flex; flex-wrap: wrap; align-items: center; gap: 16px;
          margin-top: clamp(24px, 2.8vw, 36px);
        }
        .so-has-foot p {
          flex: 1; min-width: 220px; margin: 0; font-family: 'Universal Sans', sans-serif;
          font-size: clamp(12px, 0.95vw, 15px); line-height: 1.7; color: #858387;
        }

        /* ══════════ what stays yours ══════════ */
        .so-keeps { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(16px, 1.8vw, 28px); }
        .so-keep { padding-top: clamp(20px, 2.2vw, 28px); border-top: 2px solid rgba(22,20,31,0.16); position: relative; }
        .so-keep::before {
          content: ''; position: absolute; top: -2px; left: 0; width: 34%; height: 2px;
          background: linear-gradient(90deg, #C3BCFF, ${ACCENT});
        }
        .so-keep h3 {
          margin: 0 0 12px; font-family: 'Universal Sans', sans-serif; letter-spacing: -0.025em;
          font-size: clamp(19px, 1.7vw, 30px); line-height: 1.14; color: ${TEXT};
        }
        .so-keep p {
          margin: 0; font-family: 'Universal Sans', sans-serif; font-size: clamp(13px, 1vw, 16px);
          line-height: 1.8; color: ${MUTED};
        }

        /* ══════════ responsive ══════════ */
        @media (max-width: 1100px) { .so-plan { grid-template-columns: minmax(0, 1fr); } }
        @media (max-width: 1024px) {
          .so-fig { justify-self: center; }
          .so-keeps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 860px) { .so-probs { grid-template-columns: minmax(0, 1fr); } }
        @media (max-width: 560px) {
          .so-keeps { grid-template-columns: minmax(0, 1fr); }
          .so-price-meta { grid-template-columns: minmax(0, 1fr); }
          .so-tab { width: 100%; justify-content: center; }
        }
        @media (prefers-reduced-motion: reduce) { .so-layer { animation: none; } }
      `}</style>

      <InnerHero
        crumb="Solutions"
        eyebrow="Solutions"
        title={<>Start from what is <span className="serif">actually broken.</span></>}
        lead={
          <>
            Nobody wakes up wanting to buy a call centre. They wake up three days behind, or dead on
            a Friday night, or paying more per customer than the customer is worth.
            <b> Tell us the symptom and we will price the fix</b>, on the first call, out loud.
          </>
        }
        stats={[
          ['3', 'Ways to buy the same floor'],
          ['$6', 'Per resolved contact, from'],
          ['14 days', 'Notice, the shortest way out'],
        ]}
        figure={
          <div className="so-fig" aria-hidden>
            {[
              [Flame,  'Backlog sweep',   'Clear what is already late', '9d'],
              [Clock,  'Night desk',      'Cover 18:00 to 08:00',       '0:23'],
              [Globe2, 'Second language', 'German, native, on your line', '6'],
              [Wallet, 'Per resolution',  'Pay for outcomes, not chairs', '$6'],
            ].map(([Ic, k, note, v]) => {
              const I = Ic as LucideIcon
              return (
                <div className="so-layer" key={k as string}>
                  <i className="k"><I size={18} strokeWidth={1.9} /></i>
                  <span>
                    <b>{k as string}</b>
                    <em>{note as string}</em>
                  </span>
                  <time>{v as string}</time>
                </div>
              )
            })}
            <div className="so-tot">
              <b>Your stack, priced</b>
              <span>One bill, <em>one team</em></span>
            </div>
          </div>
        }
      />

      {/* ══════════ the four symptoms ══════════ */}
      <Band tone="white" label="The problems we are called about">
        <SectionHead
          eyebrow="The symptoms"
          title={<>Four reasons people <span className="accent">call us at all.</span></>}
          lead="One of these is almost always the reason. Find yours, and the rest of this page is just about how quickly it goes away."
        />

        <motion.div
          className="so-probs"
          variants={staggerParent(0.08)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {PROBLEMS.map(({ n, Icon, symptom, says, fix, moves, proof }) => (
            <motion.article className="so-prob" key={n} variants={tiltIn}>
              <div className="so-prob-top">
                <span className="so-prob-ic" aria-hidden><Icon size={20} strokeWidth={1.9} /></span>
                <span className="so-prob-n">{n}</span>
              </div>
              <h3>{symptom}</h3>
              <blockquote>{says}</blockquote>
              <p>{fix}</p>
              <div className="so-prob-moves">
                {moves.map((m) => <span key={m}>{m}</span>)}
              </div>
              <div className="so-prob-proof">
                <b>{proof[0]}</b>
                <span>{proof[1]}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Band>

      {/* ══════════ the money ══════════ */}
      <Band tone="ink" id="pricing" label="Pricing">
        <SectionHead
          eyebrow="The money"
          title={<>Three ways to buy <span className="serif">the same floor.</span></>}
          lead="Same agents, same training, same systems. The only thing that changes is how you pay for the hour and how quickly you can walk away."
        />

        <motion.div
          className="so-pick"
          role="tablist"
          aria-label="Engagement models"
          variants={staggerParent(0.07)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {MODELS.map((m, i) => (
            <motion.button
              variants={fadeDown}
              key={m.id}
              type="button"
              role="tab"
              aria-selected={pick === i}
              aria-controls="so-plan"
              className={`so-tab${pick === i ? ' on' : ''}`}
              onClick={() => setPick(i)}
            >
              <em>{String(i + 1).padStart(2, '0')}</em>
              {m.name}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="so-plan"
          id="so-plan"
          role="tabpanel"
          key={MODELS[pick].id}
          initial={reduce ? false : { opacity: 0, x: 40, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="so-price">
            {MODELS[pick].best && <span className="so-price-badge">Most chosen</span>}
            <h3>{MODELS[pick].name}</h3>
            <div className="so-price-fig">
              <b>{MODELS[pick].price}</b>
              <span>{MODELS[pick].unit}</span>
            </div>
            <p>{MODELS[pick].blurb}</p>
            <div className="so-price-meta">
              <div>
                <b>{MODELS[pick].live}</b>
                <span>To go live</span>
              </div>
              <div>
                <b>{MODELS[pick].notice}</b>
                <span>To walk away</span>
              </div>
            </div>
          </div>

          <div className="so-has">
            <p className="so-has-k">Built for {MODELS[pick].who.toLowerCase()}</p>
            {MODELS[pick].has.map((h) => (
              <div className="so-has-row" key={h}>
                <i aria-hidden><Check size={14} strokeWidth={3} /></i>
                <span>{h}</span>
              </div>
            ))}
            <div className="so-has-foot">
              <Link to="/contact#write" className="pg-btn">
                <span>Price my {MODELS[pick].name.toLowerCase()}</span>
                <ArrowRight size={17} strokeWidth={2.4} aria-hidden />
              </Link>
              <p>
                Every number above is a starting point, not a quote. The call that produces the real
                one takes thirty minutes and costs nothing.
              </p>
            </div>
          </div>
        </motion.div>
      </Band>

      {/* ══════════ what stays yours ══════════ */}
      <Band tone="paper" label="What stays yours">
        <SectionHead
          eyebrow="Non negotiable"
          title={<>Four things that stay <span className="serif">yours.</span></>}
          lead="Whichever model you take, these do not change, and they are not on the table in a negotiation."
        />

        <motion.div
          className="so-keeps"
          variants={staggerParent(0.07)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {KEEPS.map(([t, d]) => (
            <motion.article className="so-keep" key={t} variants={popUp}>
              <h3>{t}</h3>
              <p>{d}</p>
            </motion.article>
          ))}
        </motion.div>

        <div style={{ marginTop: 'clamp(32px, 4vw, 56px)' }}>
          <MaskReveal
            as="p"
            className="so-close"
          >
            <span style={{
              display: 'block',
              fontFamily: "'Universal Sans', sans-serif",
              fontSize: 'clamp(22px, 2.6vw, 44px)',
              lineHeight: 1.4,
              letterSpacing: '-0.015em',
              color: TEXT,
              maxWidth: '30ch',
            }}>
              If we cannot make the queue smaller, we would rather you stopped paying us.{' '}
              <span style={{ color: ACCENT }}>That is the whole pitch.</span>
            </span>
          </MaskReveal>
        </div>
      </Band>

      <CTABand
        title={<>Tell us the symptom. <span className="serif">Take the number.</span></>}
        lead="Thirty minutes on a call and you leave with a staffing plan and a price, whether or not you ever sign anything."
      />
    </PageShell>
  )
}
