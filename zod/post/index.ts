import { z } from 'zod';

export const PostCreateSchema = z.object({
  content: z
    .string()
    .min(1, 'O conteúdo é obrigatório')
    .max(2000, 'O conteúdo não pode exceder 2000 caracteres'),
  courseId: z.string().uuid('ID do curso inválido').optional().nullable(),
  resourceId: z.string().uuid('ID do recurso inválido').optional().nullable(),
  tags: z
    .array(z.string().min(1, 'Tag não pode estar vazia'))
    .max(5, 'Máximo de 5 tags permitidas')
    .optional(),
});

export const PostUpdateSchema = PostCreateSchema.partial();

export type PostCreateData = z.infer<typeof PostCreateSchema>;
export type PostUpdateData = z.infer<typeof PostUpdateSchema>;
