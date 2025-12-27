"use client"

import { create } from "zustand"
import { Profile } from "../types/UserProfile"


type State = {
  user: Profile | null;
  loading: boolean
  error: string | null
  setUser: (user: Profile | null) => void
  setLoading: (loading: boolean) => void
}

export const useUserStore = create<State>((set) => ({
  user: null,
  loading: true, 
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}))
