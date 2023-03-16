import ShortUniqueId from 'short-unique-id';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { fromZodError } from 'zod-validation-error';

const userSchema = z.object({
  id: z.optional(z.string()),
  nome: z.string({
    required_error: 'Nome é obrigatório.',
    invalid_type_error: 'Não é um nome válido.'
  }).min(2, {
    message: 'Nome de ter entre 2 e 26 caracteres.'
  }).max(26, {
    message: 'Nome deve ter entre 2 e 26 caracteres.'
  }),
  email: z.string({
    required_error: 'Email é obrigatório.',
    invalid_type_error: 'Não é uma string.'
  }).email({
    message: 'Não é um email válido.'
  }),
  telefone: z.number({
    required_error: 'Telefone é obrigatório.',
    invalid_type_error: 'Não é do tipo numérico.'
  }).transform(telefone => telefone.toString()),
  senha: z.string({
    required_error: 'Senha é obrigatória.',
    invalid_type_error: 'A senha deve conter letras e números.'
  }).min(6, {
    message: 'Senha deve ter entre 6 e 8 caracteres.'
  }).max(8, {
    message: 'Senha deve ter entre 6 e 8 caracteres.'
  })
})

type User = z.input<typeof userSchema>;


const processDataUser = (dataUser: User) => {

  try {
    const data = userSchema.parse(dataUser);

    // Create password
    const salt = bcrypt.genSaltSync(10);
    data.senha = bcrypt.hashSync(dataUser.senha, salt);

    // Gerar ID
    const generateId = new ShortUniqueId({ length: 6 });

    // Atibuir ID ao usuário
    data.id = generateId();

    return data;
  } catch (err: any) {
    throw new Error(fromZodError(err).message);
  }

}

export = processDataUser;


