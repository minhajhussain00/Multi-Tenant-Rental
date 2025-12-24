"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Settings,
  User,
  Bell,
  Plus,
  Calendar,
  Menu,
  GamepadIcon
} from 'lucide-react'


const sidebarItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Listings',
    href: '/dashboard/listings',
    icon: Package,

  },
  {
    title: 'Rental Requests',
    href: '/dashboard/requests',
    icon: ClipboardList,
  },
    {
    title: 'Renting',
    href: '/dashboard/renting',
    icon: GamepadIcon,
  },
  {
    title: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
  },

   ]

const quickActions = [
  {
    title: 'New Listing',
    href: '/dashboard/listings/new',
    icon: Plus,
  },
  {
    title: 'Notifications',
    href: '/dashboard/notifications',
    icon: Bell,
  },
]
type SidebarCounts = {
  listings?: number
  requests?: number
}

const Sidebar = ({ counts }: { counts: SidebarCounts }) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const badgeMap: Record<string, number | undefined> = {
    '/dashboard/listings': counts?.listings,
    '/dashboard/requests': counts?.requests,
  }
  const SidebarContent = () => (
    <div className="flex h-[90vh] flex-col bg-card">
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            const badgeCount = badgeMap[item.href]


            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-secondary"
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {badgeCount && badgeCount > 0 ? (
                    <Badge className="ml-auto">
                      {badgeCount}
                    </Badge>
                  ) : null}
                </Button>
              </Link>
            )
          })}
        </nav>
        <div className='px-5'>
          <Separator className="my-4" />
        </div>

        <div className="px-3">
          <h3 className="mb-2 px-3 text-sm font-medium text-muted-foreground">
            Quick Actions
          </h3>
          <nav className="space-y-1">
            {quickActions.map((item) => {
              const Icon = item.icon

              return (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Icon className="mr-3 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className='px-5'>
          <Separator className="my-4" />
        </div>

        <div className="px-3">
          <nav className="space-y-1">
            <Link href="/dashboard/profile" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-3 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link href="/dashboard/settings" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )

  return (
    <>

      <div className="lg:hidden fixed top-20 left-4 z-50 bg-gray-900">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5 " />
            </Button>
          </SheetTrigger>
          <SheetTitle>   </SheetTitle>
          <SheetContent side="left" className="p-0 w-60">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>


      <div className="hidden lg:flex w-60 h-full flex-col bg-card border-r">
        <SidebarContent />
      </div>
    </>
  )

}

export default Sidebar
