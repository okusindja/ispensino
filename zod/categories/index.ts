import z from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(5, 'Título deve ter pelo menos 2 caracteres'),
  description: z
    .string()
    .min(20, 'Descrição deve ter pelo menos 10 caracteres'),
});

export type CategoryFormData = z.infer<typeof CategorySchema>;
