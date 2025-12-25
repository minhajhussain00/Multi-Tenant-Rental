import z from "zod";

export const editRentalSchema = z.object({
  rental_name: z.string().min(3, "Name must be at least 3 characters"),
  rental_description: z.string().min(10, "Description is too short"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
});

export type EditRentalInput = z.infer<typeof editRentalSchema>;