import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { PageShell, InnerHero, Band, SectionHead, CTABand } from '../components/page/PageKit'
import {
  MaskReveal, staggerParent, VIEWPORT,
  slideLeft, slideRight, flipIn, popUp, tiltIn, zoomIn,
} from '../lib/anim'

const TEXT       = '#16141F'
const ACCENT     = '#998EFF'
const ACCENT_INK = '#6A5BE8'
const MUTED      = '#5E5B6B'

/* ──────────────────────────────────────────────────────────────
   About: the story, told as a printed feature.

   A stacked photo figure in the hero, a manifesto set in the big
   serif, a timeline that runs down a rule, a ledger of principles
   where each row is a claim and its cost, and the floor in numbers.
   ────────────────────────────────────────────────────────────── */

/* the years, and what actually changed in each of them */
const YEARS: { y: string; t: string; d: string }[] = [
  {
    y: '2016',
    t: 'One desk, one client, one phone',
    d: 'RJ took over the overnight queue for a Melbourne retailer whose founder had been answering it himself since 2014. Twelve hours a night, one person, no software worth the name.',
  },
  {
    y: '2018',
    t: 'The floor stops being a room',
    d: 'Manila comes online, then Bengaluru. Not to make the hour cheaper, but to make the hour exist. A customer in Sydney at 3am is a customer in Manila at midday.',
  },
  {
    y: '2020',
    t: 'Everything breaks at once',
    d: 'Volumes triple in a fortnight. We keep every client and lose no agent, because the training was never a script - it was a product they already understood.',
  },
  {
    y: '2023',
    t: 'We stop selling seats',
    d: 'The pricing changes to what the work is worth, not what a chair costs. Pay per resolution arrives, and with it the first clients who leave us when they no longer need us.',
  },
  {
    y: '2026',
    t: 'Four cities, one payroll',
    d: 'Sydney, Manila, Bengaluru and London. Two hundred and forty agents, all on our books, none subcontracted. The same overnight queue from 2016 is still with us.',
  },
]

/* what we will and will not do, and what each one costs us */
const LEDGER: { n: string; claim: string; cost: string }[] = [
  {
    n: '01',
    claim: 'Every agent is on our payroll',
    cost: 'It costs us the margin a subcontractor would have made. It buys you a person who can be trained, corrected and kept.',
  },
  {
    n: '02',
    claim: 'You interview before we hire',
    cost: 'It costs us three weeks of onboarding we could have billed. It buys you a team you actually chose.',
  },
  {
    n: '03',
    claim: 'We work inside your stack',
    cost: 'It costs us the licence fee we could have resold. It buys you data that never leaves your systems.',
  },
  {
    n: '04',
    claim: 'You can leave on fourteen days',
    cost: 'It costs us the lock-in every competitor writes into page nine. It buys us a reason to be worth keeping.',
  },
]

/* the floor, counted */
const FLOOR: [string, string][] = [
  ['240', 'Agents, all salaried'],
  ['4', 'Cities on one payroll'],
  ['31', 'Brands on the floor'],
  ['0', 'Queues subcontracted'],
]

export function AboutPage() {
  const reduce = useReducedMotion() ?? false

  return (
    <PageShell>
      <style>{`
        /* ══════════ the hero figure: three photos, stacked ══════════ */
        .ab-fig {
          position: relative; width: 100%; aspect-ratio: 1.06 / 1;
          max-width: 640px; justify-self: end;
        }
        .ab-fig img {
          position: absolute; width: 100%; height: 100%;
          object-fit: cover; border-radius: 16px; display: block;
        }
        .ab-fig figure { position: absolute; margin: 0; will-change: transform; }
        .ab-fig .a {
          inset: 0 22% 16% 0; z-index: 1;
          box-shadow: inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 40px 80px -44px rgba(26,22,44,0.5);
          animation: ab-drift 11s cubic-bezier(.4,0,.6,1) infinite;
        }
        .ab-fig .b {
          inset: 30% 0 0 40%; z-index: 3;
          box-shadow: inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 44px 84px -40px rgba(26,22,44,0.55);
          animation: ab-drift 11s cubic-bezier(.4,0,.6,1) infinite reverse;
        }
        .ab-fig .c {
          inset: 4% 4% 62% 62%; z-index: 2;
          box-shadow: inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 26px 52px -30px rgba(26,22,44,0.45);
        }
        @keyframes ab-drift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -12px, 0); }
        }
        /* the seal, turning over the join */
        .ab-seal {
          position: absolute; z-index: 4; left: 2%; bottom: 4%;
          width: clamp(92px, 10vw, 132px); aspect-ratio: 1;
          display: grid; place-items: center;
        }
        .ab-seal-disc {
          position: absolute; inset: 19%; border-radius: 50%;
          background: radial-gradient(circle at 34% 30%, #B3AAFF, ${ACCENT} 55%, #4A3DBF 100%);
          box-shadow: 0 22px 40px -16px rgba(74,61,191,0.9), inset 0 -3px 8px rgba(0,0,0,0.2);
        }
        .ab-seal-disc::after {
          content: ''; position: absolute; inset: 15%; border-radius: 50%;
          border: 1.5px dashed rgba(255,255,255,0.45);
        }
        .ab-seal-y {
          position: relative; z-index: 2; font-family: 'Eloma Sans', sans-serif;
          font-size: clamp(15px, 1.5vw, 21px); color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.25);
        }
        .ab-seal-ring {
          position: absolute; inset: 0; width: 100%; height: 100%;
          animation: ab-spin 24s linear infinite; will-change: transform;
        }
        @keyframes ab-spin { to { transform: rotate(360deg); } }
        .ab-seal-ring text {
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; font-size: 8px; letter-spacing: 2.5px;
          text-transform: uppercase; fill: ${TEXT}; opacity: 0.55;
        }

        /* ══════════ the manifesto ══════════ */
        .ab-say {
          display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 0.42fr);
          gap: clamp(28px, 4vw, 76px); align-items: start;
        }
        .ab-say-q {
          font-family: 'Eloma Sans', sans-serif; font-weight: 400;
          font-size: clamp(26px, 3.1vw, 54px); line-height: 1.34; letter-spacing: -0.015em;
          color: ${TEXT}; margin: 0;
        }
        .ab-say-q b { font-weight: 400; color: ${ACCENT}; }
        .ab-say-note {
          border-left: 2px solid rgba(153,142,255,0.4); padding-left: clamp(16px, 1.8vw, 26px);
          display: grid; gap: 16px;
        }
        .ab-say-note p {
          margin: 0; font-family: 'Eloma Sans', sans-serif; font-size: clamp(14px, 1.05vw, 17px);
          line-height: 1.85; color: ${MUTED};
        }
        .ab-say-sig {
          display: flex; align-items: center; gap: 12px; margin-top: 8px;
          padding-top: 18px; border-top: 1px solid rgba(22,20,31,0.14);
        }
        .ab-say-sig span {
          display: grid; place-items: center; flex: none; width: 42px; height: 42px; border-radius: 50%;
          background: linear-gradient(168deg, #C3BCFF 0%, ${ACCENT} 48%, #4A3DBF 100%);
          color: #fff; font-family: 'Eloma Sans', sans-serif; font-size: 16px;
          box-shadow: 0 10px 22px -12px rgba(74,61,191,0.8);
        }
        .ab-say-sig b {
          display: block; font-family: 'Eloma Sans', sans-serif; font-weight: 700;
          font-size: 15px; color: ${TEXT};
        }
        .ab-say-sig em {
          display: block; font-style: normal; font-family: 'Eloma Sans', sans-serif;
          font-size: 13px; color: ${MUTED}; margin-top: 2px;
        }

        /* ══════════ the timeline ══════════ */
        .ab-line { display: grid; gap: 0; }
        .ab-yr {
          position: relative; isolation: isolate;
          display: grid; grid-template-columns: clamp(70px, 8vw, 132px) minmax(0, 1fr);
          gap: clamp(18px, 3vw, 54px); align-items: start;
          padding: clamp(26px, 3vw, 44px) clamp(10px, 1.2vw, 18px);
          border-bottom: 1px solid rgba(22,20,31,0.14);
        }
        .ab-yr:first-child { border-top: 1px solid rgba(22,20,31,0.14); }
        .ab-yr::before {
          content: ''; position: absolute; inset: 0; z-index: -1; border-radius: 10px;
          background: linear-gradient(90deg, rgba(153,142,255,0.1), rgba(153,142,255,0.01));
          transform: scaleX(0); transform-origin: left; will-change: transform;
          transition: transform .7s cubic-bezier(.16,1,.3,1);
        }
        .ab-yr:hover::before { transform: scaleX(1); }
        .ab-yr-y {
          font-family: 'Eloma Sans', sans-serif; font-weight: 400;
          font-size: clamp(24px, 2.4vw, 42px); line-height: 1; letter-spacing: -0.02em;
          color: rgba(22,20,31,0.32); font-variant-numeric: tabular-nums;
          transition: color .5s ease;
        }
        .ab-yr:hover .ab-yr-y { color: ${ACCENT}; }
        .ab-yr h3 {
          margin: 0 0 10px; font-family: 'Eloma Sans', sans-serif; 
          letter-spacing: -0.025em; font-size: clamp(19px, 1.75vw, 30px); line-height: 1.2;
          color: ${TEXT}; will-change: transform;
          transition: transform .7s cubic-bezier(.16,1,.3,1);
        }
        .ab-yr:hover h3 { transform: translateX(clamp(4px, 0.6vw, 10px)); }
        .ab-yr p {
          margin: 0; font-family: 'Eloma Sans', sans-serif; font-size: clamp(14px, 1.05vw, 17px);
          line-height: 1.8; color: ${MUTED}; max-width: 72ch;
        }

        /* ══════════ the ledger ══════════ */
        .ab-led { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(16px, 1.8vw, 26px); }
        .ab-led-card {
          position: relative; isolation: isolate; overflow: hidden;
          border-radius: 18px; padding: clamp(24px, 2.6vw, 40px);
          background: linear-gradient(168deg, #FFFFFF 0%, #FFFFFF 55%, #FAF9FE 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 1px 2px rgba(26,22,44,0.05), 0 8px 20px -12px rgba(26,22,44,0.16);
          will-change: transform;
          transition: transform .6s cubic-bezier(.16,1,.3,1), box-shadow .6s ease;
        }
        .ab-led-card:hover {
          transform: translateY(-5px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(26,22,44,0.07),
                      0 1px 3px rgba(26,22,44,0.06), 0 24px 48px -24px rgba(26,22,44,0.28);
        }
        /* the accent lip along the top, drawn on hover */
        .ab-led-card::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #C3BCFF, ${ACCENT} 45%, rgba(153,142,255,0.3));
          transform: scaleX(0); transform-origin: left; will-change: transform;
          transition: transform .8s cubic-bezier(.16,1,.3,1);
        }
        .ab-led-card:hover::after { transform: scaleX(1); }
        .ab-led-n {
          display: block; margin-bottom: clamp(14px, 1.6vw, 20px);
          font-family: 'Eloma Sans', sans-serif; font-weight: 800; font-variant-numeric: tabular-nums;
          font-size: 12px; letter-spacing: 2px; color: ${ACCENT_INK};
        }
        .ab-led-card h3 {
          margin: 0 0 clamp(12px, 1.4vw, 18px); font-family: 'Eloma Sans', sans-serif; 
          letter-spacing: -0.028em; font-size: clamp(20px, 1.9vw, 34px); line-height: 1.14; color: ${TEXT};
        }
        .ab-led-card p {
          margin: 0; padding-top: clamp(12px, 1.4vw, 18px);
          border-top: 1px dashed rgba(22,20,31,0.2);
          font-family: 'Eloma Sans', sans-serif; font-size: clamp(13px, 1vw, 16px); line-height: 1.8; color: ${MUTED};
        }

        /* ══════════ the floor, counted ══════════ */
        .ab-floor {
          display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1px; background: #2F2A42; border-radius: 18px; overflow: hidden;
          box-shadow: inset 0 0 0 1px #2F2A42;
        }
        .ab-floor-cell {
          background-color: #211C33;
          background-image: linear-gradient(168deg, rgba(255,255,255,0.05), rgba(255,255,255,0));
          padding: clamp(24px, 2.8vw, 44px);
        }
        .ab-floor-cell b {
          display: block; font-family: 'Eloma Sans', sans-serif; font-weight: 800;
          font-size: clamp(38px, 4.4vw, 78px); line-height: 1; letter-spacing: -0.03em; color: #fff;
          font-variant-numeric: tabular-nums;
        }
        .ab-floor-cell span {
          display: block; margin-top: clamp(10px, 1.2vw, 16px);
          font-family: 'Eloma Sans', sans-serif; font-weight: 700; text-transform: uppercase;
          font-size: clamp(10px, 0.78vw, 12px); letter-spacing: 1.8px; color: #858387;
        }

        /* the two doors out of this page */
        .ab-doors { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(16px, 1.8vw, 26px); margin-top: clamp(28px, 3.2vw, 48px); }
        /* the motion wrapper each door enters in must not shorten the door */
        .ab-doors > div { display: grid; }
        .ab-door {
          position: relative; isolation: isolate; overflow: hidden; text-decoration: none;
          display: flex; align-items: center; justify-content: space-between; gap: 18px;
          border-radius: 16px; padding: clamp(22px, 2.4vw, 34px);
          background-color: #211C33; box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px #2F2A42;
          will-change: transform; transition: transform .6s cubic-bezier(.16,1,.3,1);
        }
        .ab-door::before {
          content: ''; position: absolute; inset: 0; z-index: -1;
          background: linear-gradient(120deg, rgba(153,142,255,0.24), rgba(153,142,255,0.02));
          opacity: 0; transition: opacity .55s ease;
        }
        .ab-door:hover { transform: translateY(-4px); }
        .ab-door:hover::before { opacity: 1; }
        .ab-door b {
          font-family: 'Eloma Sans', sans-serif; font-weight: 600; letter-spacing: -0.02em;
          font-size: clamp(17px, 1.5vw, 26px); color: #fff;
        }
        .ab-door em {
          display: block; margin-top: 6px; font-style: normal; font-family: 'Eloma Sans', sans-serif;
          font-size: clamp(12px, 0.95vw, 15px); color: #BDBDBD;
        }
        .ab-door svg { flex: none; color: ${ACCENT}; transition: transform .5s cubic-bezier(.16,1,.3,1); }
        .ab-door:hover svg { transform: translate(4px, -4px); }

        /* ══════════ responsive ══════════ */
        @media (max-width: 1024px) {
          .ab-fig { justify-self: center; max-width: 560px; }
          .ab-say { grid-template-columns: minmax(0, 1fr); }
          .ab-floor { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 768px) {
          .ab-led, .ab-doors { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 560px) {
          .ab-floor { grid-template-columns: minmax(0, 1fr); }
          .ab-yr { grid-template-columns: minmax(0, 1fr); gap: 12px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ab-fig figure, .ab-seal-ring { animation: none; }
        }
      `}</style>

      <InnerHero
        crumb="About"
        eyebrow="About Nexa"
        title={<>We answer the calls <span className="serif">nobody else will.</span></>}
        lead={
          <>
            Nexa started as one person covering one overnight queue in Melbourne. Ten years on it is
            two hundred and forty agents across four cities, and <b>every one of them is on our payroll</b>.
            We have never subcontracted a customer, and we do not intend to start.
          </>
        }
        stats={[
          ['2016', 'The first overnight shift'],
          ['240', 'Agents, all salaried'],
          ['31', 'Brands on the floor today'],
        ]}
        figure={
          <div className="ab-fig">
            <figure className="a">
              <img
                src="/images/about-page/hero.jpg"
                alt="Support agent in a headset smiling at her desk while taking a call"
                width={640} height={604} decoding="async"
              />
            </figure>
            <figure className="c">
              <img
                src="/images/about-page/floor.jpg"
                alt="Three agents on headsets working side by side on the support floor"
                width={280} height={220} decoding="async"
              />
            </figure>
            <figure className="b">
              <img
                src="/images/about-page/desk.jpg"
                alt="Agent in a headset taking notes while working through a call"
                width={400} height={430} decoding="async"
              />
            </figure>

            <div className="ab-seal" aria-hidden>
              <svg className="ab-seal-ring" viewBox="0 0 120 120" focusable="false">
                <defs>
                  <path id="ab-seal-path" d="M60,60 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
                </defs>
                <text>
                  <textPath href="#ab-seal-path" startOffset="0">
                    ON OUR PAYROLL / SINCE 2016 / ON OUR PAYROLL /
                  </textPath>
                </text>
              </svg>
              <span className="ab-seal-disc" />
              <span className="ab-seal-y">10</span>
            </div>
          </div>
        }
      />

      {/* ══════════ what we actually believe ══════════ */}
      <Band tone="white" label="What we believe">
        <div className="ab-say">
          <MaskReveal as="p" className="ab-say-q">
            Most support is designed to end the conversation. <b>Ours is designed to end the reason
            for it.</b> That is the whole difference, and it is why we count resolutions instead of
            calls, and why we would rather lose a contract than keep a customer who no longer needs us.
          </MaskReveal>

          {/* the founder's note slides in from the right, against the
              quote that rose from the mask beside it */}
          <motion.div
            className="ab-say-note"
            variants={slideRight}
            initial={reduce ? false : 'hidden'}
            whileInView="show"
            viewport={VIEWPORT}
            transition={{ delay: 0.1 }}
            style={{ willChange: 'transform, opacity' }}
          >
            <p>
              I spent two years on the other side of this. I was the founder answering tickets at
              midnight, and every outsourcer I called wanted to sell me a chair with a person in it.
            </p>
            <p>
              Nobody wanted to talk about why the tickets existed. So we built the company I could
              not find - one that reads your product, learns your customer, and then quietly makes
              itself smaller.
            </p>
            <div className="ab-say-sig">
              <span aria-hidden>R</span>
              <div>
                <b>RJ</b>
                <em>Founder, Eloma Group</em>
              </div>
            </div>
          </motion.div>
        </div>
      </Band>

      {/* ══════════ the years ══════════ */}
      <Band tone="wash" label="Our story">
        <SectionHead
          eyebrow="The story"
          title={<>Ten years, told <span className="serif">honestly.</span></>}
          lead="No hockey stick, no pivot, no funding round to announce. Just the five moments that actually changed how the floor works."
        />

        <motion.div
          className="ab-line"
          variants={staggerParent(0.07)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {YEARS.map(({ y, t, d }) => (
            <motion.article className="ab-yr" key={y} variants={slideLeft}>
              <span className="ab-yr-y">{y}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Band>

      {/* ══════════ the ledger ══════════ */}
      <Band tone="white" label="What it costs us">
        <SectionHead
          eyebrow="The ledger"
          title={<>Four promises, and <span className="accent">what each one costs us.</span></>}
          lead="Anyone can list values. These are the four that show up on our own balance sheet, which is the only test of whether we mean them."
        />

        <motion.div
          className="ab-led"
          variants={staggerParent(0.08)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {LEDGER.map(({ n, claim, cost }) => (
            <motion.article className="ab-led-card" key={n} variants={flipIn}>
              <span className="ab-led-n">{n}</span>
              <h3>{claim}</h3>
              <p>{cost}</p>
            </motion.article>
          ))}
        </motion.div>
      </Band>

      {/* ══════════ the floor, counted ══════════ */}
      <Band tone="paper" label="The floor in numbers">
        <SectionHead
          eyebrow="The floor"
          title={<>The company, <span className="serif">counted.</span></>}
          lead="Four figures we would be embarrassed to get wrong, so we keep them where you can check them."
        />

        <motion.div
          className="ab-floor"
          variants={staggerParent(0.07)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          {FLOOR.map(([v, l]) => (
            <motion.div className="ab-floor-cell" key={l} variants={popUp}>
              <b>{v}</b>
              <span>{l}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="ab-doors"
          variants={staggerParent(0.1)}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEWPORT}
        >
          <motion.div variants={tiltIn}>
            <Link to="/team" className="ab-door">
              <span>
                <b>Meet the floor</b>
                <em>The people who would run your queue, by name</em>
              </span>
              <ArrowUpRight size={22} strokeWidth={2.2} aria-hidden />
            </Link>
          </motion.div>
          <motion.div variants={zoomIn}>
            <Link to="/careers" className="ab-door">
              <span>
                <b>Work here</b>
                <em>Nine roles open across four cities</em>
              </span>
              <ArrowUpRight size={22} strokeWidth={2.2} aria-hidden />
            </Link>
          </motion.div>
        </motion.div>
      </Band>

      <CTABand />
    </PageShell>
  )
}
