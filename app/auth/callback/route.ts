import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Get the user data to determine redirect
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Successful authentication, redirect to dashboard or specified next URL
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";
        
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          return NextResponse.redirect(`${origin}${next}`);
        }
      }
    } else {
      console.error("Auth callback error:", error);
      // Redirect to error page with error message
      return NextResponse.redirect(
        `${origin}/auth/error?message=${encodeURIComponent(error.message)}`
      );
    }
  }

  // Return the user to an error page with instructions if no code is present
  return NextResponse.redirect(
    `${origin}/auth/error?message=${encodeURIComponent(
      "No authorization code found. Please try signing in again."
    )}`
  );
}