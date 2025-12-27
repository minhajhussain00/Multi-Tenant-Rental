import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Data = {
  totalEarnings: number;
  activeRentals: number;
  rentedOutCount: number;
  rentedCount: number;
  recentOwnerBookings: any[];
  recentRenterBookings: any[];
}
export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await (await supabase).auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = user.id;

  const [
    earnings,
    activeRentals,
    rentedOutCount,
    rentedCount,
    recentOwnerBookings,
    recentRenterBookings,
  ] = await Promise.all([
    (await supabase)
      .from("owner_earnings")
      .select("total_earned")
      .eq("owner_id", userId)
      .single(),

    (await supabase)
      .from("rentals")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userId)
      .eq("status", "active"),

    (await supabase)
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userId),

    (await supabase)
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("renter_id", userId),

    (await supabase)
      .from("bookings")
      .select("id, total_price, status, created_at, rentals(rental_name)")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),

    (await supabase)
      .from("bookings")
      .select("id, total_price, status, created_at, rentals(rental_name)")
      .eq("renter_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return NextResponse.json<Data>({
    totalEarnings: earnings.data?.total_earned ?? 0,
    activeRentals: activeRentals.count ?? 0,
    rentedOutCount: rentedOutCount.count ?? 0,
    rentedCount: rentedCount.count ?? 0,
    recentOwnerBookings: recentOwnerBookings.data ?? [],
    recentRenterBookings: recentRenterBookings.data ?? [],
  });
}
