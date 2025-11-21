"use client"

import { create } from 'zustand'

export type User = {
  id: string
  renting: string[],
  name: string,
  image: string | "placeholder",
  stripeId:string,
} | null

type State = {
  user: User
  loading: boolean
  error: string | null
  setUser: (user: User) => void
}

export const useUserStore = create<State>((set) => ({
  user: null,
  loading: false,
  error: null,
  setUser(user: User) {
    set({ user })
  },
}))

