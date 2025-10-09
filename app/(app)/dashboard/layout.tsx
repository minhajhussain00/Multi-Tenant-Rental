import Sidebar from '@/components/app/Sidebar';
import React from 'react'
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
const layout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    console.log("hi")
      const supabase = await createClient();
    
      const { data, error } = await supabase.auth.getClaims();
      console.log('data',data)
      console.log("error",error)
      if (error || !data?.claims) {
        redirect("/auth/login");
      }
    return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
    )
}

export default layout
