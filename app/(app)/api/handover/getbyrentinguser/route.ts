import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { HandOver } from "@/lib/types/HandOver";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const renting_user = searchParams.get("renting_user");

  if (!renting_user) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  const supabase = createClient();

  const { data, error } = await (await supabase)
    .from("rental_handovers")
    .select(`
      *,
      rental:rental_id (
        id,
        rental_name,
        rental_description,
        price,
        image_url
      ),

      booking:booking_id (
        created_at,
        total_price,
        status
      )
    `)
    .eq("renting_user", renting_user)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json<HandOver[]>(data);
}

