"use client"

import React from 'react'
import { usePrefetchUser } from '@/lib/stores/useUserStore'

export default function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  usePrefetchUser()
  return <>{children}</>
}
