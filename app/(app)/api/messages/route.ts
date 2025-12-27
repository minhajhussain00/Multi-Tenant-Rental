import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type {  } from "@/lib/types/Messege";



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("room_id");

    if (!roomId) {
      return NextResponse.json(
        { error: "room_id is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase error fetching messages:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json<Message[]>(data || [], { status: 200 });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
      console.error("GET /api/messages error:", err.message);
    } else {
      console.error("GET /api/messages error:", err);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      sender_id?: string;
      content?: string;
      room_id?: string;
    };

    const { sender_id, content, room_id } = body;

    if (!sender_id || !content || !room_id) {
      return NextResponse.json(
        { error: "sender_id, content, and room_id are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("messages")
      .insert({ sender_id, content, room_id })
      .select()
      .single();

    if (error) {
      console.error("Supabase error inserting message:", error);
      console.error("details:", (error as any).details || (error as any).hint || null);
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
      console.error("POST /api/messages error:", err.message);
    } else {
      console.error("POST /api/messages error:", err);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
