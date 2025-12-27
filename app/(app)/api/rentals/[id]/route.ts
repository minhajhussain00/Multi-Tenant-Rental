import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { Rental } from "@/lib/types/Rental";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: rental, error: rentalError } = await supabase
      .from("rentals")
      .select("*")
      .eq("id", id)
      .single();

    if (rentalError || !rental) {
      console.error("Supabase error fetching rental:", rentalError);
      return NextResponse.json(
        { error: rentalError?.message || "Rental not found" },
        { status: 404 }
      );
    }

    
    const { data: owner, error: ownerError } = await supabase
      .from("profiles")
      .select("id, name, image_url")
      .eq("id", rental.rental_owner)
      .single();

    if (ownerError) {
      console.error("Error fetching owner:", ownerError);
    }

    return NextResponse.json(
      { rental, owner: owner || null },
      { status: 200 }
    );
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
      console.error("GET /api/rentals/[id] error:", err.message);
    } else {
      console.error("GET /api/rentals/[id] error:", err);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
