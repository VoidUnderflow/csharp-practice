import { z } from "zod";

const requiredString = (fieldName: string) =>
  z
    .string({ error: `${fieldName} is required.` })
    .min(1, { error: `${fieldName} should have at least one character` });

export const activitySchema = z.object({
  title: requiredString("Title"),
  description: requiredString("Description"),
  category: requiredString("Category"),
  date: z
    .date({ error: "Date is required" })
    .refine((date) => date > new Date(Date.now() + 30 * 60 * 1000), {
      message: "Date must be at least 30 minutes from now.",
    }),
  city: requiredString("City"),
  venue: requiredString("Venue"),
});

export type ActivitySchema = z.infer<typeof activitySchema>;
