import { z } from 'zod';

export const childProfileSchema = z.object({
  name: z.string().min(2, 'validation.child.name'),
  age: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !Number.isNaN(val), 'validation.child.ageRequired')
    .refine((val) => val >= 4 && val <= 13, 'validation.child.ageRange'),
  avatarColor: z.string().min(1, 'validation.child.avatarColor'),
  interests: z.array(z.string()).min(1, 'validation.child.interests')
});

export type ChildProfileValues = z.infer<typeof childProfileSchema>;
