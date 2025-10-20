"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Link } from "lucide-react";
import { AddRentalSchema } from "@/lib/schemas/addRental";

export default function ExploreClient({ rentals }: { rentals: AddRentalSchema[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");

  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch = rental.rental_name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || rental.category === category;
    const matchesPrice = !maxPrice || rental.price <= parseFloat(maxPrice);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <main className="min-h-screen bg-black text-white">
    

 
      <section className="py-10 px-6 bg-[#0a0a0a] border-b border-fuchsia-500/20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4">
         
          <div>
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black border-fuchsia-500/20 focus-visible:ring-fuchsia-500"
            />
          </div>

       
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-black border-fuchsia-500/20 focus-visible:ring-fuchsia-500">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="pc">Gaming PC</SelectItem>
              <SelectItem value="console">Console</SelectItem>
              <SelectItem value="vr">VR Kit</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Max Price ($)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="bg-black border-fuchsia-500/20 focus-visible:ring-fuchsia-500"
          />
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-black via-[#0a0a0a] to-[#050505]">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredRentals.length === 0 && (
            <p className="text-gray-400 text-center col-span-full">No rentals found.</p>
          )}

          {filteredRentals.map((rental) => (
            <Card
              key={rental.id}
              className="bg-gradient-to-br from-gray-900 to-black border border-fuchsia-500/20 hover:border-cyan-400/40 transition hover:scale-[1.02]"
            >
              <CardHeader className="p-0">
                <div className="relative w-full h-48">
                  <Image
                    src={rental.image || "/images/placeholder.jpg"}
                    alt={rental.rental_name}
                    fill
                    className="object-cover rounded-t-lg opacity-90 hover:opacity-100 transition"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <CardTitle className="text-lg font-bold mb-1">{rental.rental_name}</CardTitle>
                <CardDescription className="text-gray-400 mb-3 line-clamp-2">
                  {rental.rental_description}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <span className="text-fuchsia-400 font-semibold">${rental.price} / day</span>
                  <Button className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-semibold hover:opacity-90">
                   <Link href={`/rentals/${rental.id}`}>Rent Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
