"use client";

import { RentalListing } from "@/lib/schemas/addRental";
import { editRentalSchema, EditRentalInput } from "@/lib/schemas/editRental";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";


const MenuBar = ({ listing }: { listing: RentalListing }) => {
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("rentals")
        .delete()
        .eq("id", listing.id);

      if (error) throw error;

      toast.success("Listing deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete listing");
    }
  };

  const form = useForm({
    resolver: zodResolver(editRentalSchema),
    defaultValues: {
      rental_name: listing.rental_name,
      rental_description: listing.rental_description,
      price: listing.price,
    },
  } as const);

  const onSubmit = async (values: EditRentalInput) => {
    try {
      const { error } = await supabase
        .from("rentals")
        .update(values)
        .eq("id", listing.id);

      if (error) throw error;

      toast.success("Listing updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update listing");
    }
  };

  return (
    <Menubar className="border-none bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className="hover:bg-zinc-800 p-2 rounded-md">
          <EllipsisVertical className="size-6 text-gray-300 hover:text-white" />
        </MenubarTrigger>

        <MenubarContent
          align="end"
          className="bg-zinc-900 text-gray-100 border border-zinc-800 rounded-lg w-44 p-1"
        >
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <MenubarItem
              className="flex items-center gap-2 cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                setIsOpen(true);
              }}
            >
              <Pencil className="size-4 text-fuchsia-400" />
              <span>Edit</span>
            </MenubarItem>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit listing</DialogTitle>
                <DialogDescription>
                  Update your rental details below.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input {...form.register("rental_name")}  />
                  {form.formState.errors.rental_name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.rental_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea
                    rows={4}
                    {...form.register("rental_description")}
                  />
                  {form.formState.errors.rental_description && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.rental_description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    {...form.register("price", { valueAsNumber: true })}
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

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