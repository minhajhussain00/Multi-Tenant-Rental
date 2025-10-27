"use client"

import React from 'react'
import { create } from 'zustand'

type User = {
  id: string
  email?: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
} | null

type State = {
  user: User
  loading: boolean
  error: string | null
  setUser: (u: User) => void
  fetchUser: () => Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUserStore = create<State>((set: any) => ({
  user: null,
  loading: false,
  error: null,
  setUser(user: User) {
    set({ user })
  },
  async fetchUser() {
    try {
      set({ loading: true, error: null })
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        set({ error: error.message, loading: false })
        return
      }
      set({ user: data?.user ?? null, loading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      set({ error: message, loading: false })
    }
  },
  persist: true,
}))
export function usePrefetchUser() {
  const fetchUser = useUserStore((s: State) => s.fetchUser)
  React.useEffect(() => {
    void fetchUser()
  }, [fetchUser])
}
