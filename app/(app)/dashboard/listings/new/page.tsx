"use client";

import { addRentalSchema } from "@/lib/schemas/addRental";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { X, UploadCloud } from "lucide-react";
import Image from "next/image";
import z from "zod";

const Page = () => {
  const supabase = createClient();
  const form = useForm({
    resolver: zodResolver(addRentalSchema),
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Upload images right when selected
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const totalImages = imageUrls.length + files.length;
    if (totalImages > 3) {
      form.setError("images", {
        type: "manual",
        message: "You can only upload up to 3 images.",
      });
      return;
    }

    form.clearErrors("images");
    setIsUploading(true);

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const filePath = `public/${Date.now()}_${file.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("pictures")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("pictures")
        .getPublicUrl(uploadData.path);

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    setImageUrls((prev) => [...prev, ...uploadedUrls]);
    setIsUploading(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(values: z.infer<typeof addRentalSchema>) {
    if (imageUrls.length === 0) {
      form.setError("images", {
        type: "manual",
        message: "Please upload at least one image before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("rentals")
      .insert({
        name: values.name,
        description: values.description,
        price_per_day: values.pricePerDay,
        images: imageUrls,
      })
      .select()
      .single();

    setIsSubmitting(false);

    if (error) {
      console.error("Insert error:", error);
    } else {
      console.log("Rental added:", data);
      form.reset();
      setImageUrls([]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-center bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Add a New Rental
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of the Rental</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Gaming Chair"
                          {...field}
                          className="focus-visible:ring-indigo-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Short description..."
                          {...field}
                          className="focus-visible:ring-indigo-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pricePerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Day</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="500"
                          {...field}
                          className="focus-visible:ring-indigo-500"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Upload Images</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
                      <label className="cursor-pointer flex flex-col items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <UploadCloud className="w-8 h-8 text-indigo-500" />
                        <span>{isUploading ? "Uploading..." : "Click or drag to upload (max 3)"}</span>
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage>{form.formState.errors.images?.message}</FormMessage>

                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      {imageUrls.map((url, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700"
                        >
                          <Image
                            src={url}
                            alt={`Uploaded ${index + 1}`}
                            width={128}
                            height={128}
                            className="object-cover w-full h-32 transition-transform duration-200 group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </FormItem>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting ? "Submitting..." : "Submit Rental"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
