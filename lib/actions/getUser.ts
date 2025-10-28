import { createServerClient } from "@supabase/ssr";

export async function  getUser() {
    const supabse = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                get: () => undefined,
                set: () => {},
                remove: () => {}
            }
        }
    )
    const { data } = await supabse.auth.getClaims();
    console.log("user", data)
    return data;
}