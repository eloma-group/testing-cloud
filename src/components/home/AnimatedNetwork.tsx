const ACCENT = '#998EFF'

/* ──────────────────────────────────────────────────────────────
   A quiet constellation flowing across the hero: a triangulated
   ribbon of thin lines and glowing nodes that starts at the left
   edge, dips in a slow wave under the copy, then climbs to tuck
   behind the photo stage - the same drawing language as the
   switchboard cords. Pure CSS keyframes on transform/opacity so
   it composites for free, and pointer-events: none throughout.
   ────────────────────────────────────────────────────────────── */

type Node = { x: number; y: number; r: number; dur: number; delay: number; pulse?: boolean }

const NODES: Node[] = [
  { x: 8,   y: 168, r: 5,   dur: 7.2, delay: 0.0, pulse: true  },
  { x: 46,  y: 92,  r: 3.5, dur: 8.4, delay: 0.9 },
  { x: 84,  y: 206, r: 4.5, dur: 6.6, delay: 1.6 },
  { x: 124, y: 58,  r: 6,   dur: 7.8, delay: 0.4, pulse: true  },
  { x: 162, y: 174, r: 3.5, dur: 8.8, delay: 2.2 },
  { x: 200, y: 112, r: 5,   dur: 7.0, delay: 1.2 },
  { x: 238, y: 232, r: 3.5, dur: 8.0, delay: 2.8, pulse: true  },
  { x: 280, y: 70,  r: 4.5, dur: 6.8, delay: 0.6 },
  { x: 320, y: 158, r: 5.5, dur: 7.6, delay: 1.9 },
  { x: 358, y: 36,  r: 3.5, dur: 8.6, delay: 0.2, pulse: true  },
  { x: 400, y: 192, r: 4,   dur: 7.4, delay: 2.5 },
  { x: 442, y: 94,  r: 5,   dur: 7.1, delay: 1.4 },
  { x: 486, y: 226, r: 3.5, dur: 8.2, delay: 0.8 },
  { x: 530, y: 126, r: 5.5, dur: 6.9, delay: 2.0, pulse: true  },
  { x: 568, y: 42,  r: 3.5, dur: 7.7, delay: 1.1 },
  { x: 612, y: 188, r: 4.5, dur: 8.5, delay: 0.3 },
  { x: 654, y: 82,  r: 3.5, dur: 7.3, delay: 2.6, pulse: true  },
  { x: 700, y: 218, r: 4,   dur: 8.1, delay: 1.7 },
  { x: 744, y: 118, r: 4.5, dur: 7.5, delay: 0.5 },
  { x: 790, y: 50,  r: 3.5, dur: 8.3, delay: 2.1, pulse: true  },
  { x: 836, y: 170, r: 4.5, dur: 7.0, delay: 1.0 },
  { x: 874, y: 98,  r: 4,   dur: 8.1, delay: 1.5 },
]

/* every node links to the next one (the zigzag spine) and the one
   after that (the triangulation), same as the reference ribbon */
const EDGES: [number, number][] = NODES.flatMap<[number, number]>((_, i) => {
  const out: [number, number][] = []
  if (i + 1 < NODES.length) out.push([i, i + 1])
  if (i + 2 < NODES.length) out.push([i, i + 2])
  return out
})

export function AnimatedNetwork() {
  return (
    <div className="an" aria-hidden>
      <style>{`
        .an {
          width: 100%;
          pointer-events: none; user-select: none;
        }
        .an svg { display: block; width: 100%; height: auto; overflow: visible; }
        .an line {
          stroke: ${ACCENT}; stroke-width: 1;
          opacity: 0.22;
          animation: an-line 5.6s ease-in-out infinite;
        }
        .an .an-node { will-change: transform; animation: an-float var(--t) ease-in-out var(--d) infinite alternate; }
        .an .an-core { fill: ${ACCENT}; }
        .an .an-halo { fill: ${ACCENT}; opacity: 0.16; }
        .an .an-ring {
          fill: none; stroke: ${ACCENT}; stroke-width: 1; opacity: 0;
          transform-box: fill-box; transform-origin: center;
          animation: an-ping 4.2s cubic-bezier(.16,1,.3,1) var(--d) infinite;
        }
        @keyframes an-float {
          from { transform: translateY(-4px); }
          to   { transform: translateY(4px); }
        }
        @keyframes an-line {
          0%, 100% { opacity: 0.14; }
          50%      { opacity: 0.34; }
        }
        @keyframes an-ping {
          0%       { transform: scale(1);   opacity: 0.5; }
          70%, 100%{ transform: scale(2.6); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .an line, .an .an-node, .an .an-ring { animation: none; }
          .an .an-ring { opacity: 0; }
        }
      `}</style>

      <svg viewBox="0 0 880 260" focusable="false" role="presentation">
        {EDGES.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={NODES[a].x} y1={NODES[a].y}
            x2={NODES[b].x} y2={NODES[b].y}
            style={{ animationDelay: `${((a + b) % 5) * 0.7}s` }}
          />
        ))}
        {NODES.map((n, i) => (
          <g
            key={i}
            className="an-node"
            style={{ '--t': `${n.dur}s`, '--d': `${n.delay}s` } as React.CSSProperties}
          >
            <circle className="an-halo" cx={n.x} cy={n.y} r={n.r * 2.4} />
            <circle className="an-core" cx={n.x} cy={n.y} r={n.r} />
            {n.pulse && <circle className="an-ring" cx={n.x} cy={n.y} r={n.r * 1.8} />}
          </g>
        ))}
      </svg>
    </div>
  )
}
