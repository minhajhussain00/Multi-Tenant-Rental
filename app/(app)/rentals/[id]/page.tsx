import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { RentNowButton } from "../../../../components/RentNowButton";
import { toast } from "sonner";

interface RentalDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RentalDetailPage({ params }: RentalDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: rental, error: rentalError } = await supabase
    .from("rentals")
    .select("*")
    .eq("id", id)
    .single();

  if (rentalError || !rental) {
    console.error("Error fetching rental:", rentalError);
    toast.error("Failed to fetch rental details");
    return notFound();
  }

  const { data: owner, error: ownerError } = await supabase
    .from("profiles")
    .select("id, name, image_url")
    .eq("id", rental.rental_owner)
    .single();

  if (ownerError) {
    console.error("Error fetching owner:", ownerError);
    toast.error("Failed to fetch owner info");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14">

        <div className="relative w-full h-[28rem] rounded-3xl overflow-hidden shadow-xl border border-zinc-800">
          <Image
            src={rental.image_url || "/images/placeholder.jpg"}
            alt={rental.rental_name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>

    
   
          
                  <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3">{rental.rental_name}</h1>
            <p className="text-gray-300 mb-6">{rental.rental_description}</p>

            <div className="flex items-center justify-between mb-10">
              <span className="text-2xl font-semibold text-fuchsia-400">
                ${rental.price} / day
              </span>

         <RentNowButton rentalId={rental.id} price={rental.price} owner_id={owner?.id} />
            </div>
          </div>


          {owner && (
            <div className="mt-6 border-t border-zinc-800 pt-6 flex items-center gap-4">
              <Image
                src={owner.image_url || "/images/default-avatar.png"}
                alt={owner.name}
                width={64}
                height={64}
                className="rounded-full object-cover ring-2 ring-fuchsia-600/30"
              />
              <div>
                <p className="font-semibold text-lg">{owner.name}</p>
                <p className="text-sm text-gray-500">Verified Owner</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/3 w-[40rem] h-[40rem] bg-fuchsia-600/10 blur-[120px] rounded-full"></div>
      </div>
    </main>
  );
}

