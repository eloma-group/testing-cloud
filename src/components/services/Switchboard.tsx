import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE, MaskReveal } from '../../lib/anim'
import { SERVICES } from '../../data/services'

const ACCENT = '#998EFF'
const LIVE   = '#2EBAC6'

/* ──────────────────────────────────────────────────────────────
   The Switchboard - the services section.

   The oldest object in this industry: a panel of jacks, and a cord
   patched from the line you want to the desk that answers it. Choose
   a jack and the cord is drawn across to the card, as a real cable
   with a plug on each end.

   The cord is an SVG path animated on pathLength, and it carries
   vector-effect: non-scaling-stroke so the cable keeps an even weight
   even though the viewBox is stretched to whatever width the column
   happens to be.

   Portable by design: the ink band shell and section head are baked
   in here, not borrowed from the page kit, so the section drops onto
   the home page (outside PageShell) without losing its dark ground.
   ────────────────────────────────────────────────────────────── */

export function Switchboard() {
  const reduce = useReducedMotion() ?? false
  const [live, setLive] = useState(0)
  const s = SERVICES[live]

  /* where the cord leaves the panel: the centre of the live jack, as a
     percentage down the board */
  const y = ((live + 0.5) / SERVICES.length) * 100
  const cord = `M0,${y} C34,${y} 58,50 100,50`

  return (
    <section className="sw-band" aria-label="Services">
      <style>{`
        /* ── the ink band shell (portable: no dependency on the page kit) ── */
        .sw-band {
          position: relative; isolation: isolate;
          background-color: #14111F;
          background-image: linear-gradient(180deg, #211C33 0%, #191527 46%, #14111F 100%);
          color: #FFFFFF;
          padding: clamp(56px, 7vw, 124px) clamp(24px, 4vw, 64px);
        }
        /* grain over the ink, so the gradient never bands into visible steps */
        .sw-band::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.32'/%3E%3C/svg%3E");
          background-size: 140px 140px; opacity: 0.04; mix-blend-mode: overlay;
        }
        /* the seam where ink meets paper reads as an edge, not a colour change */
        .sw-band::after {
          content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px; z-index: 5;
          pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14) 50%, transparent);
        }
        .sw-in { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }
        @media (min-width: 1920px) { .sw-in { max-width: 1900px; } }
        @media (min-width: 2560px) { .sw-in { max-width: 2400px; } }

        /* ── section head ── */
        .sw-head {
          display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: clamp(18px, 3vw, 60px); align-items: end;
          padding-bottom: clamp(20px, 2.4vw, 32px); margin-bottom: clamp(28px, 3.4vw, 52px);
          border-bottom: 1px solid #2F2A42;
        }
        .sw-eyebrow {
          display: inline-flex; align-items: center; gap: 10px; margin: 0 0 clamp(14px, 1.8vw, 22px);
          font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px; color: #C3BCFF;
        }
        .sw-eyebrow i { flex: none; width: 7px; height: 7px; border-radius: 50%; background: ${ACCENT}; }
        .sw-head h2 {
          font-family: 'Universal Sans', sans-serif; letter-spacing: -0.03em;
          font-size: clamp(30px, 3.6vw, 62px); line-height: 1.04; margin: 0; color: #FFFFFF; max-width: 16ch;
        }
        .sw-head h2 .serif {
          font-family: 'Universal Sans', sans-serif;
          letter-spacing: -0.02em;
        }
        .sw-head-lead {
          margin: 0; font-family: 'Universal Sans', sans-serif; font-size: clamp(14px, 1.05vw, 17px);
          line-height: 1.8; color: #BDBDBD; max-width: 46ch;
        }
        @media (max-width: 1024px) { .sw-head { grid-template-columns: minmax(0, 1fr); align-items: start; } }

        .sw {
          display: grid;
          grid-template-columns: clamp(190px, 20vw, 280px) clamp(56px, 7vw, 130px) minmax(0, 1fr);
          align-items: stretch;
        }

        /* ── the panel of jacks ── */
        .sw-panel {
          display: grid; border-radius: 18px; overflow: hidden;
          background: #191527;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px #2F2A42;
        }
        .sw-jack {
          position: relative; isolation: isolate; cursor: pointer; border: 0; background: none;
          display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center;
          gap: clamp(10px, 1.2vw, 15px); text-align: left;
          padding: clamp(12px, 1.5vw, 18px) clamp(13px, 1.5vw, 19px);
          border-bottom: 1px solid #201C30;
        }
        .sw-jack:last-child { border-bottom: 0; }
        .sw-jack::before {
          content: ''; position: absolute; inset: 0; z-index: -1;
          background: linear-gradient(90deg, rgba(153,142,255,0.18), rgba(153,142,255,0.02));
          transform: scaleX(0); transform-origin: left; will-change: transform;
          transition: transform .7s cubic-bezier(.16,1,.3,1);
        }
        .sw-jack:hover::before, .sw-jack.on::before, .sw-jack:focus-visible::before { transform: scaleX(1); }

        /* the socket itself */
        .sw-socket {
          position: relative; flex: none; width: 26px; height: 26px; border-radius: 50%;
          background: radial-gradient(circle at 40% 34%, #29243B, #0F0D19 70%);
          box-shadow: inset 0 0 0 1px #363048, inset 0 2px 4px rgba(0,0,0,0.9);
          will-change: transform; transition: transform .5s cubic-bezier(.16,1,.3,1);
        }
        /* the hole */
        .sw-socket::before {
          content: ''; position: absolute; inset: 8px; border-radius: 50%;
          background: #0A0812; box-shadow: inset 0 1px 2px rgba(0,0,0,1);
          transition: background .45s ease, box-shadow .45s ease;
        }
        .sw-jack.on .sw-socket { transform: scale(1.06); }
        .sw-jack.on .sw-socket::before {
          background: radial-gradient(circle at 38% 32%, #D6D0FF, ${ACCENT} 60%, #4A3DBF);
          box-shadow: 0 0 14px rgba(153,142,255,0.9);
        }

        .sw-jack em {
          display: block; font-style: normal; font-family: 'Universal Sans', sans-serif; font-weight: 800;
          font-variant-numeric: tabular-nums; font-size: 10px; letter-spacing: 1.6px;
          color: #5E5B6B; margin-bottom: 3px; transition: color .45s ease;
        }
        .sw-jack.on em { color: #C3BCFF; }
        .sw-jack b {
          display: block; font-family: 'Universal Sans', sans-serif; font-weight: 700;
          font-size: clamp(12px, 1vw, 15px); line-height: 1.25; color: #BDBDBD;
          transition: color .45s ease;
        }
        .sw-jack.on b, .sw-jack:hover b { color: #fff; }

        /* ── the cord ── */
        .sw-cord { position: relative; }
        .sw-cord svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
        .sw-cord path {
          fill: none; stroke: ${ACCENT}; stroke-width: 2.5; stroke-linecap: round;
          vector-effect: non-scaling-stroke;
          filter: drop-shadow(0 3px 8px rgba(153,142,255,0.5));
        }

        /* ── the desk that answers ── */
        .sw-card {
          position: relative; overflow: hidden; border-radius: 18px;
          background: #211C33;
          background-image: linear-gradient(168deg, rgba(255,255,255,0.05), rgba(255,255,255,0));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px #2F2A42,
                      0 40px 80px -44px rgba(0,0,0,0.8);
        }
        .sw-card-top {
          position: relative; aspect-ratio: 21 / 9; overflow: hidden;
        }
        .sw-card-top img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sw-card-top::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, rgba(20,17,31,0.35) 0%, transparent 40%, rgba(33,28,51,0.95) 100%);
        }
        .sw-plug {
          position: absolute; z-index: 2; top: clamp(14px, 1.6vw, 20px); left: clamp(14px, 1.6vw, 20px);
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 14px; border-radius: 100px;
          background: rgba(20,17,31,0.72); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16);
          font-family: 'Universal Sans', sans-serif; font-weight: 800; text-transform: uppercase;
          font-size: 10px; letter-spacing: 1.8px; color: #fff;
        }
        .sw-plug i {
          position: relative; width: 7px; height: 7px; border-radius: 50%; background: ${LIVE};
        }
        .sw-plug i::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%; border: 1px solid ${LIVE};
          animation: sw-ping 2.4s cubic-bezier(.16,1,.3,1) infinite; will-change: transform, opacity;
        }
        @keyframes sw-ping {
          0%        { transform: scale(1);   opacity: .6; }
          70%, 100% { transform: scale(2.9); opacity: 0; }
        }

        .sw-card-body { padding: clamp(22px, 2.6vw, 40px); }
        .sw-card-body h3 {
          margin: 0 0 clamp(12px, 1.4vw, 16px);
          font-family: 'Universal Sans', sans-serif; letter-spacing: -0.03em;
          font-size: clamp(24px, 2.5vw, 46px); line-height: 1.06; color: #fff;
        }
        .sw-card-body .line {
          margin: 0 0 clamp(16px, 1.8vw, 24px);
          font-family: 'Universal Sans', sans-serif;
          font-size: clamp(16px, 1.4vw, 25px); line-height: 1.45; color: ${ACCENT};
        }
        .sw-card-body .body {
          margin: 0 0 clamp(18px, 2vw, 26px); padding-bottom: clamp(18px, 2vw, 26px);
          border-bottom: 1px solid #2F2A42;
          font-family: 'Universal Sans', sans-serif; font-size: clamp(13px, 1.02vw, 16px); line-height: 1.85;
          color: #BDBDBD;
        }
        .sw-does { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: clamp(18px, 2vw, 26px); }
        .sw-does span {
          display: inline-flex; align-items: center;
          padding: 7px 12px; border-radius: 100px;
          background: rgba(153,142,255,0.13); box-shadow: inset 0 0 0 1px rgba(153,142,255,0.3);
          font-family: 'Universal Sans', sans-serif; font-weight: 600; font-size: clamp(11px, 0.88vw, 13px);
          color: #C3BCFF;
        }
        .sw-figs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(12px, 1.4vw, 22px); }
        .sw-figs b {
          display: block; font-family: 'Universal Sans', sans-serif; font-weight: 800;
          font-size: clamp(22px, 2.1vw, 38px); line-height: 1; letter-spacing: -0.02em; color: #fff;
          font-variant-numeric: tabular-nums;
        }
        .sw-figs span {
          display: block; margin-top: 7px; font-family: 'Universal Sans', sans-serif; font-weight: 600;
          font-size: clamp(11px, 0.86vw, 13px); line-height: 1.5; color: #858387;
        }

        /* ── responsive: no room for a cable, so the panel becomes a rail ── */
        @media (max-width: 900px) {
          .sw { grid-template-columns: minmax(0, 1fr); gap: clamp(20px, 3vw, 28px); }
          .sw-cord { display: none; }
          .sw-panel { grid-auto-flow: column; grid-auto-columns: minmax(150px, 1fr);
                      overflow-x: auto; overscroll-behavior-x: contain; }
          .sw-jack { border-bottom: 0; border-right: 1px solid #201C30; }
        }
        @media (max-width: 560px) {
          .sw-figs { grid-template-columns: minmax(0, 1fr); gap: 14px; }
          .sw-card-top { aspect-ratio: 16 / 9; }
        }
        @media (prefers-reduced-motion: reduce) { .sw-plug i::after { animation: none; } }
      `}</style>

      <div className="sw-in">
        <div className="sw-head">
          <div>
            <p className="sw-eyebrow"><i aria-hidden /> The switchboard</p>
            <MaskReveal as="h2">Patch a line, <span className="serif">reach the desk.</span></MaskReveal>
          </div>
          <p className="sw-head-lead">
            The oldest object in this business, and still the clearest way to show it. Choose a line
            on the panel and the cord is patched across to the desk that answers it.
          </p>
        </div>

        <div className="sw">
          <div className="sw-panel" role="tablist" aria-label="Services">
            {SERVICES.map((item, i) => (
              <button
                key={item.id}
                /* the anchor the footer links to: /services#inbound-voice */
                id={item.id}
                type="button"
                role="tab"
                aria-selected={live === i}
                aria-controls="sw-card"
                className={`sw-jack${live === i ? ' on' : ''}`}
                onClick={() => setLive(i)}
              >
                <span className="sw-socket" aria-hidden />
                <span>
                  <em>{item.n}</em>
                  <b>{item.name}</b>
                </span>
              </button>
            ))}
          </div>

          {/* the cord, drawn from the live jack across to the desk */}
          <div className="sw-cord" aria-hidden>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
              <motion.path
                key={s.id}
                d={cord}
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </svg>
          </div>

          <motion.article
            className="sw-card"
            id="sw-card"
            role="tabpanel"
            key={s.id}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
          >
            <div className="sw-card-top">
              <img src={s.img} alt={s.alt} width={1200} height={515} decoding="async" />
              <span className="sw-plug"><i aria-hidden /> Patched - {s.channel}</span>
            </div>

            <div className="sw-card-body">
              <h3>{s.name}</h3>
              <p className="line">{s.line}</p>
              <p className="body">{s.body}</p>
              <div className="sw-does">
                {s.does.map((d) => <span key={d}>{d}</span>)}
              </div>
              <div className="sw-figs">
                {s.figs.map(([v, l]) => (
                  <div key={l}>
                    <b>{v}</b>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
