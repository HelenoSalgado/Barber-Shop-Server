import { z } from 'zod';

export const schedulingSchema = z.object({
  nome: z.string({
    invalid_type_error: 'Não é um nome válido.',
    required_error: 'Nome é obrigatório.',
  }).min(2, {
    message: 'Nome deve ter entre 2 e 26 caracteres.'
  }).max(26),
  email: z.string({
    invalid_type_error: 'Não é uma string.',
    required_error: 'Email é obrigatório.'
  }).email({
    message: 'Não é um email válido.'
  }),
  telefone: z.string({
    invalid_type_error: 'Não é do tipo string.',
    required_error: 'Telefone é obrigatório.'
  }).min(8, {
    message: 'Não é um número válido.'
  }),
  senha: z.string({
    required_error: 'Senha é obrigatória.',
    invalid_type_error: 'A senha deve conter letras e números.'
  }).min(6, {
    message: 'Senha deve ter entre 6 e 8 caracteres.'
  }).max(8, {
    message: 'Senha deve ter entre 6 e 8 caracteres.'
  }),
  data: z.string({
    required_error: 'Data é obrigatória.'
  }).min(7, {
    message: 'Data incompleta.'
  }),
  hora: z.string({
    required_error: 'Hora é obrigatória.'
  }).min(4, {
    message: 'Hora deve ter no mínimo 4 caracteres.'
  }),
  id_servico: z.number({
    required_error: 'O valor de id_serviço deve ser um array com pelo menos um serviço.',
    invalid_type_error: 'O id do serviço deve ser um número dentro de um array.'
  }).array().nonempty({
    message: 'É necessário pelo menos um serviço para o agendamento.',
  })
})

//type Scheduling = z.infer<typeof schedulingSchema>;
