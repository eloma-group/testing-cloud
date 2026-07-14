export type NavItem = { label: string; href: string }

/* Every entry is a page of its own now. The home page still carries
   its section anchors, but the header no longer scrolls you around
   inside it - it takes you somewhere. */
export const navItems: NavItem[] = [
  { label: 'About',      href: '/about'      },
  { label: 'Services',   href: '/services'   },
  { label: 'Solutions',  href: '/solutions'  },
  { label: 'Industries', href: '/industries' },
  { label: 'Blog',       href: '/blog'       },
  { label: 'Contact',    href: '/contact'    },
]
