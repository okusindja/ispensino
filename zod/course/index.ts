// src/zod/course.ts
import { z } from 'zod';

export const CourseSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres'),
  description: z
    .string()
    .min(20, 'Descrição deve ter pelo menos 20 caracteres'),
  price: z.number().min(0, 'Preço não pode ser negativo').optional(),
  categories: z
    .array(z.string().uuid('ID de categoria inválido'))
    .min(1, 'Selecione pelo menos uma categoria'),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export type CourseFormData = z.infer<typeof CourseSchema>;
