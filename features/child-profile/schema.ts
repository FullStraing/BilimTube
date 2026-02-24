import { z } from 'zod';

export const childProfileSchema = z.object({
  name: z.string().min(2, 'Введите имя'),
  age: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !Number.isNaN(val), 'Введите возраст')
    .refine((val) => val >= 4 && val <= 13, 'Возраст 4-13 лет'),
  avatarColor: z.string().min(1, 'Выберите цвет'),
  interests: z.array(z.string()).min(1, 'Выберите минимум один интерес')
});

export type ChildProfileValues = z.infer<typeof childProfileSchema>;

