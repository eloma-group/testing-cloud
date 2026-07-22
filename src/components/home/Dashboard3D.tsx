import { Suspense, useEffect, useRef } from 'react'
import type { ComponentProps } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Text, Line, Float, ContactShadows, Bounds } from '@react-three/drei'
import * as THREE from 'three'

/* ──────────────────────────────────────────────────────────────
   Dashboard3D - a genuine 3D operations board built in three.js.
   Every element is real geometry with depth, bevels, lighting and a
   soft grounded shadow: the analytics panel stands up as a screen,
   the agent bars are extruded prisms on a platform, the service mix
   is a real torus ring, the KPI cards are thick slabs lying on the
   floor. Bars grow and figures count up on power-on.

   Rendered on a transparent canvas so it drops onto the cream
   section, lazy-loaded from AboutUs so three.js stays out of the
   initial bundle. Reduced-motion renders the scene at rest.
   ────────────────────────────────────────────────────────────── */

const FONT = '/fonts/ElomaSans-Premium.otf'

const C = {
  face:  '#2A2542',
  wall:  '#1B1730',
  deep:  '#4A3DBF',
  mid:   '#7D6EF0',
  lilac: '#A99BFF',
  light: '#CFC7FF',
  text:  '#F1EFFB',
  mut:   '#9A92CC',
}

const TOP = 0.5 // top surface of the floor slabs

/* ── a rounded 3D card / slab ── */
function Slab({ cx, cz, w, d, h = 0.5, color = C.face }: {
  cx: number; cz: number; w: number; d: number; h?: number; color?: string
}) {
  return (
    <RoundedBox args={[w, h, d]} radius={0.12} smoothness={4} position={[cx, h / 2, cz]} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.62} metalness={0.08} />
    </RoundedBox>
  )
}

/* Eloma ships one weight, and troika can't synthesise bold, so a thin
   same-colour outline thickens the strokes into a pseudo-bold. */
function Flat(props: ComponentProps<typeof Text>) {
  return (
    <Text rotation={[-Math.PI / 2, 0, 0]} font={FONT} letterSpacing={-0.02}
      outlineWidth="3%" outlineColor={(props.color as string) ?? C.text} {...props} />
  )
}
/* text standing on a front face */
function Front(props: ComponentProps<typeof Text>) {
  return (
    <Text font={FONT} letterSpacing={-0.02}
      outlineWidth="3%" outlineColor={(props.color as string) ?? C.text} {...props} />
  )
}

/* number that counts up on power-on, lying flat */
function CountFlat({ to, run, fmt, size, color = C.text, pos, anchorX = 'left' as const }: {
  to: number; run: boolean; fmt: (n: number) => string; size: number; color?: string
  pos: [number, number, number]; anchorX?: 'left' | 'center' | 'right'
}) {
  const ref = useRef<any>(null)
  const t = useRef(0)
  const done = useRef(false)
  useEffect(() => { done.current = false; t.current = 0 }, [run])
  useFrame((_, dt) => {
    if (!ref.current || done.current) return
    if (!run) { ref.current.text = fmt(to); return }
    t.current += dt
    const p = Math.min(t.current / 1.15, 1)
    const e = 1 - Math.pow(1 - p, 3)
    ref.current.text = fmt(to * e)
    if (p >= 1) done.current = true
  })
  return (
    <Flat ref={ref} position={pos} fontSize={size} color={color} anchorX={anchorX} anchorY="top">
      {fmt(run ? 0 : to)}
    </Flat>
  )
}

/* an extruded prism bar that grows from the platform */
function Bar({ x, z, height, color, delay, run }: {
  x: number; z: number; height: number; color: string; delay: number; run: boolean
}) {
  const g = useRef<THREE.Group>(null)
  const t = useRef(0)
  useEffect(() => { t.current = 0; if (g.current) g.current.scale.y = run ? 0.001 : 1 }, [run])
  useFrame((_, dt) => {
    if (!g.current || !run) return
    t.current += dt
    const p = Math.min(Math.max((t.current - delay) / 0.7, 0), 1)
    const e = 1 - Math.pow(1 - p, 3)
    g.current.scale.y = Math.max(e, 0.001)
  })
  return (
    <group ref={g} position={[x, TOP, z]}>
      <RoundedBox args={[0.52, height, 0.52]} radius={0.05} smoothness={3} position={[0, height / 2, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={0.42} metalness={0.12} />
      </RoundedBox>
    </group>
  )
}

/* one coloured wedge of the service-mix ring */
function DonutSeg({ start, frac, color, R = 1.05, tube = 0.34 }: {
  start: number; frac: number; color: string; R?: number; tube?: number
}) {
  return (
    <mesh rotation={[0, 0, start * Math.PI * 2]} castShadow receiveShadow>
      <torusGeometry args={[R, tube, 18, 60, frac * Math.PI * 2]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.12} />
    </mesh>
  )
}

/* the FCR progress ring */
function Ring({ cx, cz, pct }: { cx: number; cz: number; pct: number }) {
  return (
    <group position={[cx, TOP + 0.02, cz]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.66, 0.1, 16, 60]} />
        <meshStandardMaterial color="#3A3556" roughness={0.7} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.66, 0.11, 16, 60, pct * Math.PI * 2]} />
        <meshStandardMaterial color={C.lilac} roughness={0.4} metalness={0.15} />
      </mesh>
    </group>
  )
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN']
const LINE_A = [30, 62, 57, 98, 80, 112]
const LINE_B = [12, 37, 65, 58, 84, 100]
const BARS = [
  { h: 1.3, c: C.light }, { h: 1.9, c: C.lilac }, { h: 2.5, c: C.deep },
  { h: 3.1, c: C.mid }, { h: 3.7, c: C.light },
]

/* map the six data points onto the standing panel's front face */
const AX = MONTHS.map((_, i) => -5.3 + i * 0.8)
const AZ = -3.53
const ay = (v: number) => 0.78 + (v / 120) * 2.3
const line = (s: number[]) => s.map((v, i) => [AX[i], ay(v), AZ] as [number, number, number])

function Scene({ run }: { run: boolean }) {
  return (
    <group rotation={[0, -0.2, 0]}>
      {/* ══ standing analytics panel ══ */}
      <group>
        <RoundedBox args={[5.4, 4.0, 0.5]} radius={0.16} smoothness={4}
          position={[-3.1, 2.0, -3.8]} castShadow receiveShadow>
          <meshStandardMaterial color={C.face} roughness={0.62} metalness={0.08} />
        </RoundedBox>
        <Front position={[-5.55, 3.5, -3.53]} fontSize={0.32} color={C.text} anchorX="left">
          Call Analytics Overview
        </Front>
        {/* six-months pill */}
        <RoundedBox args={[1.3, 0.5, 0.14]} radius={0.1} position={[-1.35, 3.5, -3.5]}>
          <meshStandardMaterial color={C.wall} roughness={0.6} />
        </RoundedBox>
        <Front position={[-1.35, 3.5, -3.4]} fontSize={0.2} color={C.mut} anchorX="center" anchorY="middle">
          6 Months
        </Front>
        <Line points={line(LINE_A)} color={C.mid} lineWidth={3.4} />
        <Line points={line(LINE_B)} color={C.light} lineWidth={3.4} />
        {LINE_A.map((v, i) => (
          <mesh key={i} position={[AX[i], ay(v), AZ + 0.02]}>
            <circleGeometry args={[0.07, 20]} />
            <meshBasicMaterial color={C.light} />
          </mesh>
        ))}
        {MONTHS.map((m, i) => (
          <Front key={m} position={[AX[i], 0.5, -3.52]} fontSize={0.16} color={C.mut} anchorX="center">{m}</Front>
        ))}
      </group>

      {/* ══ agent-performance platform + prism bars ══ */}
      <group>
        <Slab cx={3.6} cz={-3.0} w={4.4} d={2.8} />
        <Flat position={[3.6, TOP + 0.01, -1.95]} fontSize={0.22} color={C.mut} anchorX="center" anchorY="top">
          Agent Performance
        </Flat>
        {BARS.map((b, i) => (
          <Bar key={i} x={2.0 + i * 0.8} z={-3.1} height={b.h} color={b.c} delay={0.15 + i * 0.09} run={run} />
        ))}
        {/* up-85% callout */}
        <Float speed={run ? 1.4 : 0} rotationIntensity={0} floatIntensity={run ? 0.22 : 0}>
          <group position={[5.35, 4.7, -2.7]}>
            <RoundedBox args={[1.25, 0.62, 0.16]} radius={0.14}>
              <meshStandardMaterial color={C.light} roughness={0.4} />
            </RoundedBox>
            <mesh position={[-0.42, 0, 0.1]} rotation={[0, 0, 0]}>
              <coneGeometry args={[0.09, 0.18, 3]} />
              <meshStandardMaterial color={C.deep} />
            </mesh>
            <Front position={[0.06, 0, 0.1]} fontSize={0.26} color={C.deep} anchorX="center" anchorY="middle">
              85%
            </Front>
          </group>
        </Float>
      </group>

      {/* ══ service-mix donut ══ */}
      <group>
        <Slab cx={-0.3} cz={0.6} w={3.2} d={3.2} />
        <group position={[-0.3, TOP + 0.02, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <DonutSeg start={0} frac={0.4} color={C.light} />
          <DonutSeg start={0.4} frac={0.35} color={C.deep} />
          <DonutSeg start={0.75} frac={0.25} color={C.mid} />
        </group>
      </group>

      {/* ══ total revenue ══ */}
      <group>
        <Slab cx={-4.4} cz={1.9} w={3.0} d={2.4} />
        <Flat position={[-5.7, TOP + 0.01, 0.9]} fontSize={0.2} color={C.mut} anchorX="left" anchorY="top">Total Revenue</Flat>
        <Flat position={[-5.7, TOP + 0.01, 1.55]} fontSize={0.52} color={C.text} anchorX="left" anchorY="top">$24.8K</Flat>
        <Flat position={[-5.7, TOP + 0.01, 2.35]} fontSize={0.16} color={C.lilac} anchorX="left" anchorY="top">UP 12.5% vs last 6 months</Flat>
      </group>

      {/* ══ customer satisfaction ══ */}
      <group>
        <Slab cx={4.3} cz={1.5} w={3.4} d={2.2} />
        <Flat position={[2.75, TOP + 0.01, 0.6]} fontSize={0.19} color={C.mut} anchorX="left" anchorY="top">Customer Satisfaction</Flat>
        <Flat position={[2.75, TOP + 0.01, 1.2]} fontSize={0.5} color={C.text} anchorX="left" anchorY="top">4.6 / 5</Flat>
        <Flat position={[2.75, TOP + 0.01, 2.0]} fontSize={0.16} color={C.lilac} anchorX="left" anchorY="top">UP 8.3% vs last 6 months</Flat>
      </group>

      {/* ══ total agents ══ */}
      <group>
        <Slab cx={-3.9} cz={4.6} w={2.9} d={2.2} />
        <Flat position={[-5.1, TOP + 0.01, 3.7]} fontSize={0.19} color={C.mut} anchorX="left" anchorY="top">Total Agents</Flat>
        <CountFlat to={8450} run={run} fmt={(n) => Math.round(n).toLocaleString()} size={0.48}
          pos={[-5.1, TOP + 0.01, 4.3]} />
        <Flat position={[-5.1, TOP + 0.01, 5.05]} fontSize={0.16} color={C.lilac} anchorX="left" anchorY="top">UP 18.3% capacity</Flat>
      </group>

      {/* ══ first-call resolution ══ */}
      <group>
        <Slab cx={-0.5} cz={4.9} w={2.6} d={2.4} />
        <Flat position={[-1.7, TOP + 0.01, 3.85]} fontSize={0.18} color={C.mut} anchorX="left" anchorY="top">First-Call Resolution</Flat>
        <Ring cx={-0.5} cz={5.1} pct={0.78} />
        <Flat position={[-0.5, TOP + 0.03, 5.1]} fontSize={0.34} color={C.text} anchorX="center" anchorY="middle">78%</Flat>
      </group>

      {/* ══ average handle time ══ */}
      <group>
        <Slab cx={3.4} cz={4.4} w={3.3} d={2.0} />
        <Flat position={[1.95, TOP + 0.01, 3.65]} fontSize={0.19} color={C.mut} anchorX="left" anchorY="top">Avg Handle Time</Flat>
        <Flat position={[1.95, TOP + 0.01, 4.25]} fontSize={0.48} color={C.text} anchorX="left" anchorY="top">04:32</Flat>
        <Flat position={[1.95, TOP + 0.01, 4.95]} fontSize={0.16} color="#E4A08C" anchorX="left" anchorY="top">DOWN 6.2% faster</Flat>
      </group>

    </group>
  )
}

export function Dashboard3D({ built, reduce }: { built: boolean; reduce: boolean }) {
  const run = built && !reduce
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        frameloop={reduce ? 'demand' : 'always'}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [2.6, 13, 18], fov: 26 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[7, 13, 9]} intensity={1.5} castShadow
          shadow-mapSize={[1024, 1024]} shadow-camera-far={40}
          shadow-camera-left={-12} shadow-camera-right={12}
          shadow-camera-top={12} shadow-camera-bottom={-12}
        />
        <directionalLight position={[-9, 5, 3]} intensity={0.45} color={C.lilac} />
        <ContactShadows position={[0, 0, 0]} opacity={0.4} blur={2.6} far={12} scale={22} color="#160f2e" />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.12}>
            <Scene run={run} />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  )
}
