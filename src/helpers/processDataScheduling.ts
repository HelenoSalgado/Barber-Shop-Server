import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';


const schedulingSchema = z.object({
  data: z.string({
    required_error: 'Data é obrigatória.'
  }).min(7, {
    message: 'Data incompleta.'
  }),
  hora: z.string({
    required_error: 'Hora é obrigatória.'
  }),
  id_servico: z.number({
    required_error: 'O valor de id_serviço deve ser um array com pelo menos um serviço.',
    invalid_type_error: 'O id do serviço deve ser um número dentro de um array.'
  }).array().nonempty({
    message: 'É necessário pelo menos um serviço para o agendamento.',
  })
})

type Scheduling = z.infer<typeof schedulingSchema>;

const processDataScheduling = (scheduling: Scheduling) => {

  try {
    const data = schedulingSchema.parse(scheduling);
    return data;

  } catch (err: any) {
    throw new Error(fromZodError(err).message);
  }
  

}

export = processDataScheduling;