"use client";

import { ReactNode, useEffect } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";
import { User } from "@/lib/stores/useUserStore";

export function UserProvider({ initialUser, children }: { initialUser: User; children: ReactNode }) {
  const { setUser } = useUserStore();

  useEffect(() => {
    if (initialUser) setUser(initialUser);
  }, [initialUser, setUser]);

  return <>{children}</>;
}

