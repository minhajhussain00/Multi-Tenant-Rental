"use client";

import { useUserStore } from "@/lib/stores/useUserStore";
import axios from "axios";
import  { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Calendar, MapPin, DollarSign } from "lucide-react";


const Page = () => {
  const { user } = useUserStore();
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      try {
        const res = await axios.get(
          `/api/handover/getbyrentinguser?renting_user=${user.id}`
        );
        setRentals(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">No active rentals</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Rentals</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rentals.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={item.rental.image_url || "/images/placeholder.jpg"}
                alt={item.rental.rental_name || "Rental image"}
                fill
                className="object-cover"
              />
            </div>

            <CardHeader>
              <CardTitle className="text-lg">
                {item.rental.rental_name}
              </CardTitle>

              <Badge variant="secondary" className="w-fit">
                {item.status}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">
                  ${item.booking.total_price} total
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(item.booking.created_at).toLocaleDateString()}
                </span>
              </div>

              {item.pickup_location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm line-clamp-1">
                    {item.pickup_location}
                  </span>
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Link
                href={`/dashboard/handover/${item.id}`}
                className="w-full"
              >
                <Button className="w-full">
                  {item.return_location && new Date(item.booking?.end_date).getTime() < Date.now()
                    ? "View Handover"
                    : "Set Return Locations"}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;

