import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9]+$/, "Username must only contain letters and numbers");

export const emailValidation = z
    .string()
    .email("Please enter a valid email address");

export const passwordValidation = z
    .string()
    .min(4, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long")

export const SignUpSchema = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation,
});
