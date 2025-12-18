"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileSchema } from "@/lib/schemas/profile";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/lib/stores/useUserStore";
import Image from "next/image";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Edit2 } from "lucide-react";

export function EditProfileDialog() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user, setUser } = useUserStore();
  const supabase = createClient();

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
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

  const onSubmit = async (values: ProfileSchema) => {
    if (!user) return;

    try {
      setUploading(true);

      let imageUrl = user.image;

      // Upload image if provided
      if (values.image) {
        const file = values.image;
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("pictures")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("pictures")
          .getPublicUrl(fileName);

        imageUrl = publicUrl.publicUrl;
      }

      // Update profile in database
      const { error } = await supabase
        .from("profiles")
        .update({
          name: values.name,
          image: imageUrl,
        })
        .eq("id", user.id);

      if (error) throw error;

      // Update user store
      setUser({
        ...user,
        name: values.name,
        image: imageUrl,
      });

      toast.success("Profile updated successfully!", {
        description: "Your profile has been updated.",
        duration: 800,
      });

      setOpen(false);
      setPreview(null);
      form.reset({ name: values.name });
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Error updating profile";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and picture.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <Input
                      id="profileImageInput"
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
              <div className="mt-3">
                <Image
                  src={preview}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="w-32 h-32 object-cover rounded-full border border-border mx-auto"
                />
              </div>
            )}

            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <span className="size-4 border-2 border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
