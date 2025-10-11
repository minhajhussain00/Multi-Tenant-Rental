"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addRentalSchema, AddRentalSchema } from "@/lib/schemas/addRental";
import { createClient } from "@/lib/supabase/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AddRentalPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();
  const form = useForm<AddRentalSchema>({
    resolver: zodResolver(addRentalSchema),
    defaultValues: {
      rental_name: "",
      rental_description: "",
      price: 0,
    },
  });

  const handleImagePreview = (file?: File) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (values: AddRentalSchema) => {
    try {
      setUploading(true);

      let imageUrl = null;

      if (values.image) {
        const file = values.image;
        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from("pictures")
          .upload(fileName, file);

        if (error) throw error;

        const { data: publicUrl } = supabase
          .storage
          .from("pictures")
          .getPublicUrl(fileName);

        imageUrl = publicUrl.publicUrl;
      }

      const { error: insertError } = await supabase
        .from("rentals")
        .insert([
          {
            rental_name: values.rental_name,
            rental_description: values.rental_description,
            price: values.price,
            image_url: imageUrl,
          },
        ]);

      if (insertError) throw insertError;

      toast.success("Rental added successfully!");
      form.reset();
      setPreview(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error adding rental");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Add Rental</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="rental_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rental Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Gaming Laptop" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rental_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Add details about the rental..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 20"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                      handleImagePreview(file);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}

          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? "Uploading..." : "Add Rental"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
