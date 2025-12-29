"use client";

import { useUserStore } from "@/lib/stores/useUserStore";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import type {Booking} from "@/lib/types/Booking";

const BookingsPage = () => {
  const { user } = useUserStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`/api/bookings?user_id=${user.id}`);
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  if (loading) {
     return (
       <div className="min-h-[60vh] flex items-center justify-center">
         <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
       </div>
     );
   }

  if (!bookings.length) {
    return (
      <div className="p-6 text-muted-foreground">
        You don’t have any bookings yet.
      </div>
    );
  }

  return (
    <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <CardTitle className="text-2xl mb-5">{booking.rental_id.rental_name}</CardTitle>
           <div className="relative h-48 rounded-md">
             <Image
               src={booking.rental_id.image_url || "/images/placeholder.jpg"}
               alt={booking?.rental_id?.rental_name ?? "Rental image"}
               fill
               className="object-cover  rounded-md"
             />
           </div>
            <CardDescription>
              Status:{" "}
              <span className="capitalize font-medium">
                {booking.status}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">From:</span>{" "}
              {booking.start_date}
            </p>
            <p>
              <span className="font-medium text-foreground">To:</span>{" "}
              {booking.end_date}
            </p>
            <p>
              <span className="font-medium text-foreground">
                Total Price:
              </span>{" "}
              ${booking.total_price}
            </p>
            <p className="mb-5">
              <span className="font-medium text-foreground">
                Payment:
              </span>{" "}
              {booking.payment_status ?? "unpaid"}
            </p>
            {!booking.payment_status && (
              <Link href={`/bookings/${booking.id}`} className="block mt-5">
                <Button>Complete Payment</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingsPage;
