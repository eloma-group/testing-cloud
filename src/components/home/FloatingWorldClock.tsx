import { useEffect, useMemo, useState } from 'react'

/* ──────────────────────────────────────────────────────────────
   The glass strip of desks around the world, ticking in real
   time. Small fixed-size surface, so the backdrop blur here is
   cheap; the float is a transform-only keyframe.
   ────────────────────────────────────────────────────────────── */

const DESKS = [
  { city: 'Sydney',   zone: 'Australia/Sydney'  },
  { city: 'London',   zone: 'Europe/London'     },
  { city: 'New York', zone: 'America/New_York'  },
]

type Reading = { day: string; time: string }

function read(fmts: Intl.DateTimeFormat[]): Reading[] {
  const now = new Date()
  return fmts.map((f) => {
    const parts = f.formatToParts(now)
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
    return { day: get('weekday').toUpperCase(), time: `${get('hour')}:${get('minute')}` }
  })
}

export function FloatingWorldClock({ className = '' }: { className?: string }) {
  const fmts = useMemo(
    () =>
      DESKS.map(
        (d) =>
          new Intl.DateTimeFormat('en-AU', {
            timeZone: d.zone,
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
      ),
    [],
  )

  const [readings, setReadings] = useState<Reading[]>(() => read(fmts))

  useEffect(() => {
    const id = setInterval(() => setReadings(read(fmts)), 1000)
    return () => clearInterval(id)
  }, [fmts])

  return (
    <div className={`wc ${className}`} role="group" aria-label="Live time at our desks around the world">
      <style>{`
        .wc {
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(10px, 1.2vw, 18px);
          padding: clamp(26px, 3vw, 46px) clamp(16px, 2vw, 28px);
          border-radius: clamp(16px, 1.6vw, 22px);
          background: linear-gradient(160deg, rgba(255,255,255,0.5), rgba(255,255,255,0.26) 60%, rgba(255,255,255,0.38));
          backdrop-filter: blur(22px) saturate(1.4);
          -webkit-backdrop-filter: blur(22px) saturate(1.4);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.75),
            inset 0 0 0 1px rgba(255,255,255,0.45),
            0 30px 60px -28px rgba(40,32,100,0.4);
          will-change: transform;
          animation: wc-float 7s ease-in-out infinite alternate;
        }
        .wc-col { position: relative; text-align: center; }
        .wc-col + .wc-col::before {
          content: ''; position: absolute; left: calc(-1 * clamp(5px, 0.6vw, 9px) - 1px);
          top: 12%; bottom: 12%; width: 1px;
          background: linear-gradient(180deg, transparent, rgba(153,142,255,0.4), transparent);
        }
        .wc-col em {
          display: block; font-style: normal;
          font-family: 'Eloma Sans', sans-serif; font-weight: 600;
          font-size: clamp(9px, 0.7vw, 11px); letter-spacing: 2px;
          color: #16141F; margin-bottom: 4px;
        }
        .wc-col b {
          display: block; font-family: 'Eloma Sans', sans-serif; font-weight: 600;
          font-variant-numeric: tabular-nums; letter-spacing: 0.01em;
          font-size: clamp(20px, 2vw, 34px); line-height: 1; color: #6A5BE8;
        }
        .wc-col span {
          display: block; margin-top: 5px;
          font-family: 'Eloma Sans', sans-serif; font-weight: 600;
          font-size: clamp(9px, 0.72vw, 11px); letter-spacing: 1.6px; text-transform: uppercase;
          color: #16141F;
        }
        @keyframes wc-float {
          from { transform: translateY(-5px); }
          to   { transform: translateY(5px); }
        }
        @media (prefers-reduced-motion: reduce) { .wc { animation: none; } }
      `}</style>

      {DESKS.map((d, i) => (
        <div className="wc-col" key={d.city}>
          <em>{readings[i]?.day}</em>
          <b>{readings[i]?.time}</b>
          <span>{d.city}</span>
        </div>
      ))}
    </div>
  )
}
