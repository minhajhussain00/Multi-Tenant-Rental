import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("rental_handovers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error fetching handover:", error);
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
      console.error("GET /api/handover/[id] error:", err.message);
    } else {
      console.error("GET /api/handover/[id] error:", err);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const body = (await req.json()) as {
      meetup_location?: string;
    };

    const { meetup_location } = body;

    if (!meetup_location) {
      return NextResponse.json(
        { error: "meetup_location is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("rental_handovers")
      .update({ meetup_location })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error updating handover:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
      console.error("PATCH /api/handover/[id] error:", err.message);
    } else {
      console.error("PATCH /api/handover/[id] error:", err);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
