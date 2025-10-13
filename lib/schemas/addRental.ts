import { z } from "zod";
import { id } from "zod/v4/locales";

export const addRentalSchema = z.object({
  id:z.string(),
  rental_name: z.string().min(2, "Name is required"),
  rental_description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(1, "Price must be greater than 0"),
  image: z.string().min(1, "Image is required")
});

export type AddRentalSchema = z.infer<typeof addRentalSchema>;
