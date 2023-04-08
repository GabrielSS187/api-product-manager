import { number, string, z } from "zod";

export const createProductSchema = z.object({
  categories: string().array().nonempty(),
  name: string().trim().min(5).max(50),
  qty: number().min(1, "The quantity must be greater than or equal to 1."),
  price: number().min(5, "Price must be greater than or equal to 5."),
});

export type TCreateUserRequest = z.infer<typeof createProductSchema>;