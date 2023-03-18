let connect: any = [];

const verifyIdService = (id_servico: number[]) => {

    for (let i = 0; i < id_servico.length; i++) {
       connect.push({id: id_servico[i]});
    }
    return connect;  
}

export = verifyIdService;

