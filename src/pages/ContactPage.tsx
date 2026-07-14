import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Phone, Mail, MessageCircle, ArrowUpRight, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer'
import { MaskReveal, staggerParent, fadeUp, VIEWPORT } from '../lib/anim'

const TEXT   = '#2E3A34'
const ACCENT = '#D2704A'
const ACCENT_INK = '#A85434'   /* text-safe on white (5.3:1) - eyebrows, links, small labels */
const CREAM  = '#F6F2EA'
const PAPER  = '#FFFDFA'
const SAGE   = '#4E9E77'
const MUTED  = '#63706A'
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const GLOSS       = 'linear-gradient(168deg, #F09A72 0%, #D2704A 48%, #9C4324 100%)'
const ACCENT_RIM  = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(84,34,16,0.3)'
const ACCENT_CAST = '0 2px 4px rgba(156,67,36,0.34), 0 12px 24px -10px rgba(156,67,36,0.5), 0 30px 54px -26px rgba(156,67,36,0.62)'

const VOLUMES  = ['under 500', '500 to 2,000', '2,000 to 10,000', 'over 10,000']
const CHANNELS = ['voice', 'live chat', 'email', 'WhatsApp', 'back office']

/* the questions people ask before they will write to anyone */
const ANSWERS: [string, string][] = [
  [
    'Do we have to sign a long contract?',
    'No. Thirty days notice on a dedicated team, fourteen on a shared pod, and none at all on pay per resolution. If we are not earning the seat, you should not be paying for it.',
  ],
  [
    'How fast can a team actually be live?',
    'Ten days for a shared pod. Three weeks for a dedicated team, because you interview and approve every agent before they touch your queue.',
  ],
  [
    'Where do the agents sit?',
    'Sydney, Manila, Bengaluru and London. You choose the mix, and every agent is a Nexa employee on our payroll. We do not subcontract your customers to anyone.',
  ],
  [
    'What happens to our customer data?',
    'It stays in your systems. Agents work inside your CRM and helpdesk on named, audited logins from locked terminals, and every case note is timestamped and reviewable by you.',
  ],
  [
    'Are we too small for you?',
    'One seat is enough to start. Half the brands we run today arrived with a founder answering tickets at midnight and no process at all.',
  ],
]

const DIRECT: { Icon: LucideIcon; k: string; v: string; note: string; href: string }[] = [
  { Icon: Phone,         k: 'Call the floor', v: '1800 000 000',       note: 'A person, not a menu',      href: 'tel:1800000000' },
  { Icon: Mail,          k: 'Email us',       v: 'hello@nexa.support', note: 'Answered within 2 hours',   href: 'mailto:hello@nexa.support' },
  { Icon: MessageCircle, k: 'WhatsApp',       v: '+61 400 000 000',    note: 'Fastest for quick questions', href: 'https://wa.me/61400000000' },
]

const DESKS: { city: string; zone: string; offset: number }[] = [
  { city: 'Sydney',    zone: 'AEDT', offset: 11 },
  { city: 'Manila',    zone: 'PHT',  offset: 8 },
  { city: 'Bengaluru', zone: 'IST',  offset: 5.5 },
  { city: 'London',    zone: 'GMT',  offset: 0 },
]

/* the margin notes: no figures here, the hero already carries those */
const MARGIN: [string, string, string][] = [
  ['Who reads it', 'RJ', 'Founder of Eloma Group. Not a sales desk, not a bot, and not an intern.'],
  ['What to include', 'The messy bits', 'The hours that hurt, the tools you already run on, and what you have tried.'],
  ['Where it goes', 'Nowhere else', 'Your details stay with us. No sequences, no drip, no reselling to anyone.'],
]

/* an input that grows with whatever is typed into it */
function Blank({
  id, value, onChange, placeholder, bad, type = 'text',
}: {
  id: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  bad?: boolean
  type?: string
}) {
  return (
    <span className="cc-lt-blank">
      <input
        id={id}
        className={`cc-lt-fill${bad ? ' bad' : ''}`}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-invalid={!!bad}
        size={Math.max(placeholder.length, value.length + 1)}
        onChange={(e) => onChange(e.target.value)}
      />
    </span>
  )
}

/* a choice made inline, in the middle of the sentence */
function Pick({
  label, options, multi, value, onPick,
}: {
  label: string
  options: string[]
  multi?: boolean
  value: string[]
  onPick: (next: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    const away = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', away)
    return () => document.removeEventListener('mousedown', away)
  }, [open])

  const text = value.length ? value.join(', ') : label

  return (
    <span className="cc-lt-blank" ref={ref}>
      <button
        type="button"
        className={`cc-lt-pick${value.length ? '' : ' empty'}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
      >
        {text}
      </button>

      {open && (
        <span className="cc-lt-menu" role="listbox">
          {options.map((o) => {
            const on = value.includes(o)
            return (
              <button
                key={o}
                type="button"
                role="option"
                aria-selected={on}
                className={on ? 'on' : undefined}
                onClick={() => {
                  if (multi) onPick(on ? value.filter((x) => x !== o) : [...value, o])
                  else { onPick([o]); setOpen(false) }
                }}
              >
                <i aria-hidden />
                {o}
              </button>
            )
          })}
        </span>
      )}
    </span>
  )
}

export function ContactPage() {
  const reduce = useReducedMotion() ?? false

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [problem, setProblem] = useState('')
  const [ps, setPs] = useState('')
  const [email, setEmail] = useState('')
  const [volume, setVolume] = useState<string[]>([])
  const [channels, setChannels] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [sent, setSent] = useState(false)
  const [open, setOpen] = useState<number | null>(0)
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

  const today = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const seal = () => {
    const next: Record<string, boolean> = {}
    if (!name.trim()) next.name = true
    if (!company.trim()) next.company = true
    if (problem.trim().length < 6) next.problem = true
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = true
    setErrors(next)
    if (Object.keys(next).length) return
    setSent(true)
  }

  const rise = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: d, duration: 0.8, ease: EASE },
  })

  return (
    <div style={{ overflowX: 'clip' }}>
      <Header />

      <main className="cc-ct">
        <style>{`
          .cc-ct {
            position: relative; isolation: isolate; overflow: hidden;
            background: linear-gradient(180deg, #FFFFFF 0%, #FDFBF7 34%, ${CREAM} 76%, #EFE8DC 100%);
            color: ${TEXT};
            padding: calc(64px + clamp(40px, 6vw, 92px)) clamp(24px, 4vw, 64px) clamp(64px, 9vw, 130px);
          }
          /* one hue: a single terracotta bloom behind the envelope */
          .cc-ct::before {
            content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
            background: radial-gradient(46% 38% at 92% 0%, rgba(210,112,74,0.13), transparent 70%);
          }
          .cc-ct-inner { position: relative; z-index: 1; width: 100%; max-width: 1760px; margin: 0 auto; }
          @media (min-width: 1920px) { .cc-ct-inner { max-width: 1900px; } }
          @media (min-width: 2560px) { .cc-ct-inner { max-width: 2400px; } }

          /* ══════════ hero: the copy, and the envelope it goes in ══════════ */
          .cc-ct-hero {
            display: grid; grid-template-columns: minmax(0, 1.06fr) minmax(0, 0.94fr);
            gap: clamp(30px, 4vw, 80px); align-items: center;
            padding-bottom: clamp(40px, 5vw, 80px); margin-bottom: clamp(40px, 5vw, 76px);
            border-bottom: 1px solid rgba(26,33,29,0.16);
          }
          .cc-ct-eyebrow {
            display: inline-flex; align-items: center; gap: 10px;
            font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
            font-size: clamp(10px, 0.8vw, 13px); letter-spacing: 2.6px; color: ${ACCENT_INK};
            margin: 0 0 clamp(14px, 1.8vw, 24px);
          }
          .cc-ct-eyebrow i { width: 7px; height: 7px; border-radius: 50%; background: ${ACCENT}; }
          .cc-ct-title {
            font-family: 'Poppins', sans-serif; font-weight: 600;
            font-size: clamp(44px, 6.2vw, 104px); line-height: 0.98; letter-spacing: -0.035em;
            margin: 0 0 clamp(18px, 2.2vw, 30px); max-width: 11ch;
          }
          .cc-ct-title .accent { color: ${ACCENT}; }
          .cc-ct-lead {
            font-family: 'Inter', sans-serif; font-size: clamp(15px, 1.2vw, 19px); line-height: 1.78;
            color: ${MUTED}; margin: 0 0 clamp(22px, 2.6vw, 34px); max-width: 44ch;
          }
          .cc-ct-lead b { color: ${TEXT}; font-weight: 700; }
          .cc-ct-live {
            display: inline-flex; align-items: center; gap: 10px;
            padding: 9px 15px; border-radius: 100px; border: 0;
            background: linear-gradient(168deg, rgba(255,255,255,0.96), rgba(255,255,255,0.65));
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,1),
              inset 0 0 0 1px rgba(20,20,22,0.09),
              0 8px 18px -14px rgba(26,33,29,0.6);
            font-family: 'Inter', sans-serif; font-weight: 700; font-size: 12px; color: ${TEXT};
          }
          .cc-ct-live i { position: relative; width: 7px; height: 7px; border-radius: 50%; background: ${SAGE}; }
          .cc-ct-live i::after {
            content: ''; position: absolute; inset: 0; border-radius: 50%; border: 1px solid ${SAGE};
            animation: cc-ct-ping 2.4s cubic-bezier(.16,1,.3,1) infinite; will-change: transform, opacity;
          }
          @keyframes cc-ct-ping {
            0%        { transform: scale(1);   opacity: .6; }
            70%, 100% { transform: scale(2.8); opacity: 0; }
          }
          /* the three promises, on a hairline under the lead */
          .cc-ct-promises {
            display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: clamp(12px, 1.6vw, 26px);
            margin-top: clamp(26px, 3vw, 40px); padding-top: clamp(20px, 2.4vw, 30px);
            border-top: 1px solid rgba(26,33,29,0.14);
          }
          .cc-ct-promise b {
            display: block; font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
            font-size: clamp(24px, 2.2vw, 40px); line-height: 1; letter-spacing: -0.02em; color: ${TEXT};
          }
          .cc-ct-promise span {
            display: block; margin-top: 8px; font-family: 'Inter', sans-serif; font-weight: 600;
            font-size: clamp(12px, 0.92vw, 14px); line-height: 1.5; color: ${MUTED};
          }

          /* ── the envelope ── */
          .cc-ct-env {
            position: relative; aspect-ratio: 1.5 / 1; max-width: 640px; width: 100%; justify-self: end;
            will-change: transform;
            animation: cc-ct-float 9s cubic-bezier(.4,0,.6,1) infinite;
          }
          @keyframes cc-ct-float {
            0%, 100% { transform: translate3d(0, 0, 0) rotate(-1.6deg); }
            50%      { transform: translate3d(0, -12px, 0) rotate(-0.6deg); }
          }
          /* the letter peeking out from behind the envelope */
          .cc-ct-env-paper {
            position: absolute; left: 8%; right: 8%; top: -7%; height: 62%;
            border-radius: 8px 8px 0 0; background: linear-gradient(180deg, #FFFFFF, #F6F2E9);
            box-shadow: 0 -14px 34px -18px rgba(26,33,29,0.5), inset 0 0 0 1px rgba(26,33,29,0.08);
            padding: clamp(14px, 1.6vw, 22px) clamp(16px, 1.8vw, 26px);
            display: grid; align-content: start; gap: clamp(7px, 0.8vw, 10px);
            will-change: transform; transition: transform .8s cubic-bezier(.16,1,.3,1);
          }
          .cc-ct-env:hover .cc-ct-env-paper { transform: translateY(-14px); }
          .cc-ct-env-paper i {
            height: 7px; border-radius: 100px; background: rgba(26,33,29,0.1);
          }
          .cc-ct-env-paper i:nth-child(1) { width: 46%; background: rgba(210,112,74,0.4); }
          .cc-ct-env-paper i:nth-child(3) { width: 88%; }
          .cc-ct-env-paper i:nth-child(4) { width: 72%; }
          .cc-ct-env-paper i:nth-child(5) { width: 80%; }

          /* the envelope body */
          .cc-ct-env-body {
            position: absolute; inset: 22% 0 0 0; border-radius: 12px;
            background: linear-gradient(160deg, #FBF7EF 0%, #F1EBDF 60%, #E8E1D2 100%);
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,0.9),
              inset 0 0 0 1px rgba(26,33,29,0.09),
              0 1px 3px rgba(20,20,22,0.05),
              0 60px 100px -48px rgba(26,33,29,0.45);
            overflow: hidden;
          }
          /* the flap, folded down over the letter */
          .cc-ct-env-flap {
            position: absolute; inset: 0 0 auto 0; height: 62%;
            background: linear-gradient(175deg, #F6F1E6, #EAE3D4);
            clip-path: polygon(0 0, 100% 0, 50% 100%);
            box-shadow: inset 0 -1px 0 rgba(26,33,29,0.12);
          }
          /* the address, written on the envelope */
          .cc-ct-env-to {
            position: absolute; left: clamp(20px, 2.4vw, 36px); bottom: clamp(20px, 2.4vw, 34px);
            display: grid; gap: 5px;
          }
          .cc-ct-env-to small {
            font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
            font-size: 9.5px; letter-spacing: 1.8px; color: rgba(26,33,29,0.4);
          }
          .cc-ct-env-to b {
            font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
            font-size: clamp(17px, 1.5vw, 24px); line-height: 1.25; color: ${TEXT};
          }
          .cc-ct-env-to span {
            font-family: 'Inter', sans-serif; font-size: clamp(11px, 0.9vw, 13px); color: ${MUTED};
          }

          /* the postmark */
          .cc-ct-mark {
            position: absolute; right: clamp(18px, 2vw, 30px); bottom: clamp(18px, 2vw, 30px);
            width: clamp(74px, 8vw, 108px); aspect-ratio: 1; border-radius: 50%;
            display: grid; place-items: center; text-align: center; transform: rotate(-9deg);
            border: 2px dashed rgba(26,33,29,0.28); color: rgba(26,33,29,0.5);
          }
          .cc-ct-mark::before {
            content: ''; position: absolute; inset: 7px; border-radius: 50%;
            border: 1px solid rgba(26,33,29,0.18);
          }
          .cc-ct-mark b {
            font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
            font-size: clamp(8px, 0.72vw, 10px); letter-spacing: 1.2px; line-height: 1.5;
          }

          /* the wax seal, turning slowly on the flap */
          .cc-ct-seal {
            position: absolute; z-index: 3; top: 42%; left: 50%;
            width: clamp(94px, 10vw, 138px); aspect-ratio: 1; transform: translate(-50%, -50%);
            display: grid; place-items: center;
          }
          .cc-ct-seal-disc {
            position: absolute; inset: 18%; border-radius: 50%;
            background: radial-gradient(circle at 34% 30%, #E09873, ${ACCENT} 55%, #9C4324 100%);
            box-shadow: 0 20px 36px -16px rgba(156,67,36,0.9), inset 0 -3px 8px rgba(0,0,0,0.2);
          }
          .cc-ct-seal-disc::after {
            content: ''; position: absolute; inset: 14%; border-radius: 50%;
            border: 1.5px dashed rgba(255,255,255,0.45);
          }
          .cc-ct-seal-n {
            position: relative; z-index: 2;
            font-family: Georgia, 'Times New Roman', serif; font-size: clamp(20px, 2vw, 30px);
            color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.25);
          }
          .cc-ct-seal-ring {
            position: absolute; inset: 0; width: 100%; height: 100%;
            animation: cc-ct-spin 22s linear infinite; will-change: transform;
          }
          @keyframes cc-ct-spin { to { transform: rotate(360deg); } }
          .cc-ct-seal-ring text {
            font-family: 'Inter', sans-serif; font-weight: 800; font-size: 8.4px; letter-spacing: 2.6px;
            text-transform: uppercase; fill: ${TEXT}; opacity: 0.5;
          }

          /* the stamp in the corner */
          .cc-ct-stampsq {
            position: absolute; z-index: 2; right: clamp(18px, 2vw, 30px); top: clamp(16px, 1.8vw, 26px);
            width: clamp(56px, 6vw, 84px); aspect-ratio: 0.82; border-radius: 4px;
            background: linear-gradient(160deg, ${ACCENT}, #A85434);
            display: grid; place-items: center; transform: rotate(4deg);
            box-shadow: 0 14px 26px -12px rgba(156,67,36,0.9);
            color: rgba(255,255,255,0.92); text-align: center;
          }
          .cc-ct-stampsq::before {
            content: ''; position: absolute; inset: 4px; border: 1px dashed rgba(255,255,255,0.5); border-radius: 2px;
          }
          .cc-ct-stampsq b {
            font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
            font-size: clamp(8px, 0.68vw, 10px); letter-spacing: 1px; line-height: 1.45;
          }

          /* ══════════ the letter ══════════ */
          .cc-lt {
            display: grid; grid-template-columns: minmax(180px, 0.34fr) minmax(0, 1fr);
            gap: clamp(22px, 3vw, 56px); align-items: start;
          }
          .cc-lt-margin {
            position: sticky; top: 96px;
            border-right: 1px solid rgba(26,33,29,0.14); padding-right: clamp(16px, 2vw, 32px);
            display: grid; gap: clamp(20px, 2.4vw, 30px);
          }
          .cc-lt-margin dt {
            font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
            font-size: 10px; letter-spacing: 1.7px; color: ${ACCENT_INK}; margin-bottom: 8px;
          }
          .cc-lt-margin dd { margin: 0; }
          .cc-lt-margin b {
            display: block; font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
            font-size: clamp(20px, 1.7vw, 28px); line-height: 1.1; color: ${TEXT}; margin-bottom: 6px;
          }
          .cc-lt-margin span {
            font-family: 'Inter', sans-serif; font-size: clamp(12px, 0.92vw, 14px); line-height: 1.65; color: ${MUTED};
          }

          /* the sheet */
          .cc-lt-sheet {
            position: relative; border-radius: 16px;
            background: #FFFFFF;
            padding: clamp(28px, 3.6vw, 72px);
            min-height: clamp(520px, 46vw, 760px);
            display: flex; flex-direction: column;
            box-shadow:
              inset 0 0 0 1px rgba(20,20,22,0.07),
              0 1px 3px rgba(20,20,22,0.05),
              0 18px 40px -22px rgba(20,20,22,0.16),
              0 44px 78px -48px rgba(20,20,22,0.20);
          }
          /* the ruled paper the letter is written on */
          .cc-lt-sheet::after {
            content: ''; position: absolute; inset: 0; pointer-events: none; border-radius: 16px;
            background: repeating-linear-gradient(180deg, transparent 0 63px, rgba(26,33,29,0.032) 63px 64px);
            -webkit-mask-image: linear-gradient(180deg, transparent 8%, #000 24%, #000 82%, transparent 96%);
                    mask-image: linear-gradient(180deg, transparent 8%, #000 24%, #000 82%, transparent 96%);
          }
          .cc-lt-sheet > * { position: relative; z-index: 1; }
          .cc-lt-sheet::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
            border-radius: 16px 16px 0 0;
            background: linear-gradient(90deg, #F09A72, ${ACCENT} 40%, rgba(210,112,74,0.35));
            box-shadow: 0 1px 0 rgba(255,255,255,0.6);
          }
          .cc-lt-head {
            display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 10px;
            padding-bottom: clamp(18px, 2vw, 24px); margin-bottom: clamp(22px, 2.6vw, 34px);
            border-bottom: 1px solid rgba(26,33,29,0.12);
          }
          .cc-lt-head b {
            display: inline-flex; align-items: center; gap: 9px;
            font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.02em;
            font-size: clamp(15px, 1.2vw, 19px); color: ${TEXT};
          }
          .cc-lt-head b i { width: 8px; height: 8px; border-radius: 50%; background: ${ACCENT}; }
          .cc-lt-head span {
            font-family: 'Inter', sans-serif; font-size: clamp(11px, 0.85vw, 13px); color: ${MUTED};
            font-variant-numeric: tabular-nums;
          }

          /* the prose the form lives inside */
          .cc-lt-body {
            font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
            font-size: clamp(19px, 1.85vw, 32px); line-height: 2.05; letter-spacing: -0.005em;
            color: ${TEXT}; margin: 0;
          }
          .cc-lt-blank { position: relative; display: inline-block; }
          /* a blank and the punctuation after it must never be split across lines */
          .cc-lt-nb { white-space: nowrap; }
          .cc-lt-fill {
            font: inherit; color: ${ACCENT}; background: transparent; border: 0; outline: none;
            border-bottom: 2px solid rgba(210,112,74,0.38); padding: 0 5px 2px;
            min-width: 4ch; max-width: min(100%, 38ch);
            transition: border-color .35s ease, background .35s ease;
          }
          .cc-lt-fill::placeholder { color: rgba(26,33,29,0.3); font-style: italic; }
          .cc-lt-fill:focus { border-color: ${ACCENT}; background: rgba(210,112,74,0.07); }
          .cc-lt-fill.bad { border-color: #C05A4E; background: rgba(192,90,78,0.07); }
          .cc-lt-pick {
            font: inherit; color: ${ACCENT}; background: transparent; cursor: pointer; border: 0;
            border-bottom: 2px dashed rgba(210,112,74,0.5); padding: 0 5px 2px;
            transition: border-color .3s ease, background .3s ease;
          }
          .cc-lt-pick:hover { border-bottom-style: solid; background: rgba(210,112,74,0.07); }
          .cc-lt-pick.empty { color: rgba(26,33,29,0.3); font-style: italic; }
          .cc-lt-menu {
            position: absolute; z-index: 20; left: 0; top: calc(100% + 10px); min-width: 230px;
            background: ${PAPER}; border-radius: 12px; padding: 6px;
            box-shadow: 0 34px 64px -26px rgba(26,33,29,0.5), inset 0 0 0 1px rgba(26,33,29,0.1);
            display: grid; will-change: transform, opacity;
            animation: cc-lt-pop .3s cubic-bezier(.34,1.56,.64,1) both;
          }
          @keyframes cc-lt-pop {
            from { transform: translateY(-6px) scale(0.97); opacity: 0; }
            to   { transform: none; opacity: 1; }
          }
          .cc-lt-menu button {
            display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; cursor: pointer;
            border: 0; background: none; border-radius: 8px; padding: 12px;
            font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14.5px; color: ${TEXT};
            transition: background .3s ease, color .3s ease;
          }
          .cc-lt-menu button i {
            flex: none; width: 7px; height: 7px; border-radius: 50%;
            box-shadow: inset 0 0 0 1px rgba(26,33,29,0.25);
            transition: background .3s ease, box-shadow .3s ease;
          }
          .cc-lt-menu button:hover { background: rgba(210,112,74,0.1); color: ${ACCENT_INK}; }
          .cc-lt-menu button.on { color: ${ACCENT_INK}; }
          .cc-lt-menu button.on i { background: ${ACCENT}; box-shadow: none; }

          /* the postscript: room to say whatever the sentences did not cover */
          .cc-lt-ps {
            margin: clamp(28px, 3.2vw, 46px) 0 0; padding-top: clamp(22px, 2.4vw, 32px);
            border-top: 1px dashed rgba(26,33,29,0.2);
          }
          .cc-lt-ps-k {
            display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px; margin-bottom: 8px;
          }
          .cc-lt-ps-k b {
            font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
            font-size: clamp(19px, 1.7vw, 28px); color: ${TEXT};
          }
          .cc-lt-ps-k span {
            font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase;
            font-size: 10px; letter-spacing: 1.6px; color: ${ACCENT_INK};
            padding: 5px 10px; border-radius: 100px; background: rgba(210,112,74,0.12);
          }
          .cc-lt-ps-hint {
            margin: 0 0 clamp(14px, 1.6vw, 20px);
            font-family: 'Inter', sans-serif; font-size: clamp(13px, 1vw, 15px); line-height: 1.7;
            color: ${MUTED}; max-width: 62ch;
          }
          .cc-lt-ps-box { position: relative; }
          .cc-lt-ps-box textarea {
            width: 100%; min-height: clamp(120px, 12vw, 168px); resize: vertical;
            border: 0; outline: none; border-radius: 12px;
            background: rgba(210,112,74,0.05);
            box-shadow: inset 0 0 0 1px rgba(26,33,29,0.12);
            padding: clamp(14px, 1.5vw, 20px);
            font-family: Georgia, 'Times New Roman', serif;
            font-size: clamp(16px, 1.25vw, 20px); line-height: 1.75; color: ${TEXT};
            transition: box-shadow .4s ease, background .4s ease;
          }
          .cc-lt-ps-box textarea::placeholder { color: rgba(26,33,29,0.3); font-style: italic; }
          .cc-lt-ps-box textarea:focus {
            background: rgba(210,112,74,0.08);
            box-shadow: inset 0 0 0 2px ${ACCENT};
          }
          .cc-lt-ps-count {
            position: absolute; right: 14px; bottom: 12px; pointer-events: none;
            font-family: 'Inter', sans-serif; font-weight: 700; font-size: 11px;
            letter-spacing: 1px; color: rgba(26,33,29,0.32); font-variant-numeric: tabular-nums;
          }

          /* the signature line */
          .cc-lt-sign {
            display: flex; flex-wrap: wrap; align-items: center; gap: clamp(14px, 2vw, 24px);
            margin-top: auto; padding-top: clamp(24px, 2.8vw, 36px);
            border-top: 1px solid rgba(26,33,29,0.12);
          }
          .cc-lt-seal {
            position: relative; overflow: hidden; cursor: pointer; border: 0;
            display: inline-flex; align-items: center; gap: 10px;
            min-height: 58px; padding: 17px clamp(28px, 3vw, 40px); border-radius: 100px;
            background: ${GLOSS}; color: #fff;
            font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(14px, 1.1vw, 16px);
            box-shadow: ${ACCENT_RIM}, ${ACCENT_CAST};
            transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s ease; will-change: transform;
          }
          .cc-lt-seal > * { position: relative; z-index: 1; }
          .cc-lt-seal::after {
            content: ''; position: absolute; inset: 0; z-index: 0;
            background: linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%);
            transform: translateX(-110%); will-change: transform;
            transition: transform .9s cubic-bezier(.16,1,.3,1);
          }
          .cc-lt-seal:hover {
            transform: translateY(-3px);
            box-shadow: ${ACCENT_RIM}, 0 16px 28px -10px rgba(156,67,36,0.6), 0 38px 66px -26px rgba(156,67,36,0.78);
          }
          .cc-lt-seal:hover::after { transform: translateX(110%); }
          .cc-lt-seal svg { transition: transform .45s cubic-bezier(.16,1,.3,1); }
          .cc-lt-seal:hover svg { transform: translateX(4px); }
          .cc-lt-fine {
            flex: 1; min-width: 220px; margin: 0;
            font-family: 'Inter', sans-serif; font-size: clamp(12px, 0.9vw, 14px); line-height: 1.65; color: ${MUTED};
          }
          .cc-lt-fine b { color: #C05A4E; font-weight: 700; }

          /* the stamp that lands when the letter is sealed */
          .cc-lt-stamp {
            display: grid; place-items: center; width: 92px; height: 92px; border-radius: 50%;
            margin-bottom: clamp(22px, 2.6vw, 32px);
            background: radial-gradient(circle at 34% 28%, #EFAF8C, ${ACCENT} 52%, #9C4324 100%);
            color: #fff; text-align: center;
            font-family: 'Inter', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 1.4px;
            text-transform: uppercase; line-height: 1.3;
            box-shadow:
              inset 0 0 0 2px rgba(255,255,255,0.4),
              inset 0 2px 2px rgba(255,255,255,0.4),
              inset 0 -3px 8px rgba(0,0,0,0.2),
              0 26px 48px -22px rgba(156,67,36,1);
            animation: cc-lt-stamp .6s cubic-bezier(.34,1.56,.64,1) both; will-change: transform, opacity;
          }
          @keyframes cc-lt-stamp {
            0%   { transform: scale(2.3) rotate(-16deg); opacity: 0; }
            60%  { opacity: 1; }
            100% { transform: scale(1) rotate(-8deg); opacity: 1; }
          }
          .cc-lt-sent p {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: clamp(19px, 1.6vw, 27px); line-height: 1.7; color: ${TEXT};
            margin: 0 0 clamp(22px, 2.4vw, 30px); max-width: 44ch;
          }
          .cc-lt-sent p b { color: ${ACCENT}; font-weight: 400; }
          .cc-lt-again {
            cursor: pointer; border: 1px solid rgba(26,33,29,0.2); background: transparent; color: ${TEXT};
            min-height: 48px; padding: 13px 24px; border-radius: 100px;
            font-family: 'Inter', sans-serif; font-weight: 700; font-size: 14px;
            transition: background .35s ease, color .35s ease, border-color .35s ease;
          }
          .cc-lt-again:hover { background: ${TEXT}; color: ${CREAM}; border-color: ${TEXT}; }

          /* ══════════ or take a slot ══════════ */
          .cc-ct-band { margin-top: clamp(56px, 7vw, 110px); }
          .cc-ct-band-head {
            display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between;
            gap: 14px; padding-bottom: clamp(18px, 2vw, 26px); margin-bottom: clamp(20px, 2.4vw, 32px);
            border-bottom: 1px solid rgba(26,33,29,0.16);
          }
          .cc-ct-band-head h2 {
            font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -0.03em;
            font-size: clamp(24px, 2.6vw, 44px); line-height: 1.1; margin: 0; color: ${TEXT};
          }
          .cc-ct-band-head h2 .accent { color: ${ACCENT}; }
          .cc-ct-band-head p {
            margin: 0; font-family: 'Inter', sans-serif; font-size: clamp(13px, 1vw, 16px);
            line-height: 1.7; color: ${MUTED}; max-width: 40ch;
          }

          /* ── straight answers: an index that opens ── */
          .cc-ct-qa { border-top: 1px solid rgba(26,33,29,0.14); }
          .cc-ct-q {
            position: relative; width: 100%; text-align: left; cursor: pointer; border: 0;
            background: none; color: inherit; display: grid;
            grid-template-columns: clamp(40px, 4vw, 68px) minmax(0, 1fr) auto;
            gap: clamp(14px, 2vw, 32px); align-items: center; isolation: isolate;
            padding: clamp(18px, 2.1vw, 30px) clamp(10px, 1.2vw, 20px);
            border-bottom: 1px solid rgba(26,33,29,0.14);
          }
          .cc-ct-q::before {
            content: ''; position: absolute; inset: 0; z-index: -1; border-radius: 8px;
            background: linear-gradient(90deg, rgba(210,112,74,0.12), rgba(210,112,74,0.01));
            transform: scaleX(0); transform-origin: left; will-change: transform;
            transition: transform .7s cubic-bezier(.16,1,.3,1);
          }
          .cc-ct-q:hover::before, .cc-ct-q.on::before, .cc-ct-q:focus-visible::before { transform: scaleX(1); }
          .cc-ct-q-n {
            font-family: 'Inter', sans-serif; font-weight: 700; font-variant-numeric: tabular-nums;
            font-size: clamp(11px, 0.85vw, 14px); letter-spacing: 1.6px; color: rgba(26,33,29,0.35);
            transition: color .4s ease;
          }
          .cc-ct-q:hover .cc-ct-q-n, .cc-ct-q.on .cc-ct-q-n { color: ${ACCENT_INK}; }
          .cc-ct-q-t {
            font-family: Georgia, 'Times New Roman', serif; font-weight: 400;
            font-size: clamp(19px, 1.9vw, 34px); line-height: 1.25; letter-spacing: -0.01em; color: ${TEXT};
            will-change: transform;
            transition: transform .7s cubic-bezier(.16,1,.3,1), color .4s ease;
          }
          .cc-ct-q:hover .cc-ct-q-t { transform: translateX(clamp(4px, 0.6vw, 12px)); }
          .cc-ct-q.on .cc-ct-q-t { color: ${ACCENT}; }
          .cc-ct-q-x {
            position: relative; flex: none; width: 44px; height: 44px; border-radius: 50%;
            display: grid; place-items: center; color: ${TEXT};
            border: 1px solid rgba(26,33,29,0.18); will-change: transform;
            transition: transform .6s cubic-bezier(.16,1,.3,1), background .4s ease,
                        color .4s ease, border-color .4s ease;
          }
          .cc-ct-q:hover .cc-ct-q-x { border-color: rgba(210,112,74,0.5); }
          .cc-ct-q.on .cc-ct-q-x {
            background: ${ACCENT}; border-color: transparent; color: #fff; transform: rotate(45deg);
          }
          .cc-ct-q-x i {
            position: absolute; background: currentColor; border-radius: 2px;
          }
          .cc-ct-q-x i:first-child { width: 13px; height: 1.8px; }
          .cc-ct-q-x i:last-child  { width: 1.8px; height: 13px; }

          /* the answer, which unrolls under the question */
          .cc-ct-a {
            display: grid; grid-template-rows: 0fr; border-bottom: 1px solid rgba(26,33,29,0.14);
            transition: grid-template-rows .7s cubic-bezier(.16,1,.3,1);
          }
          .cc-ct-a.on { grid-template-rows: 1fr; }
          .cc-ct-a-in { overflow: hidden; }
          .cc-ct-a p {
            margin: 0; padding: 0 clamp(10px, 1.2vw, 20px) clamp(22px, 2.4vw, 34px)
                       calc(clamp(40px, 4vw, 68px) + clamp(24px, 3.2vw, 52px));
            font-family: 'Inter', sans-serif; font-size: clamp(14px, 1.1vw, 18px); line-height: 1.8;
            color: ${MUTED}; max-width: 78ch;
            opacity: 0; transform: translateY(8px); will-change: transform, opacity;
            transition: opacity .5s ease .12s, transform .6s cubic-bezier(.16,1,.3,1) .12s;
          }
          .cc-ct-a.on p { opacity: 1; transform: translateY(0); }

          /* ══════════ direct lines + desks ══════════ */
          .cc-ct-tail {
            display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
            gap: clamp(28px, 4vw, 72px); margin-top: clamp(56px, 7vw, 110px);
            padding-top: clamp(28px, 3.4vw, 48px); border-top: 1px solid rgba(26,33,29,0.16);
          }
          .cc-ct-k {
            font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase;
            font-size: clamp(10px, 0.78vw, 12px); letter-spacing: 2px; color: ${ACCENT_INK};
            margin: 0 0 clamp(16px, 2vw, 24px);
          }
          .cc-ct-direct { display: grid; }
          .cc-ct-line {
            display: grid; grid-template-columns: 46px minmax(0, 1fr) auto; align-items: center; gap: clamp(12px, 1.4vw, 20px);
            padding: clamp(15px, 1.7vw, 20px) clamp(8px, 1vw, 14px);
            border-bottom: 1px solid rgba(26,33,29,0.12);
            text-decoration: none; color: inherit; position: relative; isolation: isolate;
          }
          .cc-ct-direct .cc-ct-line:first-of-type { border-top: 1px solid rgba(26,33,29,0.12); }
          .cc-ct-line::before {
            content: ''; position: absolute; inset: 0; z-index: -1; border-radius: 8px;
            background: linear-gradient(90deg, rgba(210,112,74,0.14), rgba(210,112,74,0.02));
            transform: scaleX(0); transform-origin: left; will-change: transform;
            transition: transform .65s cubic-bezier(.16,1,.3,1);
          }
          .cc-ct-line:hover::before, .cc-ct-line:focus-visible::before { transform: scaleX(1); }
          .cc-ct-ic {
            display: grid; place-items: center; width: 46px; height: 46px; border-radius: 13px;
            color: ${ACCENT}; background: rgba(210,112,74,0.12);
            box-shadow: inset 0 0 0 1px rgba(210,112,74,0.3); will-change: transform;
            transition: transform .55s cubic-bezier(.16,1,.3,1), background .4s ease, color .4s ease;
          }
          .cc-ct-line:hover .cc-ct-ic {
            background: ${GLOSS}; color: #fff; transform: rotate(-6deg);
            box-shadow: ${ACCENT_RIM}, 0 12px 24px -12px rgba(156,67,36,0.8);
          }
          .cc-ct-line b {
            display: block; font-family: 'Inter', sans-serif; font-weight: 700;
            font-size: clamp(15px, 1.15vw, 18px); color: ${TEXT};
          }
          .cc-ct-line em {
            display: block; margin-top: 4px; font-style: normal;
            font-family: 'Inter', sans-serif; font-size: clamp(12px, 0.9vw, 14px); color: ${MUTED};
          }
          .cc-ct-line svg.go { color: rgba(26,33,29,0.3); transition: transform .5s cubic-bezier(.16,1,.3,1), color .4s ease; }
          .cc-ct-line:hover svg.go { color: ${ACCENT}; transform: translate(3px, -3px); }

          /* the desks, and what time it is on each of them */
          .cc-ct-desks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; background: rgba(26,33,29,0.12); border: 1px solid rgba(26,33,29,0.12); border-radius: 14px; overflow: hidden; }
          .cc-ct-desk {
            background: linear-gradient(168deg, rgba(255,255,255,0.96), rgba(255,255,255,0.7));
            box-shadow: inset 0 1px 0 rgba(255,255,255,1);
            padding: clamp(14px, 1.6vw, 20px);
          }
          .cc-ct-desk b {
            display: flex; align-items: center; gap: 8px;
            font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(13px, 1vw, 15px); color: ${TEXT};
          }
          .cc-ct-desk b i { width: 7px; height: 7px; border-radius: 50%; background: rgba(26,33,29,0.2); }
          .cc-ct-desk b i.on { background: ${SAGE}; }
          .cc-ct-desk time {
            display: block; margin-top: 8px;
            font-family: Georgia, 'Times New Roman', serif; font-size: clamp(20px, 1.8vw, 30px);
            line-height: 1; color: ${TEXT}; font-variant-numeric: tabular-nums;
          }
          .cc-ct-desk span {
            display: block; margin-top: 7px;
            font-family: 'Inter', sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 1.4px;
            text-transform: uppercase; color: ${MUTED};
          }

          /* ── responsive ── */
          @media (max-width: 1100px) {
            .cc-ct-mast, .cc-ct-tail { grid-template-columns: minmax(0, 1fr); }
            .cc-lt { grid-template-columns: minmax(0, 1fr); }
            .cc-lt-margin {
              position: static; border-right: 0; padding-right: 0;
              border-bottom: 1px solid rgba(26,33,29,0.14); padding-bottom: clamp(20px, 3vw, 28px);
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            .cc-ct-slots { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
          @media (max-width: 700px) {
            .cc-lt-margin { grid-template-columns: minmax(0, 1fr); }
            .cc-lt-body { font-size: 20px; line-height: 2.1; }
            .cc-ct-slots { grid-template-columns: minmax(0, 1fr); }
            .cc-ct-desks { grid-template-columns: minmax(0, 1fr); }
            .cc-lt-seal { width: 100%; }
          }
          @media (prefers-reduced-motion: reduce) {
            .cc-lt-fill, .cc-lt-pick, .cc-lt-seal, .cc-ct-slot, .cc-ct-ic, .cc-ct-line::before { transition: none; }
            .cc-lt-menu, .cc-lt-stamp, .cc-ct-live i::after { animation: none; }
            .cc-lt-seal::after { display: none; }
          }
        `}</style>

        <div className="cc-ct-inner">
          {/* ══════════ hero ══════════ */}
          <div className="cc-ct-hero">
            <div>
              <motion.p className="cc-ct-eyebrow" {...rise(0)}>
                <i aria-hidden /> Contact
              </motion.p>
              <MaskReveal as="h1" className="cc-ct-title" delay={0.05} inView={false}>
                Write us a <span className="accent">letter.</span>
              </MaskReveal>
              <motion.p className="cc-ct-lead" {...rise(0.12)}>
                No form to survive, no fields to tab through. Fill in the blanks below and we will
                have the whole story. <b>A written reply inside two hours</b>, from the person who
                would run your team.
              </motion.p>
              <motion.span className="cc-ct-live" {...rise(0.18)}>
                <i aria-hidden /> The floor is answering right now
              </motion.span>

              <motion.div className="cc-ct-promises" {...rise(0.24)}>
                {[
                  ['2 hrs', 'To a written reply, by a person'],
                  ['30 min', 'One call, no deck, no discovery fee'],
                  ['0', 'Lock-in. Leave on 14 days notice'],
                ].map(([v, l]) => (
                  <div className="cc-ct-promise" key={l}>
                    <b>{v}</b>
                    <span>{l}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* the envelope this letter goes into */}
            <motion.div
              className="cc-ct-env"
              aria-hidden
              initial={reduce ? false : { opacity: 0, y: 30, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: -1.6 }}
              transition={{ delay: 0.18, duration: 1.1, ease: EASE }}
            >
              <div className="cc-ct-env-paper">
                <i /><i /><i /><i /><i />
              </div>

              <div className="cc-ct-env-body">
                <div className="cc-ct-env-flap" />
                <div className="cc-ct-env-to">
                  <small>To</small>
                  <b>Nexa Support Group</b>
                  <span>The floor, Melbourne and four other cities</span>
                </div>
                <div className="cc-ct-mark">
                  <b>Answered<br />in 2 hrs</b>
                </div>
                <div className="cc-ct-stampsq">
                  <b>First<br />class</b>
                </div>
              </div>

              {/* the wax seal, turning on the flap */}
              <div className="cc-ct-seal">
                <svg className="cc-ct-seal-ring" viewBox="0 0 120 120" focusable="false">
                  <defs>
                    <path id="cc-ct-seal-path" d="M60,60 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
                  </defs>
                  <text>
                    <textPath href="#cc-ct-seal-path" startOffset="0">
                      GET IN TOUCH • WE ANSWER • GET IN TOUCH •
                    </textPath>
                  </text>
                </svg>
                <span className="cc-ct-seal-disc" />
                <span className="cc-ct-seal-n">N</span>
              </div>
            </motion.div>
          </div>

          {/* ══════════ the letter ══════════ */}
          {/* #write is where every CTA on the site lands: the form itself,
              not the top of the page */}
          <div className="cc-lt" id="write">
            <motion.dl
              className="cc-lt-margin"
              variants={staggerParent(0.08)}
              initial={reduce ? false : 'hidden'}
              whileInView="show"
              viewport={VIEWPORT}
            >
              {MARGIN.map(([k, v, note]) => (
                <motion.div key={k} variants={fadeUp}>
                  <dt>{k}</dt>
                  <dd>
                    <b>{v}</b>
                    <span>{note}</span>
                  </dd>
                </motion.div>
              ))}
            </motion.dl>

            <motion.div className="cc-lt-sheet" {...rise(0.08)}>
              <div className="cc-lt-head">
                <b><i aria-hidden /> Nexa Support Group</b>
                <span>{today}</span>
              </div>

              {sent ? (
                <div className="cc-lt-sent">
                  <div className="cc-lt-stamp" aria-hidden>Received</div>
                  <p>
                    Thank you, <b>{name.trim()}</b>. Your letter is on the desk and RJ is reading
                    it now. Expect a written reply at <b>{email.trim()}</b> within two working hours,
                    with a time for the call.
                  </p>
                  <button type="button" className="cc-lt-again" onClick={() => setSent(false)}>
                    Write another letter
                  </button>
                </div>
              ) : (
                <>
                  <p className="cc-lt-body">
                    Hello Nexa. My name is{' '}
                    <Blank id="name" value={name} onChange={setName} placeholder="Name" bad={errors.name} />
                    {' '}and I run support at{' '}
                    <span className="cc-lt-nb">
                      <Blank id="company" value={company} onChange={setCompany} placeholder="Company" bad={errors.company} />.
                    </span>
                    {' '}We handle about{' '}
                    <Pick label="a number of" options={VOLUMES} value={volume} onPick={setVolume} />
                    {' '}tickets a month, across{' '}
                    <span className="cc-lt-nb">
                      <Pick label="these channels" options={CHANNELS} multi value={channels} onPick={setChannels} />.
                    </span>
                    {' '}Right now,{' '}
                    <span className="cc-lt-nb">
                      <Blank id="problem" value={problem} onChange={setProblem} placeholder="what is breaking" bad={errors.problem} />.
                    </span>
                    {' '}You can reach me at{' '}
                    <span className="cc-lt-nb">
                      <Blank id="email" type="email" value={email} onChange={setEmail} placeholder="work email" bad={errors.email} />.
                    </span>
                  </p>

                  <div className="cc-lt-ps">
                    <span className="cc-lt-ps-k">
                      <b>P.S.</b>
                      <span>Optional</span>
                    </span>
                    <p className="cc-lt-ps-hint">
                      The sentences above give us the shape of it. This is where you tell us the rest:
                      the hours that hurt, the tools you already run on, what you have tried, or anything
                      you would say if you had us on the phone.
                    </p>
                    <div className="cc-lt-ps-box">
                      <textarea
                        id="ps"
                        value={ps}
                        onChange={(e) => setPs(e.target.value)}
                        placeholder="Write freely here. There is no wrong way to say it."
                        aria-label="Anything else we should know"
                      />
                      <span className="cc-lt-ps-count" aria-hidden>{ps.trim().length}</span>
                    </div>
                  </div>

                  <div className="cc-lt-sign">
                    <button type="button" className="cc-lt-seal" onClick={seal}>
                      <span>Seal and send</span>
                      <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
                    </button>
                    <p className="cc-lt-fine">
                      {Object.keys(errors).length
                        ? <b>Fill the blanks we have underlined in red, then send.</b>
                        : 'We answer every letter. No sequences, no drip, and your details never leave us.'}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* ══════════ straight answers ══════════ */}
          <section className="cc-ct-band" aria-label="Straight answers">
            <div className="cc-ct-band-head">
              <h2>Straight answers, <span className="accent">before you ask.</span></h2>
              <p>The five things everybody wants to know before they will write to anyone. No sales language.</p>
            </div>

            <motion.div
              className="cc-ct-qa"
              variants={staggerParent(0.06)}
              initial={reduce ? false : 'hidden'}
              whileInView="show"
              viewport={VIEWPORT}
            >
              {ANSWERS.map(([q, a], i) => {
                const on = open === i
                return (
                  <motion.div key={q} variants={fadeUp}>
                    <button
                      type="button"
                      className={`cc-ct-q${on ? ' on' : ''}`}
                      aria-expanded={on}
                      aria-controls={`cc-a-${i}`}
                      onClick={() => setOpen(on ? null : i)}
                    >
                      <span className="cc-ct-q-n">{String(i + 1).padStart(2, '0')}</span>
                      <span className="cc-ct-q-t">{q}</span>
                      <span className="cc-ct-q-x" aria-hidden><i /><i /></span>
                    </button>
                    <div className={`cc-ct-a${on ? ' on' : ''}`} id={`cc-a-${i}`} role="region">
                      <div className="cc-ct-a-in"><p>{a}</p></div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </section>

          {/* ══════════ direct lines + the desks ══════════ */}
          <div className="cc-ct-tail">
            <div>
              <p className="cc-ct-k">Rather not write</p>
              <div className="cc-ct-direct">
                {DIRECT.map(({ Icon, k, v, note, href }) => (
                  <a className="cc-ct-line" key={k} href={href}>
                    <span className="cc-ct-ic" aria-hidden><Icon size={19} strokeWidth={1.9} /></span>
                    <span>
                      <b>{v}</b>
                      <em>{k}, {note.toLowerCase()}</em>
                    </span>
                    <ArrowUpRight className="go" size={19} strokeWidth={2.2} aria-hidden />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="cc-ct-k">Where the floors are</p>
              <div className="cc-ct-desks">
                {clocks.map((c) => (
                  <div className="cc-ct-desk" key={c.city}>
                    <b><i className={c.onShift ? 'on' : undefined} aria-hidden /> {c.city}</b>
                    <time>{c.label}</time>
                    <span>{c.zone} {c.onShift ? '- on shift' : '- night cover'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
