"use client";

import { useEffect, useState } from "react";

import { useUserStore } from "@/lib/stores/useUserStore";


import ActivityCard from "@/components/dashboard/ActivityCard"
import ActionCard from "@/components/dashboard/ActionCard";
import StatCard from "@/components/dashboard/StatCard";
export default function DashboardPage() {
  const { user } = useUserStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  }, [user]);

  if (!user) return null;
  if (loading) {
     return (
       <div className="min-h-[60vh] flex items-center justify-center">
         <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
       </div>
     );
   }


  return (
<div className="space-y-10 px-6 pt-8 bg-muted/40 min-h-screen">
<div className="flex flex-col gap-2">
  <h1 className="text-3xl font-bold tracking-tight">
    Welcome back 👋 <span className="text-5xl	">{user.name}</span>	
  </h1>
  <p className="text-muted-foreground">
    Here’s what’s happening with your rentals
  </p>
</div>



      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Earnings"
            value={`$${data.totalEarnings}`}
            subtitle="All-time earnings"
          />
          <StatCard
            title="Active Rentals"
            value={data.activeRentals}
            subtitle="Currently listed"
          />
          <StatCard
            title="Times Rented Out"
            value={data.rentedOutCount}
            subtitle="Total bookings received"
          />
          <StatCard
            title="Rentals Booked"
            value={data.rentedCount}
            subtitle="Bookings you made"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard
            title="Add a Rental"
            description="List a new item for rent"
            href="/dashboard/listings/new"
          />
          <ActionCard
            title="My Rentals"
            description="Manage your listings"
            href="/dashboard/listings"
          />
          <ActionCard
            title="My Bookings"
            description="View your booking history"
            href="/dashboard/bookings"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityCard
            title="Recent Rentals (Owned)"
            bookings={data.recentOwnerBookings}
            emptyText="No one has booked your rentals yet"
          />
          <ActivityCard
            title="Recent Bookings (Rented)"
            bookings={data.recentRenterBookings}
            emptyText="You haven’t booked any rentals yet"
          />
        </div>
      </section>
    </div>
  );
}
