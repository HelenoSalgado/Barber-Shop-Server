import { z } from 'zod';

export const userLoginSchema = z.object({
  email: z.string({
    required_error: 'Email é obrigatório.',
  }).email({
    message: 'Não é um email válido.'
  }),
  senha: z.string({
    required_error: 'Senha é obrigatória.',
  })
})

export type UserLogin = z.input<typeof userLoginSchema>;