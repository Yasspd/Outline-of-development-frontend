import { z } from 'zod';

export const externalLearningRequestSchema = z.object({
  title: z.string().min(3, 'Укажи понятное название курса'),
  link: z.string().url('Нужна корректная ссылка'),
  provider: z.string().min(2, 'Укажи провайдера курса'),
  cost: z.number().min(1000, 'Стоимость должна быть больше 1000 ₽'),
  startDate: z.string().min(1, 'Укажи дату начала'),
  endDate: z.string().min(1, 'Укажи дату окончания'),
  description: z.string().min(20, 'Коротко опиши программу курса'),
  attachments: z.any().optional(),
});

export type ExternalLearningRequestFormValues = z.infer<
  typeof externalLearningRequestSchema
>;
