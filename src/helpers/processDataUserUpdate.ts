import { optional, string, z } from 'zod';
import bcrypt from 'bcryptjs';
import { fromZodError } from 'zod-validation-error';

const userSchema = z.object({
  nome: z.string({
    required_error: 'Nome é obrigatório.',
    invalid_type_error: 'Não é um nome válido.'
  }).min(2).max(26),
  telefone: z.number({
    required_error: 'Telefone é obrigatório.',
    invalid_type_error: 'Não é do tipo numérico.'
  }).transform(telefone => telefone.toString()),
  senha: z.any(optional(string())),
})

type User = z.infer<typeof userSchema>;

const processDataUserUpdate = (dataUser: User) => {

  try {
    const data = userSchema.parse(dataUser);

    // Create password
    const salt = bcrypt.genSaltSync(10);
    data.senha = bcrypt.hashSync(dataUser.senha, salt);

    return data;

  } catch (err: any) {
    throw new Error(fromZodError(err).message);
  }

}

export = processDataUserUpdate;