"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/lib/stores/useUserStore";

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        setUser(profile ?? null);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    loadUser();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
