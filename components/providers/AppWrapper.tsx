"use client"

import { useUserStore } from "@/lib/stores/useUserStore";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const { loading } = useUserStore();

  if (loading) {
     return (
       <div className="min-h-[100vh] flex items-center justify-center">
         <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
       </div>
     );
   }


  return <>{children}</>;
}
