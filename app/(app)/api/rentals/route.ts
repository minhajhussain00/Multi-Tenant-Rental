import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("owner_id");

    const supabase = await createClient();

    let query = supabase
      .from("rentals")
      .select("*")
      .order("created_at", { ascending: false });

    if (ownerId) {
      query = query.eq("rental_owner", ownerId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error fetching rentals:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
      console.error("GET /api/rentals error:", err.message);
    } else {
      console.error("GET /api/rentals error:", err);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      rental_name?: string;
      rental_description?: string;
      price?: number;
      image_url?: string | null;
    };

    const { rental_name, rental_description, price, image_url } = body;

    if (!rental_name || price === undefined) {
      return NextResponse.json(
        { error: "rental_name and price are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("rentals")
      .insert({
        rental_name,
        rental_description,
        price,
        image_url,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating rental:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
      console.error("POST /api/rentals error:", err.message);
    } else {
      console.error("POST /api/rentals error:", err);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
