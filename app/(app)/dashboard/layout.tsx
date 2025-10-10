import Sidebar from '@/components/app/Sidebar';
import React from 'react'
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
const layout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
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
