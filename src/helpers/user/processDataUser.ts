import ShortUniqueId from 'short-unique-id';
import bcrypt from 'bcryptjs';

const processDataUser = (id: unknown, senha: string) => {
  
    const data = {
        id,
        senha
    };

    // Create password
    const salt = bcrypt.genSaltSync(10);
    data.senha = bcrypt.hashSync(data.senha, salt);

    // Gerar ID
    const generateId = new ShortUniqueId({ length: 6 });

    // Atibuir ID ao usuário
    data.id = generateId();

    return data;
 
}

export = processDataUser;


