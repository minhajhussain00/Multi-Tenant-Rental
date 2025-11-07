"use client";

import { Button } from "@/components/ui/button";

export function RentNowButton() {
  const handleRent = () => {
    alert("rent process");
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
