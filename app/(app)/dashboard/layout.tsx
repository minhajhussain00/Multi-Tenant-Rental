import Sidebar from '@/components/app/Sidebar'
import React from 'react'
import { createClient } from '@/lib/supabase/server'

const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const supabase = createClient()

  const {
    data: { user },
  } = await (await supabase).auth.getUser()

  if (!user) return null

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'


  const listingsRes = await fetch(`${baseUrl}/api/rentals?owner_id=${user.id}`, {
      cache: 'no-store',
    })
  const handoversRes = await fetch(`${baseUrl}/api/handover?owner_id=${user.id}`, {
      cache: 'no-store',
    })
  const listings = await listingsRes.json()
  const handovers = await handoversRes.json()

  return (
    <div className="flex">
      <Sidebar
        counts={{
          listings: Array.isArray(listings) ? listings.length : 0,
          requests: Array.isArray(handovers) ? handovers.length : 0,
        }}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
