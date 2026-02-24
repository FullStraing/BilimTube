import { z } from 'zod';

export const loginSchema = z
  .object({
    method: z.enum(['email', 'phone']),
    identifier: z.string().min(1, 'Введите email или телефон'),
    password: z.string().min(6, 'Минимум 6 символов')
  })
  .superRefine((data, ctx) => {
    if (data.method === 'email') {
      const email = z.string().email('Введите корректный email');
      const res = email.safeParse(data.identifier);
      if (!res.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Введите корректный email',
          path: ['identifier']
        });
      }
    }
    if (data.method === 'phone') {
      const phone = /^\+?[0-9\s()-]{7,}$/;
      if (!phone.test(data.identifier)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Введите корректный телефон',
          path: ['identifier']
        });
      }
    }
  });

export const registerSchema = z
  .object({
    accountType: z.enum(['self', 'family']),
    method: z.enum(['email', 'phone']),
    identifier: z.string().min(1, 'Введите email или телефон'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string().min(6, 'Минимум 6 символов')
  })
  .superRefine((data, ctx) => {
    if (data.method === 'email') {
      const email = z.string().email('Введите корректный email');
      const res = email.safeParse(data.identifier);
      if (!res.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Введите корректный email',
          path: ['identifier']
        });
      }
    }
    if (data.method === 'phone') {
      const phone = /^\+?[0-9\s()-]{7,}$/;
      if (!phone.test(data.identifier)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Введите корректный телефон',
          path: ['identifier']
        });
      }
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Пароли не совпадают',
        path: ['confirmPassword']
      });
    }
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

