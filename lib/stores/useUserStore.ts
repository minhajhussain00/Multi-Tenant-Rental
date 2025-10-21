"use client"

import React from 'react'
import create, { StateCreator } from 'zustand'

type User = {
  id: string
  email?: string | null
  [key: string]: any
} | null

type State = {
  user: User
  loading: boolean
  error: string | null
  setUser: (u: User) => void
  fetchUser: () => Promise<void>
}

export const useUserStore = create<State>((set: any, get: any) => ({
  user: null,
  loading: false,
  error: null,
  setUser(user: User) {
    set({ user })
  },
  async fetchUser() {
    try {
      set({ loading: true, error: null })
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = createClient()
      const { data, error } = await (await supabase).auth.getUser()
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
