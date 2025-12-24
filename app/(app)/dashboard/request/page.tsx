"use client";

import { useUserStore } from "@/lib/stores/useUserStore";
import axios from "axios";
import  { useState, useEffect } from "react";

import {
    Card,
    CardHeader,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
    const { user } = useUserStore();
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        if (!user?.id) return;

        const load = async () => {
            try {
                const response = await axios.get(`/api/bookings?user_id=${user.id}`);
                console.log("Fetched bookings:", response.data);
                setBookings(response.data);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            }
        };

        load();
    }, [user?.id]);

    return (
        <div className="p-6">
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
                {bookings.map((item) => (
                    <Card key={item.id} className="overflow-hidden rounded-xl shadow-md">

                     
                        <div className="w-full h-40">
                            <img
                                src={item.rental_id?.image_url}
                                alt="rental"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <CardHeader>
                            <CardDescription>
                                {item.rental_id?.rental_description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <p className="text-lg font-medium text-white">Price</p>
                            <p className="text-sm font-semibold text-gray-500">{item.booking_id?.total_price} </p>
                            <p className="text-lg font-medium text-white">Status</p>
                            <p className="text-sm font-semibold text-gray-500">{item.booking_id?.status} </p>
                            <p className="text-lg font-medium text-white">Booking Date</p>
                            <p className="text-sm font-semibold text-gray-500">{item.booking_id?.created_at.toString()} </p>
                        </CardContent>

                        <CardFooter className="flex justify-end">
                            {!item.isHanded ? (
                                <Button size="lg" className="bg-blue-600 text-white">
                                    <Link className="text-white" href={`/dashboard/renting/handover/${item.rental_id.id}`}>View Chat</Link>  
                                </Button>
                            ):(
                                <Button size="lg" className="bg-blue-600 text-white">
                                   <Link className="text-white" href={`/dashboard/renting/handover/${item.rental_id.id}`}>Send meetup location</Link>
                                </Button>
                            )
                            }
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Page;

