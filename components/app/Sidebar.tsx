"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger,SheetTitle } from "@/components/ui/sheet"

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
  GamepadIcon,
} from "lucide-react"

const sidebarItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Listings", href: "/dashboard/listings", icon: Package },
  { title: "Rental Requests", href: "/dashboard/request", icon: ClipboardList },
  { title: "Renting", href: "/dashboard/renting", icon: GamepadIcon },
  { title: "My Bookings", href: "/dashboard/bookings", icon: Calendar },
]

const quickActions = [
  { title: "New Listing", href: "/dashboard/listings/new", icon: Plus },
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
]

type SidebarCounts = {
  listings?: number
  requests?: number;
  rentings?: number;
}

type SidebarContentProps = {
  onLinkClick?: () => void
  counts: SidebarCounts
}

const SidebarContent = ({ onLinkClick, counts }: SidebarContentProps) => {
  const pathname = usePathname()

  const badgeMap: Record<string, number | undefined> = {
    "/dashboard/listings": counts.listings,
    "/dashboard/request": counts.requests,
    "/dashboard/renting": counts.rentings,
  }

  return (
    <div className="flex flex-col h-screen w-60 bg-card border-r">
      <div className="flex-1 overflow-auto py-4">
        
        <nav className="space-y-1 px-2 py-6">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            const badgeCount = badgeMap[item.href]

            return (
              <Link key={item.href} href={item.href} onClick={onLinkClick}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", isActive && "bg-secondary")}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {badgeCount ? (
                    <Badge className="ml-auto">{badgeCount}</Badge>
                  ) : null}
                </Button>
              </Link>
            )
          })}
        </nav>

        <Separator className="my-4" />

        <div className="px-3">
          <h3 className="mb-2 px-3 text-sm font-medium text-muted-foreground">
            Quick Actions
          </h3>
          <nav className="space-y-1">
            {quickActions.map((item) => (
              <Link key={item.href} href={item.href} onClick={onLinkClick}>
                <Button variant="ghost" className="w-full justify-start">
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <Separator className="my-4" />

        <div className="px-3">
          <nav className="space-y-1">
            <Link href="/dashboard/profile" onClick={onLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-3 h-4 w-4" />
                Profile
              </Button>
            </Link>

            <Link href="/dashboard/settings" onClick={onLinkClick}>
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
}

const Sidebar = ({ counts }: { counts: SidebarCounts }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
  
      <div className="lg:hidden fixed top-25 left-4 z-50  ">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"secondary"} size="icon" className="w-20  shadow shadow-white" >
              <Menu className="h-10 w-10 text-white" />
            </Button>
          </SheetTrigger>
          <SheetTitle>  </SheetTitle>
          <SheetContent
            side="left"
            className="p-0 w-60 mt-20 bg-card shadow-lg"
          >
            <SidebarContent
              counts={counts}
              onLinkClick={() => setIsOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:flex fixed top-10 left-0 h-screen w-60 z-40">
        <SidebarContent counts={counts} />
      </div>
    </>
  )
}

export default Sidebar
