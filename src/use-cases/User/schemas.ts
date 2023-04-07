import { string, z } from "zod";

export const createUserSchema = z.object({
  name: string().trim().min(5).max(35),
  email: string().trim().email("Email invalid."),
  password: string().trim()
  .regex(/^\S+\s*$/, {message: "Password cannot contain spaces."})
  .min(6, {message: "Password minimum characters is 6."})
  .max(8, {message: "Maximum password of characters is 8."})
});

export const loginUserSchema = z.object({
  email: string().trim().email("Email invalid."),
  password: string().trim(),
});

export type TCreateUserRequest = z.infer<typeof createUserSchema>;
export type TLoginUserRequest = z.infer<typeof loginUserSchema>;