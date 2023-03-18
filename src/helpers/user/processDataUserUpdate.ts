import bcrypt from 'bcryptjs';
import { UserUpdate, userUpdateSchema } from './valideUserUpdate';

const processDataUserUpdate = (dataUser: UserUpdate) => {

    const data = userUpdateSchema.parse(dataUser);

    // Create password
    const salt = bcrypt.genSaltSync(10);
    data.senha = bcrypt.hashSync(dataUser.senha, salt);

    return data;

}

export = processDataUserUpdate;