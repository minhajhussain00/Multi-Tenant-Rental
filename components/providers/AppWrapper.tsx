"use client"

import { useUserStore } from "@/lib/stores/useUserStore";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const { loading } = useUserStore();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
