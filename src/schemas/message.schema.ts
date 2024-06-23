import { z } from "zod";

export const MessageSchema = z.object({
    content: z

        .string()
        .min(1, "Accept messages must be at least 1 character long")
        .max(300, "Accept messages must be at most 300 character long"),
});
