// import { z } from "zod";

// const categories = ["pc", "console", "vr", "mobile", "accessory"] as const;

// const subcategories = {
//   pc: ["gaming_laptop", "gaming_desktop", "custom_build", "gaming_monitor"],
//   console: ["playstation", "xbox", "nintendo_switch"],
//   vr: ["meta_quest", "htc_vive", "ps_vr"],
//   mobile: ["android", "ios"],
//   accessory: ["controller", "headset", "keyboard", "mouse", "webcam"],
// } as const;

// export const addRentalSchema = z
//   .object({
//     id: z.string(),
//     rental_name: z.string().min(2, "Name is required"),
//     category: z.enum(categories, { message: "Category is required" }),
//     subcategory: z.string(),
//     rental_description: z
//       .string()
//       .min(10, "Description must be at least 10 characters"),
//     price: z.number().min(1, "Price must be greater than 0"),
//     image: z.string().min(1, "Image is required"),
//   })
//   .superRefine((data, ctx) => {
//     const { category, subcategory } = data;

//     const validSubs = subcategories[category] as readonly string[];
//     if (!validSubs.includes(subcategory)) {
//       ctx.addIssue({
//         path: ["subcategory"],
//         message: "Invalid subcategory for selected category",
//         code: z.ZodIssueCode.custom,
//       });
//     }
//   });

// export type AddRentalSchema = z.infer<typeof addRentalSchema>;

import { z } from "zod";

// Schema for creating a new rental (form submission)
export const addRentalSchema = z.object({
  rental_name: z.string().min(2, "Name is required"),
  rental_description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(1, "Price must be greater than 0"),
  image: z.instanceof(File).optional(),
});

export type AddRentalSchema = z.infer<typeof addRentalSchema>;

// Type for rental from database (has id and image_url instead of File)
export type RentalListing = {
  id: string;
  rental_name: string;
  rental_description: string;
  price: number;
  image_url?: string | null;
  rental_owner: string;
  created_at?: string;
};