"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Settings,
  User,
  Bell,
  Plus,
  Calendar,
} from 'lucide-react'
import { LogoutButton } from '../auth/logout-button'

import { createClient } from '@/lib/supabase/client'
import { useUserStore } from '@/lib/stores/useUserStore'

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
    badge: '12', 
  },
  {
    title: 'Rental Requests',
    href: '/dashboard/requests',
    icon: ClipboardList,
    badge: '3',
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

const Sidebar = () => {
  const pathname = usePathname()
  const [listingsLength, setListingsLength] = React.useState<number>(0)
  const { user } = useUserStore()

  useEffect(() => {
    const fetchListings = async () => {
      if (user?.id) {
        const supabase = createClient()
        const { data } = await supabase.from('rentals').select('*').eq('rental_owner', user.id)
        setListingsLength(data?.length || 0)
      }
    }
    void fetchListings()
  }, [user?.id])
  return (
    <div className="flex h-full w-60 flex-col bg-card border-r">

      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-fuchsia-500 to-cyan-500" />
          <span className="text-lg font-semibold">GameRent</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
         
            const badge = item.href === '/dashboard/listings' ? listingsLength.toString() : item.badge

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-secondary"
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {badge}
                    </Badge>
                  )}
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
                <Link key={item.href} href={item.href}>
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
            <Link href="/dashboard/profile">
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-3 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>
        </div>
      </div>
      <div>
        {/* user profile */}
        
      </div>
      <div className="border-t px-6 py-4 flex items-center justify-center">
     
         <LogoutButton />
       
      </div>

    </div>
  )
}

export default Sidebar
