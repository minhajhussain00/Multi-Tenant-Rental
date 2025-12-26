import Sidebar from '@/components/app/Sidebar'
import React from 'react'
import { createClient } from '@/lib/supabase/server'

const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: listingsData, error: listingsError } = await supabase
    .from('rentals')
    .select('*')
    .eq('rental_owner', user.id)
    .order('created_at', { ascending: false })

  if (listingsError) {
    console.error('Supabase error fetching rentals for dashboard layout:', listingsError)
  }

  const { data: handoversData, error: handoversError } = await supabase
    .from('rental_handovers')
    .select('*')
    .eq('owner', user.id)

  if (handoversError) {
    console.error('Supabase error fetching handovers for dashboard layout:', handoversError)
  }

  const listings = listingsData ?? []
  const handovers = handoversData ?? []

  return (
    <div className="flex ">
    
      <Sidebar  />

      <main className="flex-1 lg:ml-60	 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
