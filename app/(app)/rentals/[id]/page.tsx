"use client"
import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";


interface RentalDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RentalDetailPage({ params }: RentalDetailPageProps) {
  const { id } = await params;
  const supabase = createClient();

  
  const { data: rental, error: rentalError } = await supabase
    .from("rentals")
    .select("*")
    .eq("id", id)
    .single();

  if (rentalError || !rental) {
    console.error("Error fetching rental:", rentalError);
    return notFound();
  }


  const { data: owner, error: ownerError } = await supabase
    .from("profiles")
    .select("id, name, image_url")
    .eq("id", rental.rental_owner)
    .single();

  if (ownerError) {
    console.error("Error fetching owner:", ownerError);
  }
  return (
    <main className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        <div className="relative w-full h-96 rounded-2xl overflow-hidden">
          <Image
            src={rental.image_url || "/images/placeholder.jpg"}
            alt={rental.rental_name}
            fill
            className="object-cover rounded-2xl"
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

        
              <Button 
              className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition"
              onClick={()=>alert("rent process")}
              >
                Rent Now
              </Button>
            </div>
          </div>

       
          {owner && (
            <div className="mt-6 border-t border-gray-800 pt-6 flex items-center gap-4">
              <Image
                src={owner.image_url || "/images/default-avatar.png"}
                alt={owner.name}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-lg">{owner.name}</p>
               
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
