"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/lib/stores/useUserStore";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  if (loading) return <p className="p-6">Loading dashboard...</p>;

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

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: any;
  subtitle: string;
}) {
  return (
    <Card className="relative overflow-hidden bg-card/80 backdrop-blur-sm
  shadow-[0_10px_30px_-10px_rgba(59,130,246,0.35)]
  hover:shadow-[0_20px_45px_-15px_rgba(59,130,246,0.45)]
  transition-shadow">

    
      <div className="absolute inset-x-0 top-0 h-1 bg-blue-500/60" />


      <CardContent className="pt-6 space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}



function ActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="group relative transition cursor-pointer
  bg-card/80 backdrop-blur-sm
  shadow-[0_8px_25px_-10px_rgba(59,130,246,0.25)]
  hover:shadow-[0_16px_40px_-12px_rgba(59,130,246,0.4)]
  hover:border-blue-500/40">

        <CardContent className="pt-6 space-y-2">
          <p className="font-semibold group-hover:text-primary">
            {title}
          </p>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function ActivityCard({
  title,
  bookings,
  emptyText,
}: {
  title: string;
  bookings: any[];
  emptyText: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bookings.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            {emptyText}
          </p>
        )}

        {bookings.map((b) => (
<div
  key={b.id}
  className="flex items-center justify-between rounded-lg border bg-background/60 p-3 hover:bg-background transition"
>

            <div>
              <p className="font-medium">
                {b.rentals?.rental_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(b.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right space-y-1">
              <Badge variant="secondary">{b.status}</Badge>
              <p className="text-sm font-semibold">
                ${b.total_price}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

