import { createClient } from "@/lib/supabase/server";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableData from "@/components/listingTable/TableData";
import Link from "next/link";

const Page = async () => {
  const supabase = await createClient();

  const {data,error}= await supabase.auth.getClaims()
  const { data: listings, error:erro2 } = await supabase
    .from('rentals')
    .select('*')
    .eq('rental_owner', data?.claims?.id);
    
  if (error) {
    console.error(erro2);
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-4">Listings</h1>
        <p className="text-red-500">Failed to fetch listings.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">Your Rental Listings</h1>
        <Link href="/dashboard/listings/new" className="text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          Add New Listing +
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border shadow-md ">
        <Table>
          <TableCaption>List of all your rental listings</TableCaption>
          <TableHeader>
            <TableRow className="p-5">
              <TableHead >Rental Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead >Price</TableHead>
              <TableHead className="">Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings?.length ? (
              listings.map((listing) => (
                <TableData key={listing.id} listing={listing} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No listings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Page;
