import bcrypt from 'bcryptjs';

const processDataUserUpdate = (senha: string) => {

    const data = {
        senha
    };

    // Create password
    const salt = bcrypt.genSaltSync(10);
    data.senha = bcrypt.hashSync(data.senha, salt);

    return data;

}

export = processDataUserUpdate;