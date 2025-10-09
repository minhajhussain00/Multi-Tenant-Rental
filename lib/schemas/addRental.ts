import {z} from "zod";

export const addRentalSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    pricePerDay: z.number().min(1, "Price per day must be at least 1"),
    images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required").max(3, "Maximum 3 images allowed")
})