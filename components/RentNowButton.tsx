"use client";

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/stores/useUserStore";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useMemo, useState } from "react";
import { type DateRange } from "react-day-picker";
import { differenceInCalendarDays } from "date-fns";

interface RentNowButtonProps {
  rentalId: string;
  price: number;
  owner_id: string;
}

export function RentNowButton({ rentalId, price, owner_id }: RentNowButtonProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const { user } = useUserStore();

  const totalDays = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return differenceInCalendarDays(dateRange.to, dateRange.from) + 1;
    }
    return 0;
  }, [dateRange]);

  const totalPrice = totalDays * price;
  const serviceFee = totalPrice * 0.1;
  const grandTotal = totalPrice + serviceFee;

  const handleRent = async () => {
    try {
      if (!user) {
        toast.error("Please log in to rent this property");
        router.push("/auth/login");
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          rental_id: rentalId,
          renting_user_id: user.id,
          owner_id: owner_id,
          status: "pending",
          start_date: dateRange?.from,
          end_date: dateRange?.to,
          total_price: grandTotal,
          booking_expires_at: new Date(Date.now() + 5 * 60 * 1000),
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        toast.error("Failed to create booking. Please try again.");
        return;
      }

      toast.success("Rental booked!");
      if (data?.id) router.push(`/bookings/${data.id}`);
      else router.refresh?.();
    } catch (error) {
      console.error("Error during rent process:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition w-full sm:w-auto">
          Rent Now
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          bg-zinc-950/90 backdrop-blur-md border border-zinc-800 text-white
          w-[90vw] max-w-lg max-h-[90vh]
          p-4 sm:p-6
          rounded-xl
          overflow-y-auto
          scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent
        "
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-center sm:text-left">
            Select rental period
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm sm:text-base text-center sm:text-left">
            Choose your preferred dates to see the total cost.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 sm:py-6 flex flex-col items-center gap-4 sm:gap-6">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
          />

          <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-2 sm:space-y-3 text-sm sm:text-base">
            {totalDays > 0 ? (
              <>
                <div className="flex justify-between text-gray-400">
                  <span>{totalDays} days × ${price}</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Service Fee (10%)</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-zinc-800 my-2"></div>
                <div className="flex justify-between font-semibold text-fuchsia-400">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">
                Select a date range to calculate your total
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row justify-between mt-4 gap-3 sm:gap-0">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-zinc-700 text-gray-300 w-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            disabled={totalDays === 0}
            onClick={handleRent}
            className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition"
          >
            Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

