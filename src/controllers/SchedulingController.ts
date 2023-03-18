import prisma from '../database/prisma';
import processDataUser from '../helpers/user/processDataUser';
import verifyIdService from '../helpers/service/verifyIdService';
import { Request, Response } from 'express';
import { Scheduling, schedulingSchema } from '../helpers/scheduling/valideScheduling';
import { unknown, z } from 'zod';
import { User, userSchema } from '../helpers/user/valideUser';

class SchedulingController {

  static async create(req: Request, res: Response) {

    const { nome, email, telefone, id_servico, data, hora, senha } = req.body;

    try {

      const user: User = {
        nome,
        email,
        telefone,
        senha
      }
  
      const scheduling: Scheduling = {
        data,
        hora,
        id_servico
      }

      const dataScheduling = schedulingSchema.parse(scheduling);
      const dataUser = processDataUser(userSchema.parse(user));
      const idService = verifyIdService(id_servico);

      console.log(typeof dataUser)
    
      const userExist = await prisma.user.findUnique({
        where: { email: dataUser.email },
      });

      if (userExist){
        return res.status(200).json({
          message: 'Usuário já existe, faça login para continuar.' 
        });
      };

      const createScheduling = await prisma.scheduling.create({
         data: {
          id: dataUser.id,
          data: dataScheduling.data,
          hora: dataScheduling.hora,
          servico: {
            connect: idService, 
          },
          usuario: {
            create: {
              id: dataUser.id,
              nome: dataUser.nome,
              email: dataUser.email,
              telefone: dataUser.telefone.toString(),
              senha: dataUser.senha
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
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          errors: err.errors.map(({ message, path }) => ({
            message,
            field: path.join("."),
          })),
        });
      }

      return res.status(400).json({ err: err.message });
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

    try {

     const scheduling: Scheduling = req.body;

     schedulingSchema.parse(scheduling);

     const idService = verifyIdService(scheduling.id_servico);

     const user = await prisma.scheduling.upsert({
      where: { usuarioId: scheduling.id },
      create: {
        id: scheduling.id,
        data: scheduling.data,
        hora: scheduling.data,
        servico: {
          connect: idService,
        },
        usuario: {
          connect: {
            id: scheduling.id
          },
        },
      },
      update: {
        data: scheduling.data,
        hora: scheduling.hora,
        servico: {
          set: [],
          connect: idService,
        },
      },
     });
     return res.status(200).json(user);

    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          errors: err.errors.map(({ message, path }) => ({
            message,
            field: path.join("."),
          })),
        });
      }

      return res.status(400).json({ err: err.message });
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
      res.status(400).json({err: err.message});
    };
  };
};

export = SchedulingController;