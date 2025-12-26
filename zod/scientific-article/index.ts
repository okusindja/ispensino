import { z } from 'zod';
import { LicenseType, ResourceType } from '@prisma/client';

export const ScientificArticleAuthorSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  affiliation: z.string().optional(),
  email: z.string().email('Email deve ser válido').optional().or(z.literal('')),
});

export const ScientificArticleSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres'),
  abstract: z.string().min(50, 'Resumo deve ter pelo menos 50 caracteres'),
  keywords: z
    .array(z.string())
    .min(1, 'Pelo menos uma palavra-chave é obrigatória'),
  doi: z.string().optional().or(z.literal('')),
  url: z.string().url('URL deve ser válida').min(1, 'URL é obrigatória'),
  journal: z.string().optional().or(z.literal('')),
  volume: z.string().optional().or(z.literal('')),
  issue: z.string().optional().or(z.literal('')),
  pages: z.string().optional().or(z.literal('')),
  publishedAt: z.string().min(1, 'Data de publicação é obrigatória'),
  license: z.nativeEnum(LicenseType, {
    errorMap: () => ({ message: 'Selecione uma licença válida' }),
  }),
  authors: z
    .array(ScientificArticleAuthorSchema)
    .min(1, 'Pelo menos um autor é obrigatório'),
  references: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type ScientificArticleFormData = z.infer<typeof ScientificArticleSchema>;
export type ScientificArticleAuthorFormData = z.infer<
  typeof ScientificArticleAuthorSchema
>;
