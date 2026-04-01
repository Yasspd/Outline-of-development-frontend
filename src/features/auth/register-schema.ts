import { z } from 'zod';

export const registerFormSchema = z
  .object({
    firstName: z.string().trim().min(1, 'Укажите имя'),
    lastName: z.string().trim().min(1, 'Укажите фамилию'),
    email: z.string().trim().email('Введите корректный адрес эл. почты'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string().min(6, 'Подтвердите пароль'),
    position: z.string().optional(),
    department: z.string().optional(),
    outlookEmail: z
      .string()
      .optional()
      .refine(
        (value) => !value || z.string().email().safeParse(value).success,
        'Введите корректный адрес почты Outlook',
      ),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Пароли не совпадают',
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function toRegisterPayload(values: RegisterFormValues) {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    password: values.password,
    position: values.position?.trim() || undefined,
    department: values.department?.trim() || undefined,
    outlookEmail: values.outlookEmail?.trim() || undefined,
  };
}
