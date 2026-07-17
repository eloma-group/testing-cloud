import { Phone, MessagesSquare, Wrench, Globe, TrendingUp, FolderKanban } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/* The six services, kept in one place so the three candidate layouts on the
   Services page are all driven off exactly the same copy and imagery. */

export type Service = {
  id: string
  n: string
  tag: string          // Voice, Digital, Support ...
  channel: string      // the board's channel column
  name: string
  line: string         // the serif one-liner
  body: string
  Icon: LucideIcon
  img: string
  alt: string
  does: string[]
  figs: [string, string][]
}

export const SERVICES: Service[] = [
  {
    id: 'inbound-voice',
    n: '01', tag: 'Voice', channel: 'Voice', name: 'Inbound Call Handling', Icon: Phone,
    line: 'Answered in seconds, in your name, by someone who knows the product.',
    body: 'Every call is picked up by a trained agent inside eighteen seconds, in your brand voice, working from your own scripts and escalation rules. Nobody waits in a queue and nothing lands in a voicemail box that no one checks. The agents are briefed on your product before the first call, not during it.',
    img: '/images/services-page/inbound-voice.jpg',
    alt: 'Smiling agent in a headset giving a thumbs up at his desk in a bright office',
    does: ['Order and account queries', 'Complaint handling', 'Escalation triage', 'After hours cover', 'Overflow and peak'],
    figs: [['0:18', 'Average answer'], ['92%', 'Fixed first time'], ['24/7', 'Cover available']],
  },
  {
    id: 'live-chat-email',
    n: '02', tag: 'Digital', channel: 'Digital', name: 'Live Chat and Email', Icon: MessagesSquare,
    line: 'First response in seconds, across chat, email and the social inbox.',
    body: 'Real-time chat on your site and app, with replies that read as though your own team wrote them. Inbox triage, tagging and follow-up handled for you, so nothing sits unread overnight and nothing quietly breaches an SLA while everyone is asleep.',
    img: '/images/services-page/live-chat.jpg',
    alt: 'Support agent in glasses and a headset replying to chats at his laptop',
    does: ['Website and in-app chat', 'Inbox triage', 'Social DMs', 'WhatsApp', 'Macros and tagging'],
    figs: [['0:41', 'First chat reply'], ['4', 'Channels in one queue'], ['0', 'Tickets left overnight']],
  },
  {
    id: 'technical-helpdesk',
    n: '03', tag: 'Support', channel: 'Helpdesk', name: 'Technical Helpdesk', Icon: Wrench,
    line: 'Tier 1 and tier 2, logged, diagnosed and closed before it reaches an engineer.',
    body: 'Tickets are raised, reproduced and escalated with a clean trail, so a product issue never stalls halfway through a fix. Your engineers only ever see what genuinely needs them. Everything else is resolved before it gets anywhere near their sprint.',
    img: '/images/services-page/helpdesk.jpg',
    alt: 'Helpdesk agent in a headset concentrating on a ticket at his monitor',
    does: ['Tier 1 triage', 'Tier 2 diagnosis', 'Bug intake and repro', 'Onboarding support', 'Release day cover'],
    figs: [['86%', 'Closed without a dev'], ['2', 'Tiers held in house'], ['1:1', 'Repro on every bug']],
  },
  {
    id: 'multilingual',
    n: '04', tag: 'Global', channel: 'Night desk', name: '24/7 Multilingual Support', Icon: Globe,
    line: 'Real, fluent people on shift while your market is asleep.',
    body: 'Round the clock cover across time zones, weekends and public holidays, with no drop in tone, accuracy or patience at 4am. Native and near-native agents in six languages, so every customer is answered in the language they wrote to you in.',
    img: '/images/services-page/multilingual.jpg',
    alt: 'Agent working a night shift at a lit desk in a darkened office',
    does: ['Follow the sun rota', 'Six languages', 'Holiday and weekend cover', 'Night desk', 'Local number answering'],
    figs: [['0:23', 'Answer at 3am'], ['6', 'Languages from day one'], ['365', 'Days covered']],
  },
  {
    id: 'outbound-sales',
    n: '05', tag: 'Growth', channel: 'Outbound', name: 'Outbound and Telesales', Icon: TrendingUp,
    line: 'Pipeline worked by people who can hold a conversation, not read a script.',
    body: 'Lead qualification, win-back campaigns, renewals and warm follow-up, run by agents who are trained to listen for the objection rather than talk over it. Every call is logged against the record in your CRM, with the reason it went the way it did.',
    img: '/images/services-page/outbound.jpg',
    alt: 'Agent smiling mid conversation on an outbound call at his desk',
    does: ['Lead qualification', 'Win-back campaigns', 'Renewals', 'Appointment setting', 'Post-sale follow-up'],
    figs: [['3.4x', 'On qualified pipeline'], ['100%', 'Logged to your CRM'], ['0', 'Cold scripts read']],
  },
  {
    id: 'back-office',
    n: '06', tag: 'Ops', channel: 'Back office', name: 'Back Office and Admin', Icon: FolderKanban,
    line: 'The quiet work that eats your team, done off your team.',
    body: 'Data entry, order processing, claims intake, reconciliation and the long tail of admin that nobody owns and everybody resents. It runs inside your systems on named logins, with a daily hand-back so you always know exactly what moved.',
    img: '/images/services-page/back-office.jpg',
    alt: 'Administrator carrying a thick stack of paper files through the office',
    does: ['Order processing', 'Data entry', 'Claims intake', 'Reconciliation', 'CRM hygiene'],
    figs: [['99.6%', 'Keying accuracy'], ['1', 'Daily hand-back'], ['0', 'Systems of ours']],
  },
]
