import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
  phone: z.string().min(9, 'Telefone inválido'),
  address: z.string().min(1, 'Endereço é obrigatório'),
});

export type SignupFormData = z.infer<typeof SignupSchema>;
