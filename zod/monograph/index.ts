// src/zod/monograph.ts
import { z } from 'zod';
import { AcademicalCourses } from '@prisma/client';

export const MonographSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres'),
  author: z.string().min(3, 'Nome do autor deve ter pelo menos 3 caracteres'),
  advisor: z
    .string()
    .min(3, 'Nome do orientador deve ter pelo menos 3 caracteres'),
  course: z.nativeEnum(AcademicalCourses, {
    errorMap: () => ({ message: 'Selecione um curso acadêmico válido' }),
  }),
  publishedAt: z.string().min(1, 'Data de publicação é obrigatória'),
  url: z.string().url('URL deve ser válida').min(1, 'URL é obrigatória'),
  tags: z.array(z.string()).optional(),
});

export type MonographFormData = z.infer<typeof MonographSchema>;
