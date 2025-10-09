"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return(
    <Button
      onClick={logout}
      variant="outline"
      className="text-red-600 flex items-center gap-2 px-3 py-2"
      aria-label="Logout"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}
