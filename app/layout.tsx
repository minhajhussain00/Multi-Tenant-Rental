import "./globals.css";
import Navbar from "@/components/app/Navbar";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/lib/supabase/server";
import { UserProvider } from "@/lib/providers/UserProvider";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await (await supabase)
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    profile = data;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
         
          <UserProvider initialUser={profile}>
            <Navbar />
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

