"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/stores/useUserStore";

export default function ChatBox({ roomId }: { roomId?: string }) {
  const supabase = createClient();
  const { user } = useUserStore();

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const fetchMessages = async () => {
    if (!roomId) return;

    setIsLoading(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch messages error:", error);
    } else {
      setMessages(data || []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!roomId) return;

    fetchMessages();

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === payload.new.id);
            return exists ? prev : [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !roomId) return;

    const { error } = await supabase.from("messages").insert({
      room_id: roomId,
      sender_id: user.id,
      content: newMessage,
    });

    if (error) {
      console.error("Send message error:", error);
      return;
    }

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[80vh] w-10/12 p-5 backdrop-blur-xl border-zinc-800">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <h3 className="text-white text-lg font-semibold">loading chat</h3>
        </div>
      ) : (
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto space-y-3 mb-4 p-3 border-l border-r border-zinc-700"
        >
          {messages.map((msg) => {
            const isOwner = msg.sender_id === user?.id;

            return (
              <div
                key={msg.id}
                className={`flex w-full ${
                  isOwner ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
                    isOwner
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-zinc-700 text-white rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-2 items-center">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading}
          className="bg-zinc-800/60 border-zinc-700 text-white"
        />

        <Button
          onClick={sendMessage}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Send
        </Button>
      </div>
    </div>
  );
}

