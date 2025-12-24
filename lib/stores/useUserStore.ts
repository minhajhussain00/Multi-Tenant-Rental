"use client"

import { create } from "zustand"

export type User = {
  id: string
  renting: string[],
  name: string,
  image: string | "placeholder",
  stripeId: string,
} | null

type State = {
  user: User
  loading: boolean
  error: string | null
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
}

export const useUserStore = create<State>((set) => ({
  user: null,
  loading: true, 
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}))
