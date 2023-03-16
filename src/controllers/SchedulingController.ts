import prisma, { service }  from '../database/prisma';
import processDataUser from '../helpers/processDataUser';
import verifyIdService from '../helpers/verifyIdService';
import { Request, Response } from 'express';
import processDataScheduling from '../helpers/processDataScheduling';

class SchedulingController {

  static async create(req: Request, res: Response) {

    const { nome, email, telefone, id_servico, data, hora, senha } = req.body;
  
    const dataUser = {
      nome,
      email,
      telefone,
      senha
    }

    const dataScheduling = {
      data,
      hora,
      id_servico
    }

    try {

      const scheduling = processDataScheduling(dataScheduling);
      const user = processDataUser(dataUser);
      const idService = verifyIdService(id_servico);

      console.log(idService)
    
      const userExist = await prisma.user.findUnique({
        where: { email },
      });

      if (userExist){
        return res.status(200).json({
          message: 'Usuário já existe, faça login para continuar.' 
        });
      };

      const createScheduling = await prisma.scheduling.create({
         data: {
          id: user.id,
          data: scheduling.data,
          hora: scheduling.hora,
          servico: {
            connect: idService, 
          },
          usuario: {
            create: {
              id: user.id,
              nome: user.nome,
              email: user.email,
              telefone: user.telefone,
              senha: user.senha
            }
          },
         },
         include: {
          servico: {
            select: {
              nome: true,
              loja: true,
              preco: true,
              descricao: true
            },
          },
          usuario: {
            select: {
              id: true,
              nome: true,
              telefone: true,
              email: true,
            },
          },
         },
      });
      return res.status(200).json(createScheduling);
  
    } catch (err: any) {
      res.status(400).json({ err: err.message });
    };
  };

  static async show(req: Request, res: Response) {
    try {
      const schedulings = await prisma.scheduling.findUnique({
        where: { usuarioId: req.body.id },
        select: {
          data: true,
          hora: true,
          servico: {
            select: {
              id: true,
              nome: true,
              loja: true,
              preco: true,
              descricao: true
            },
          },
        },
      });
      if (!schedulings) 
         return res.status(400).json({ message: 'Sem agendamento'});

      return res.status(200).json(schedulings);

    } catch (err: any) {
      res.status(400).json({err: err.message});
    };
  };

  static async update(req: Request, res: Response) {
    
    const { id, id_servico, data, hora } = req.body;

    const dataScheduling = {
      data,
      hora,
      id_servico
    }

    try {

     const scheduling = processDataScheduling(dataScheduling);
     const idService = verifyIdService(id_servico);

     const user = await prisma.scheduling.upsert({
      where: { usuarioId: id },
      update: {
        data: scheduling.data,
        hora: scheduling.hora,
        servico: {
          connect: idService,
        },
      },
      create: {
        id,
        data: scheduling.data,
        hora: scheduling.data,
        servico: {
          connect: idService,
        },
        usuario: {
          connect: {
            id
          },
        },
      },
     });
     return res.status(200).json(user);

    } catch (err: any) {
      res.status(400).json({err: err.message});
    }; 
  };
 
  static async delete(req: Request, res: Response) {
    try {
      await prisma.scheduling.delete({
        where: { id: req.body.id }
      });
      return res.status(200).json({ 
        message: 'Agendamento deletado com sucesso.' 
      });

    } catch (err: any) {
      console.log(err);
      res.status(400).json({err: err.message});
    };
  };
};

export = SchedulingController;