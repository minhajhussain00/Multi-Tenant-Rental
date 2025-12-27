"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
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
import type { Rental } from "@/lib/types/Rental";
import type { Booking } from "@/lib/types/Booking";


export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUserStore();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState<true|false>(true);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      const supabase = createClient();

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
  }, [id, router]);

  async function handleCheckout() {
    try {
      const res = await axios.post("/api/checkout", {
        price: Math.floor(booking?.total_price ?? 0),
        stripeId: user?.stripe_customer_id,
        name: rental?.rental_name,
        rentalId: rental?.id,
        booking_id: booking?.id,
      });

      if (res.data?.url) router.push(res.data.url);
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-muted-foreground">
        Loading booking details...
      </div>
    );
  }

  if (!booking || !rental) return null;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <Card className="overflow-hidden shadow-lg">
        {rental.image_url && (
          <div className="relative w-full h-64 sm:h-80">
            <Image
              src={rental.image_url}
              alt={rental.rental_name || "Rental image"}
              fill
              className="object-cover"
            />
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {rental.rental_name || "Rental Details"}
          </CardTitle>
          <CardDescription>{rental.rental_description}</CardDescription>
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
              className="bg-primary text-black px-5 py-2.5 rounded-lg hover:opacity-90 transition font-medium"
            >
              Checkout — ${booking.total_price?.toFixed(2)}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

