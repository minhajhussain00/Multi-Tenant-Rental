"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { useUserStore } from "@/lib/stores/useUserStore";
import axios from "axios";

interface RentalDetailPageProps {
  params: Promise<{ id: string }>;
}
interface HandleCheckout {
  (price?: number | React.MouseEvent<HTMLButtonElement>, stripeId?: string): Promise<void>;
}

export default function Page({ params }: RentalDetailPageProps) {
  const { id } = React.use(params);
  const {user} = useUserStore();
  const router = useRouter();
  const supabase = createClient();

  const [booking, setBooking] = useState<any>(null);
  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const { data: bookingData, error: bookingError } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (bookingError) throw bookingError;

        if (!bookingData) {
          toast.warning("Booking not found.");
          router.push("/rentals");
          return;
        }

        setBooking(bookingData);

        const { data: rentalData, error: rentalError } = await supabase
          .from("rentals")
          .select("*")
          .eq("id", bookingData.rental_id)
          .maybeSingle();

        if (rentalError) throw rentalError;

        if (!rentalData) {
          toast.warning("Rental not found.");
          router.push("/rentals");
          return;
        }

        setRental(rentalData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-muted-foreground">
        Loading booking details...
      </div>
    );
  }

  if (!booking || !rental) return null;

  const handleCheckout: HandleCheckout = async (price, stripeId) => {
    const res = await axios.post(`${window.location.origin}/api/checkout`,{
      price:Math.floor(booking.total_price),
      stripeId: user?.stripeId,
      name:rental.rental_name,
      rentalId:rental.id,
      booking_id:booking.id
    })
  
    if(res.status===200){
      router.push(res.data.url);
  }
}
  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <Card className="overflow-hidden shadow-lg">
        {rental.image_url && (
          <div className="relative w-full h-64 sm:h-80">
            <Image
              src={rental.image_url}
              alt={rental.title || "Rental image"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {rental.title || "Rental Details"}
          </CardTitle>
          <CardDescription>{rental.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-sm sm:text-base">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        
            <div>
              <p className="font-medium">Booking ID:</p>
              <p className="text-muted-foreground">{booking.id}</p>
            </div>

            <div>
              <p className="font-medium">Status:</p>
              <p
                className={`font-semibold ${
                  booking.status === "confirmed"
                    ? "text-green-600"
                    : booking.status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {booking.status}
              </p>
            </div>

            <div>
              <p className="font-medium">Total Price:</p>
              <p className="text-muted-foreground">
                ${booking.total_price?.toFixed(2) ?? "N/A"}
              </p>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              onClick={handleCheckout}
              className="bg-primary text-black px-5 py-2.5 rounded-lg hover:opacity-90 transition text-sm sm:text-base font-medium"
            >
              Checkout — ${booking.total_price?.toFixed(2) ?? "0.00"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

