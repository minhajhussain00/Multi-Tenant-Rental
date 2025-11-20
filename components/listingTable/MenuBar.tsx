"use client";

import { RentalListing } from "@/lib/schemas/addRental";
import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { toast } from "sonner";

const MenuBar = ({ listing }: { listing: RentalListing }) => {
  const handleDelete = async () => {
    try {
      console.log("Delete", listing.id);
      toast.info(`Deleting ${listing.rental_name}...`);
      toast.success("Listing deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete listing");
    }
  };

  return (
    <Menubar className="border-none bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className="hover:bg-zinc-800 p-2 rounded-md">
          <EllipsisVertical className="size-6 text-gray-300 hover:text-white transition-colors" />
        </MenubarTrigger>

        <MenubarContent
          align="end"
          className="bg-zinc-900 text-gray-100 border border-zinc-800 rounded-lg shadow-lg w-40 p-1"
        >
          <MenubarItem asChild>
            <Link href={`/edit/${listing.id}`} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-zinc-800">
              <Pencil className="size-4 text-fuchsia-400" />
              <span>Edit</span>
            </Link>
          </MenubarItem>

          <MenubarSeparator className="bg-zinc-800" />

          <MenubarItem
            onClick={handleDelete}
            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-red-900/40 text-red-400 cursor-pointer"
          >
            <Trash2 className="size-4 text-red-600" />
            <span>Delete</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default MenuBar;

