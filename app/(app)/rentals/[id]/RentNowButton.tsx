"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface RentNowButtonProps {
  rentalId: string;
}

export function RentNowButton({ rentalId }: RentNowButtonProps) {
  const handleRent = async () => {
    try {
      const supabase = createClient();
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        alert("Please log in to rent this property");
        return;
      }

      // Here you would typically create a rental/booking record
      // For now, we'll just show a success message
      alert(`Rental process initiated for rental ID: ${rentalId}`);
      
    } catch (error) {
      console.error("Error during rent process:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Button
      className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition"
      onClick={handleRent}
    >
      Rent Now
    </Button>
  );
}
