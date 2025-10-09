import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match only dashboard and API routes that need protection:
     * - /dashboard/:path* (all dashboard routes)
     * - /api/:path* (all API routes)
     * Exclude static files and other assets
     */
    "/dashboard/:path*",
    "/api/:path*",
  ],
};
