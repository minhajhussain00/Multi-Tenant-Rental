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
      .from("bookings")
      .select(`*, rental_id:rentals (id, rental_name, rental_description, price, image_url)`)
      .eq("renting_user_id", userId);

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
