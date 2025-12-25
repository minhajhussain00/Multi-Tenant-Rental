import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try{
      console.log("hi")
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("owner_id");
    const supabase = await createClient();

    let {error,data}= await supabase
        .from("rental_handovers")
        .select("*")
        .eq("owner", ownerId);

    if (error) {
      console.error("Supabase error fetching handovers:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
      console.error("GET /api/handover/ error:", err.message);
    } else {
      console.error("GET /api/handover/ error:", err);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}