"use client"
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/app/Navbar";
import { useEffect } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";
import { createClient } from "@/lib/supabase/client";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {setUser,user} =useUserStore()
  const Supabase = createClient()
  const fetchProfile = async () => {
    try {
      const { data: claims, error: claimsError } = await Supabase.auth.getClaims()
      if (claimsError) {
        console.error("getClaims error", claimsError)
        return
      }
      const userId = claims?.claims.sub
      if (!userId) return

      const { data: profile, error: profileError } = await Supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
        
      if (profileError) {
        console.error("fetch profile error", profileError)
        return
      }
      

      
      setUser(profile || null)
    } catch (err) {
      console.error("unexpected error fetching profile", err)
    }
   }
  useEffect( () => {
    fetchProfile()
  },[user?.id])
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

            <Navbar />
            {children}

        </ThemeProvider>
      </body>
    </html>
  );
}
