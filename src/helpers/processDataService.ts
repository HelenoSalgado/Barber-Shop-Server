import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

const serviceSchema = z.object({
  nome: z.string({
    required_error: 'Nome do serviço é obrigatório.'
  }).min(4).max(26),
  loja: z.string({
    required_error: 'Nome da loja é obrigatório.'
  }).min(2).max(20),
  preco: z.string({
    required_error: 'Preço é obrigatório.'
  }).min(4).max(6),
  descricao: z.string({
    required_error: 'Descrição é obrigatória.'
  }).min(10, { 
    message: 'Descrição deve ter entre 10 e 100 caracteres.'
  }).max(100),
})

type Service = z.infer<typeof serviceSchema>;

const processDataService = (service: Service) => {
  try {
    const data = serviceSchema.parse(service);
    return data;

  } catch (err: any) {
    throw new Error(fromZodError(err).message);
  }

}

export = processDataService;