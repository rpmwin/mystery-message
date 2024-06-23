import { z } from "zod";

export const SignInSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z
        .string()
        .min(4, "Password must be at least 4 characters long")
        .max(20, "Password must be at most 20 characters long"),
});
