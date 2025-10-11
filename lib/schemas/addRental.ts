import { z } from "zod";

export const addRentalSchema = z.object({
  rental_name: z.string().min(2, "Name is required"),
  rental_description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(1, "Price must be greater than 0"),
  image: z.instanceof(File).optional(),
});

export type AddRentalSchema = z.infer<typeof addRentalSchema>;
