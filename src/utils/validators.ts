import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null || value === undefined ? undefined : value;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  company: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(100).optional()
  ),
  message: z.string().trim().min(10).max(5000),
  website: z.preprocess(
    emptyToUndefined,
    z.string().max(0).optional()
  ),
});

export type ContactInput = z.infer<typeof contactSchema>;
