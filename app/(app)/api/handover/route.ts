import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("rental_handovers")
      .select(`
        *,
        rental_id:rentals (
          id,
          rental_description,
          price,
          image_url
        ),
        booking_id:bookings(
          created_at,
          total_price,
          status
        )
      `)
      .eq("owner", userId);

    if (error) {
      console.error("Supabase error fetching bookings:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
      console.error("GET /api/bookings error:", err.message);
    } else {
      console.error("GET /api/bookings error:", err);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
