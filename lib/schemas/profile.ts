import { z } from "zod";

// Schema for profile updates
export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.instanceof(File).optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
