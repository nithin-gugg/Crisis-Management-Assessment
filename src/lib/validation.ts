import { z } from 'zod';

export const submitSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be under 100 characters").trim(),
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  phone: z.string().max(20, "Phone number is too long").trim().optional(),
  score: z.number().min(0).max(100),
  level: z.string().min(2).max(50),
  weakAreas: z.array(z.string()).max(20, "Too many weak areas defined"),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ).optional(),
  answers: z.array(
    z.object({
      questionId: z.number(),
      score: z.number()
    })
  ).optional(),
});

export type SubmitBodyType = z.infer<typeof submitSchema>;
