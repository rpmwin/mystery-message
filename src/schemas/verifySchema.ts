import { z } from "zod";

export const VerifySchema = z.object({
    code: z.string().length(6, "Code must be 6 characters long"),
});
