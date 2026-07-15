import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageShell, InnerHero, Band, SectionHead, CTABand } from '../components/page/PageKit'
import { BrandPromise } from '../components/home/BrandPromise'
import { staggerParent, fadeUp, VIEWPORT } from '../lib/anim'

const TEXT       = '#16141F'
const ACCENT     = '#998EFF'
const ACCENT_INK = '#6A5BE8'   /* text-safe on white (5.3:1) - eyebrows, small labels */
const MUTED      = '#5E5B6B'
const LIVE       = '#2EBAC6'

/* The six services themselves live in src/data/services.ts and are drawn
   by the Switchboard: a panel of jacks, and a cord patched across to the
   desk that answers the line you choose. */

/* how a team actually gets on the floor */
const STEPS: [string, string, string][] = [
  ['01', 'We read your product', 'Two days inside your helpdesk, reading real tickets. We arrive at the call already knowing what breaks.'],
  ['02', 'You interview the team', 'You meet every agent before they are hired. If you would not put them on your own payroll, we do not put them on ours.'],
  ['03', 'We train inside your stack', 'Your CRM, your macros, your tone. No middleware, no second system, nothing for you to learn.'],
  ['04', 'You watch the first week', 'Every call recorded, every ticket reviewable. We publish our own misses before you find them.'],
]

export function ServicesPage() {
  const reduce = useReducedMotion() ?? false

  return (
    <PageShell>
      <style>{`
        /* ══════════ the hero figure: a live floor ticker ══════════ */
        .sv-fig {
          position: relative; width: 100%; max-width: 620px; justify-self: end;
          border-radius: 20px; overflow: hidden;
          background: linear-gradient(168deg, #FFFFFF 0%, #FFFFFF 55%, #FAF9FE 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 1px 3px rgba(26,22,44,0.06), 0 40px 78px -44px rgba(26,22,44,0.34);
        }
        .sv-fig-top {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: clamp(16px, 1.8vw, 22px) clamp(18px, 2vw, 26px);
          border-bottom: 1px solid rgba(22,20,31,0.1);
        }
        .sv-fig-top b {
          display: inline-flex; align-items: center; gap: 9px;
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(12px, 0.95vw, 14px); color: ${TEXT};
        }
        .sv-fig-top b i {
          position: relative; width: 7px; height: 7px; border-radius: 50%; background: ${LIVE};
        }
        .sv-fig-top b i::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%; border: 1px solid ${LIVE};
          animation: sv-ping 2.4s cubic-bezier(.16,1,.3,1) infinite; will-change: transform, opacity;
        }
        @keyframes sv-ping {
          0%        { transform: scale(1);   opacity: .6; }
          70%, 100% { transform: scale(2.8); opacity: 0; }
        }
        .sv-fig-top span {
          font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.6px; color: ${MUTED};
        }
        .sv-fig-rows { display: grid; }
        .sv-fig-row {
          display: grid; grid-template-columns: 40px minmax(0, 1fr) auto; align-items: center;
          gap: clamp(10px, 1.2vw, 16px);
          padding: clamp(13px, 1.5vw, 18px) clamp(18px, 2vw, 26px);
          border-bottom: 1px solid rgba(22,20,31,0.08);
        }
        .sv-fig-row:last-child { border-bottom: 0; }
        .sv-fig-row em {
          font-style: normal; font-family: 'Inter', sans-serif; font-weight: 800;
          font-variant-numeric: tabular-nums; font-size: 11px; letter-spacing: 1.4px;
          color: rgba(22,20,31,0.32);
        }
        .sv-fig-row b {
          font-family: 'Inter', sans-serif; font-weight: 600; font-size: clamp(13px, 1.05vw, 16px); color: ${TEXT};
        }
        .sv-fig-row time {
          font-family: Georgia, 'Times New Roman', serif; font-size: clamp(15px, 1.3vw, 21px);
          color: ${ACCENT}; font-variant-numeric: tabular-nums;
        }
        .sv-fig-bar {
          height: 4px; margin: 0 clamp(18px, 2vw, 26px) clamp(18px, 2vw, 26px);
          border-radius: 100px; background: rgba(22,20,31,0.08); overflow: hidden;
        }
        .sv-fig-bar i {
          display: block; height: 100%; width: 100%; border-radius: 100px;
          background: linear-gradient(90deg, #C3BCFF, ${ACCENT});
          transform-origin: left; will-change: transform;
          animation: sv-drain 5.5s cubic-bezier(.4,0,.6,1) infinite;
        }
        @keyframes sv-drain {
          0%   { transform: scaleX(0.12); }
          55%  { transform: scaleX(0.94); }
          100% { transform: scaleX(0.12); }
        }

        /* ══════════ how a team gets on the floor ══════════
           Set on paper, not ink: the switchboard above is already ink,
           and three dark bands in a row would turn the whole lower page black.
           The dark now lands once, on the switchboard, and reads as an accent. */
        .sv-steps { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(16px, 1.8vw, 28px); }
        .sv-step {
          position: relative; padding-top: clamp(20px, 2.2vw, 30px);
          border-top: 2px solid rgba(22,20,31,0.16);
        }
        .sv-step::before {
          content: ''; position: absolute; top: -2px; left: 0; width: 34%; height: 2px;
          background: linear-gradient(90deg, #C3BCFF, ${ACCENT});
        }
        .sv-step em {
          display: block; margin-bottom: clamp(12px, 1.4vw, 18px); font-style: normal;
          font-family: 'Inter', sans-serif; font-weight: 800; font-variant-numeric: tabular-nums;
          font-size: 12px; letter-spacing: 2px; color: ${ACCENT_INK};
        }
        .sv-step h3 {
          margin: 0 0 12px; font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.025em;
          font-size: clamp(18px, 1.6vw, 28px); line-height: 1.16; color: ${TEXT};
        }
        .sv-step p {
          margin: 0; font-family: 'Inter', sans-serif; font-size: clamp(13px, 1vw, 16px);
          line-height: 1.8; color: ${MUTED};
        }

        .sv-out {
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
          gap: 20px; margin-top: clamp(36px, 4vw, 60px); padding-top: clamp(26px, 3vw, 40px);
          border-top: 1px solid rgba(22,20,31,0.16);
        }
        .sv-out p {
          margin: 0; max-width: 52ch; font-family: 'Inter', sans-serif;
          font-size: clamp(14px, 1.05vw, 17px); line-height: 1.8; color: ${MUTED};
        }
        .sv-out p b { color: ${TEXT}; font-weight: 700; }

        @media (max-width: 1100px) { .sv-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 1024px) { .sv-fig { justify-self: center; } }
        @media (max-width: 620px) { .sv-steps { grid-template-columns: minmax(0, 1fr); } }
        @media (prefers-reduced-motion: reduce) {
          .sv-fig-bar i, .sv-fig-top b i::after { animation: none; }
        }
      `}</style>

      <InnerHero
        crumb="Services"
        eyebrow="What we run"
        title={<>Six services. <span className="serif">One floor.</span></>}
        lead={
          <>
            Voice, chat, email, helpdesk, outbound and the back office admin nobody wants to own.
            Take one of them or take the lot - <b>it is the same team, trained once, on your systems</b>,
            and you are never handed to a second vendor halfway through.
          </>
        }
        stats={[
          ['0:18', 'Average answer, voice'],
          ['6', 'Languages from day one'],
          ['10 days', 'To a pod on the floor'],
        ]}
        figure={
          <div className="sv-fig" aria-hidden>
            <div className="sv-fig-top">
              <b><i /> The floor, right now</b>
              <span>Live</span>
            </div>
            <div className="sv-fig-rows">
              {[
                ['01', 'Inbound voice', '0:18'],
                ['02', 'Live chat', '0:41'],
                ['03', 'Helpdesk', '0:52'],
                ['04', 'Night desk', '0:23'],
              ].map(([n, k, t]) => (
                <div className="sv-fig-row" key={n}>
                  <em>{n}</em>
                  <b>{k}</b>
                  <time>{t}</time>
                </div>
              ))}
            </div>
            <div className="sv-fig-bar"><i /></div>
          </div>
        }
      />

      {/* ══════════ our promise ══════════ */}
      <BrandPromise />

      {/* ══════════ onboarding ══════════ */}
      <Band tone="paper" label="How a team gets on the floor">
        <SectionHead
          eyebrow="Onboarding"
          title={<>Ten days from signature <span className="serif">to first call.</span></>}
          lead="Not a discovery phase. Four steps, in this order, and you hold a veto at every one of them."
        />

        <motion.div
          className="sv-steps"
          variants={staggerParent(0.08)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {STEPS.map(([n, t, d]) => (
            <motion.article className="sv-step" key={n} variants={fadeUp}>
              <em>{n}</em>
              <h3>{t}</h3>
              <p>{d}</p>
            </motion.article>
          ))}
        </motion.div>

        <div className="sv-out">
          <p>
            <b>Not sure which of the six you need?</b> Solutions starts from the problem instead of
            the service, and ends with a number.
          </p>
          <Link to="/solutions" className="pg-btn">
            <span>Start from the problem</span>
            <ArrowRight size={17} strokeWidth={2.4} aria-hidden />
          </Link>
        </div>
      </Band>

      <CTABand
        tone="wash"
        title={<>Six services, <span className="serif">one conversation.</span></>}
        lead="Tell us which queue hurts most. We will tell you what it takes to hold it, and what it costs, on the same call."
      />
    </PageShell>
  )
}
