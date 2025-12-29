"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { RentNowButton } from "../../../../components/RentNowButton";
import { toast } from "sonner";
import type { Rental } from "@/lib/types/Rental";
import type { Profile } from "@/lib/types/UserProfile";

interface RentalDetailPageProps {
  params: Promise<{ id: string }>;
}


export default function RentalDetailPage({ params }: RentalDetailPageProps) {
  const [id, setId] = useState<string>("");
  const [rental, setRental] = useState<Rental | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchRental = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/rentals/${id}`);
        setRental(response.data.rental);
        setOwner(response.data.owner);
      } catch (error) {
        console.error("Failed to fetch rental:", error);
        toast.error("Failed to fetch rental details");
      } finally {
        setLoading(false);
      }
    };

    fetchRental();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-[90vh] bg-gradient-to-b from-zinc-950 to-black text-white py-24 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 border-4 border-fuchsia-400/30 border-t-fuchsia-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg">Loading rental details...</p>
        </div>
      </main>
    );
  }

  if (!rental) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white py-24 px-6 flex items-center justify-center">
        <p className="text-lg">Rental not found</p>
      </main>
    );
  }

  return (
    <main className="min-h-[90vh] bg-gradient-to-b from-zinc-950 to-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14">
        <div className="relative w-full h-[28rem] rounded-3xl overflow-hidden shadow-xl border border-zinc-800">
          <Image
            src={rental.image_url || "/images/placeholder.jpg"}
            alt={rental.rental_name || "Rental image"}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>

        <div className="flex flex-col gap-8 h-full">
          <div>
            <h1 className="text-4xl font-bold mb-6">
              {rental.rental_name}
            </h1>

            <div className="min-h-[30vh] overflow-y-auto pr-2">
              <p className="text-gray-300">
                {rental.rental_description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-2xl font-semibold text-fuchsia-400">
              ${rental.price} / day
            </span>

            <RentNowButton
              rentalId={rental.id ?? 0}
              price={rental.price ?? 0}
              owner_id={owner?.id ?? ""}
            />
          </div>

          {owner && (
            <div className="border-t border-zinc-800 pt-6 flex items-center gap-4">
              <Image
                src={owner.image_url || "/images/default-avatar.png"}
                alt={owner.name  || "Owner image"}
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

