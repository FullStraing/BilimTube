import { z } from 'zod';

export const loginSchema = z
  .object({
    method: z.enum(['email', 'phone']),
    identifier: z.string().min(1, 'validation.auth.identifier'),
    password: z.string().min(6, 'validation.auth.passwordMin')
  })
  .superRefine((data, ctx) => {
    if (data.method === 'email') {
      const email = z.string().email('validation.auth.email');
      const res = email.safeParse(data.identifier);
      if (!res.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'validation.auth.email',
          path: ['identifier']
        });
      }
    }
    if (data.method === 'phone') {
      const phone = /^\+?[0-9\s()-]{7,}$/;
      if (!phone.test(data.identifier)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'validation.auth.phone',
          path: ['identifier']
        });
      }
    }
  });

export const registerSchema = z
  .object({
    accountType: z.enum(['self', 'family']),
    method: z.enum(['email', 'phone']),
    identifier: z.string().min(1, 'validation.auth.identifier'),
    password: z.string().min(6, 'validation.auth.passwordMin'),
    confirmPassword: z.string().min(6, 'validation.auth.passwordMin')
  })
  .superRefine((data, ctx) => {
    if (data.method === 'email') {
      const email = z.string().email('validation.auth.email');
      const res = email.safeParse(data.identifier);
      if (!res.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'validation.auth.email',
          path: ['identifier']
        });
      }
    }
    if (data.method === 'phone') {
      const phone = /^\+?[0-9\s()-]{7,}$/;
      if (!phone.test(data.identifier)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'validation.auth.phone',
          path: ['identifier']
        });
      }
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.auth.passwordMismatch',
        path: ['confirmPassword']
      });
    }
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
