import ShortUniqueId from 'short-unique-id';
import bcrypt from 'bcryptjs';
import { User, userSchema } from './valideUser';

const processDataUser = (dataUser: User) => {
  
    const data = userSchema.parse(dataUser);

    // Create password
    const salt = bcrypt.genSaltSync(10);
    data.senha = bcrypt.hashSync(dataUser.senha, salt);

    // Gerar ID
    const generateId = new ShortUniqueId({ length: 6 });

    // Atibuir ID ao usuário
    data.id = generateId();

    return data;
 
}

export = processDataUser;


