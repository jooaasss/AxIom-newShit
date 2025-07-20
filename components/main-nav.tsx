'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()
  const { user } = useUser()
  
  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      active: pathname === '/dashboard',
    },
    {
      href: '/history',
      label: 'History',
      active: pathname === '/history' || pathname.startsWith('/history/'),
    },
    {
      href: '/pricing',
      label: 'Pricing',
      active: pathname === '/pricing',
    },
    {
      href: '/settings',
      label: 'Settings',
      active: pathname === '/settings',
    },
  ]

  // Add admin route for dw_940 user
  if (user?.emailAddresses?.[0]?.emailAddress === process.env.ADMIN_EMAIL) {
    routes.push({
      href: '/admin',
      label: 'Admin',
      active: pathname === '/admin',
    })
  }

  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active
              ? 'text-black dark:text-white'
              : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}