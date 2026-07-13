export type NavItem = { label: string; href: string }

/* Home-page sections are reached by hash, so they work from any route.
   Contact is a page of its own. */
export const navItems: NavItem[] = [
  { label: 'About',      href: '/#about'      },
  { label: 'Services',   href: '/#services'   },
  { label: 'Industries', href: '/#industries' },
  { label: 'Pricing',    href: '/#engagement' },
  { label: 'Contact',    href: '/contact'     },
]
