'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { useState } from 'react'

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  const [open, setOpen] = useState(false)

  const pathName = usePathname()
  const params = useParams()
  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Dashboard',
      active: pathName === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: 'Banners',
      active: pathName === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/places`,
      label: 'Lugares',
      active: pathName === `/${params.storeId}/places`,
    },
    {
      href: `/${params.storeId}/experiences`,
      label: 'Experiências',
      active: pathName === `/${params.storeId}/experiences`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Configurações',
      active: pathName === `/${params.storeId}/settings`,
    },
  ]

  return (
    <>
      <nav
        className={cn(
          'items-center hidden space-x-4 lg:space-x-6 lg:flex',
          className
        )}
      >
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
      <div className='flex justify-end w-full lg:hidden'>
        <Sheet open={open} onOpenChange={() => setOpen(!open)} modal={true}>
          <SheetTrigger
            onClick={() => setOpen(true)}
            className='hover:bg-accent dark:bg-transparent rounded-sm p-2 b-1'
          >
            <Menu className='h-4 w-4' />
          </SheetTrigger>
          <SheetContent className='flex items-center flex-col justify-center'>
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
                onClick={() => setOpen(false)}
              >
                {route.label}
              </Link>
            ))}
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
