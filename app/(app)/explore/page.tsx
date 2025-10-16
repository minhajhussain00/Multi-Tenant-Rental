import { createClient } from "@/lib/supabase/client";
import ExploreClient from "./explore-client";

export default async function ExplorePage() {
  const supabase = createClient();
  const { data: rentals, error } = await supabase.from("rentals").select("*");

  if (error) throw new Error(error.message);

  return <ExploreClient rentals={rentals || []} />;
}