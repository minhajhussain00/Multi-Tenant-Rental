'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { createClient } from '@/lib/supabase/client'
import { useUserStore } from '@/lib/stores/useUserStore'
import { useRouter } from 'next/navigation'
import {
  Home,
  Compass,
  LayoutDashboard,
  LogIn,
  UserPlus,
  LogOut,
  Rocket,
  Menu,
} from 'lucide-react'

export default function Navbar() {
  const { user, setUser } = useUserStore()
  const supabase = createClient()
  const router = useRouter()
  const [open, setOpen] = useState(false)


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      router.push('/')
      setOpen(false)
    } else {
      console.error('Logout failed:', error.message)
    }
  }

  const NavLinks = () => (
    <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm font-medium">
      <Link href="/" className="flex items-center gap-2 hover:text-primary transition-colors">
        <Home size={16} /> Home
      </Link>
      <Link href="/explore" className="flex items-center gap-2 hover:text-primary transition-colors">
        <Compass size={16} /> Explore
      </Link>
      {user && (
        <Link href="/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors">
          <LayoutDashboard size={16} /> Dashboard
        </Link>
      )}
    </div>
  )

  const AuthButtons = () => (
    <div className="flex flex-col md:flex-row gap-2">
      {user ? (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={16} /> Logout
        </Button>
      ) : (
        <>
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <LogIn size={16} /> Sign in
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button size="sm" className="flex items-center gap-2">
              <UserPlus size={16} /> Sign up
            </Button>
          </Link>
        </>
      )}
    </div>
  )

  return (
    <nav className="w-full flex items-center justify-between px-6 py-5   border-b bg-background/80 backdrop-blur-md">
  
      <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
        <Rocket className="w-5 h-5 text-primary" />
        Game Rent
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <NavLinks />
      </div>
      <div className="hidden md:flex items-center gap-2">
        <AuthButtons />
      </div>
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col gap-6 p-6">
            <NavLinks />
            <div className="border-t pt-4">
              <AuthButtons />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
