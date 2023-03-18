import { z } from 'zod';

export const schedulingSchema = z.object({
  id: z.string({
    invalid_type_error: 'id deve ser do tipo string'
  }).optional(),
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

export type Scheduling = z.infer<typeof schedulingSchema>;
