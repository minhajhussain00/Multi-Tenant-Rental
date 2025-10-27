import React from 'react'
import { RentalListing } from '@/lib/schemas/addRental'
import { TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import MenuBar from './MenuBar';

const TableBody = ({listing}:{listing: RentalListing}) => {
 return (
    <TableRow>
      <TableCell className="font-medium">{listing.rental_name}</TableCell>
      <TableCell className="max-w-md  text-muted-foreground">
        {listing.rental_description}
      </TableCell>
      <TableCell className="text-right font-semibold">
        ${listing.price}
      </TableCell>
      <TableCell>
        {listing.image_url ? (
          <div className="relative w-20 h-20 rounded-md overflow-hidden border">
            <Image
              src={listing.image_url}
              alt={listing.rental_name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">No image</span>
        )}
      </TableCell>
      <TableCell>
        <MenuBar listing={listing} />
      </TableCell>
    </TableRow>
  );
}

export default TableBody
