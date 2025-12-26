import "./globals.css";
import Navbar from "@/components/app/Navbar";
import { ThemeProvider } from "next-themes";
import UserProvider from "@/components/providers/UserProvider";
import AppWrapper from "@/components/providers/AppWrapper";
import { Toaster } from "sonner";

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <AppWrapper>
              <Navbar className="fixed" />
              <main className="mt-20">
              {children}
              </main>
              <Toaster/>
            </AppWrapper>
          </UserProvider>

        </ThemeProvider>
      </body>
    </html>
  );
}

