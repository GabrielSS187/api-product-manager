import { number, string, z } from "zod";

export const createProductSchema = z.object({
  categories: string().trim().array().min(1, "Must have at least one category."),
  name: string().trim().min(5).max(50),
  qty: number().min(1, "The quantity must be greater than or equal to 1."),
  price: number().min(5, "Price must be greater than or equal to 5."),
});

export const editProductSchema = z.object({
  categories: string().trim().array().min(1, "Must have at least one category.").optional(),
  name: string().trim().min(5).max(50).optional(),
  qty: number().min(1, "The quantity must be greater than or equal to 1.").optional(),
  price: number().min(5, "Price must be greater than or equal to 5.").optional(),
});

export type TCreateUserRequest = z.infer<typeof createProductSchema>;
export type TEditProductRequest = z.infer<typeof editProductSchema>;