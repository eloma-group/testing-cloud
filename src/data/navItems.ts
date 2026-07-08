export type NavItem = { label: string; href: string }

/* Matches the reference layout: About, Services, Team, Blog, Contact */
export const navItems: NavItem[] = [
  { label: 'About',    href: '#about'    },
  { label: 'Services', href: '#services' },
  { label: 'Team',     href: '#team'     },
  { label: 'Blog',     href: '#blog'     },
  { label: 'Contact',  href: '#contact'  },
]
