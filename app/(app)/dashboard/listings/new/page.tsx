"use client";

import { addRentalSchema } from "@/lib/schemas/addRental";
import React, { useState, useRef, useEffect } from "react";
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
import z from "zod";

const Page = () => {
  const supabase = createClient();
  const form = useForm({
    resolver: zodResolver(addRentalSchema),
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ When user selects a file, show preview only (no upload yet)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    form.clearErrors("images");
  };

  // 🧹 Clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ❌ Remove selected image
  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  // 🧾 On Submit → upload image → insert rental record
  async function onSubmit(values: z.infer<typeof addRentalSchema>) {
    if (!selectedFile) {
      form.setError("images", {
        type: "manual",
        message: "Please select an image before submitting.",
      });
      return;
    }

    setIsSubmitting(true);


    const filePath = `public/${Date.now()}_${selectedFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("pictures")
      .upload(filePath, selectedFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      setIsSubmitting(false);
      return;
    }

    // Step 2: Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("pictures")
      .getPublicUrl(uploadData.path);

    const imageUrl = publicUrlData.publicUrl;

    const { data, error } = await supabase
      .from("rentals")
      .insert({
        name: values.name,
        description: values.description,
        price_per_day: values.pricePerDay,
        images: [imageUrl],
      })
      .select()
      .single();

    setIsSubmitting(false);

    if (error) {
      console.error("Insert error:", error);
    } else {
      console.log("Rental added:", data);
      form.reset();
      removeImage();
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
                {/* Name */}
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

                {/* Description */}
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

                {/* Image Upload */}
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
                      {!previewUrl ? (
                        <label className="cursor-pointer flex flex-col items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                          <UploadCloud className="w-8 h-8 text-indigo-500" />
                          <span>Click to upload an image</span>
                          <Input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="relative group w-full max-w-xs">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="rounded-lg object-cover w-full h-48 border border-zinc-200 dark:border-zinc-700"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage>{form.formState.errors.images?.message}</FormMessage>
                </FormItem>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Uploading..." : "Submit Rental"}
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
