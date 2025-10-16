'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { LogOut, UserCircle2 } from 'lucide-react'

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-lg bg-black/70 border-b border-fuchsia-500/20 px-6 py-3 flex items-center justify-between">
   
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-green-400 bg-clip-text text-transparent">
          GameRent
        </span>
      </Link>

  
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
        <Link href="/" className="hover:text-fuchsia-400 transition-colors">
          Home
        </Link>
        <Link href="/explore" className="hover:text-fuchsia-400 transition-colors">
          Explore
        </Link>

        {user && (
          <>
            <Link href="/dashboard" className="hover:text-fuchsia-400 transition-colors">
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="hover:text-fuchsia-400 transition-colors flex items-center gap-1"
            >
              <UserCircle2 className="w-4 h-4" />
              Profile
            </Link>
          </>
        )}
      </div>

 
      <div className="flex items-center gap-3">
        {user ? (
          <Button
            onClick={handleLogout}
            size="sm"
            variant="ghost"
            className="text-gray-300 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="text-gray-300 hover:text-fuchsia-400 text-sm font-medium transition-colors"
            >
              Login
            </Link>
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white hover:opacity-90 font-semibold"
            >
              <Link href="/auth/sign-up">Register</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
