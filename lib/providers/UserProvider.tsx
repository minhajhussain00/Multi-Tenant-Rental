"use client";

import { ReactNode, useEffect } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";

export function UserProvider({ initialUser, children }: { initialUser: any; children: ReactNode }) {
  const { setUser } = useUserStore();

  useEffect(() => {
    if (initialUser) setUser(initialUser);
  }, [initialUser, setUser]);

  return <>{children}</>;
}

