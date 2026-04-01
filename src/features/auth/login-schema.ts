import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().trim().email('Введите корректный адрес эл. почты'),
  password: z.string().min(6, 'Минимум 6 символов'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
