"use client"

import { addRentalSchema } from "@/lib/schemas/addRental";
import React, { useState, useEffect } from "react";
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
  const form = useForm({
    resolver: zodResolver(addRentalSchema),
  });

  const supabase = createClient();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(event.target.files || []);

  
  const totalFiles = [...selectedFiles, ...files];

  if (totalFiles.length > 3) {
    form.setError("images", {
      type: "manual",
      message: "You can only upload up to 3 images.",
    });
    return;
  }

  // Clear any previous error
  form.clearErrors("images");


  previewUrls.forEach((url) => URL.revokeObjectURL(url));

  const newUrls = totalFiles.map((file) => URL.createObjectURL(file));
  setPreviewUrls(newUrls);
  setSelectedFiles(totalFiles);
};


  // Remove a selected image
  const removeImage = (indexToRemove: number) => {
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[indexToRemove]);
      return prev.filter((_, i) => i !== indexToRemove);
    });

    setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);


  async function onSubmit(values: z.infer<typeof addRentalSchema>) {
    let imageUrls: string[] = [];

    if (selectedFiles.length > 0) {
      for (const pictureFile of selectedFiles) {
        const filePath = `public/${Date.now()}_${pictureFile.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("pictures")
          .upload(filePath, pictureFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from("pictures")
          .getPublicUrl(uploadData.path);

        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    const { data: insertData, error: insertError } = await supabase
      .from("rentals")
      .insert({
        name: values.name,
        description: values.description,
        price_per_day: values.pricePerDay,
        images: imageUrls,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting rental:", insertError);
    } else {
      console.log("Rental added successfully:", insertData);
      form.reset();
      setPreviewUrls([]);
      setSelectedFiles([]);
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                method="post"
              >
       
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of the Rental</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Gaming Chair"
                          className="focus-visible:ring-indigo-500"
                          {...field}
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
                          className="focus-visible:ring-indigo-500"
                          {...field}
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
                      <FormLabel>Price per day (PKR)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="500"
                          className="focus-visible:ring-indigo-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <div className="space-y-3">
                  <FormLabel>Upload Images</FormLabel>
                  <div className="flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
                    <label className="cursor-pointer flex flex-col items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <UploadCloud className="w-8 h-8 text-indigo-500" />
                      <span>Click to upload or drag & drop</span>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      {previewUrls.map((url, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700"
                        >
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
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
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Submit Rental
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
