import prisma  from '../database/prisma';
import { Request, Response } from 'express';
import processDataService from '../helpers/processDataService';

class BarberShopController {

  static async schedulingsShow(req: Request, res: Response) {
    
    try {
      const scheduling = await prisma.scheduling.findMany({
        select: {
          data: true,
          hora: true,
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
              nome: true,
              telefone: true
            },
          },
        },
    });
    return res.status(200).json(scheduling);

    } catch (err: any) {
      res.status(400).json({ err: err.message });
    };
  };

  static async usersShow(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          nome: true,
          email: true,
          telefone: true
        },
      });
      return res.status(200).json(users);

    } catch (err: any) {
      res.status(400).json({ err: err.message });
    };
  };

  static async serviceCreate(req: Request, res: Response) {

    try {

      const service = processDataService(req.body);

      const createService = await prisma.service.create({ 
        data: service
       });
      return res.status(200).json(createService);

    } catch (err: any) {
      res.status(400).json({ err: err.message });
    };
    
  };

  static async servicesShow(req: Request, res: Response) {
    try {
      const services = await prisma.service.findMany({
        select: {
          id: true,
          nome: true,
          loja: true,
          preco: true,
          descricao: true
        },
      });
      return res.status(200).json(services);

    } catch (err: any) {
      res.status(400).json({ err: err.message });
    };
  };

  static async serviceUpdate(req: Request, res: Response){

    try {

      const service = processDataService(req.body);

      const updateService = await prisma.service.update({
         where: { id: req.body.id },
         data: service,
      });
      return res.status(200).json(updateService);

    } catch (err: any) {
      res.status(400).json({ err: err.message});
    };
  };

  static async servicesDelete(req: Request, res: Response) {
    try {
      await prisma.service.delete({
        where: { id: req.body.id }
      })
      return res.status(200).json({ message: 'Serviço deletado com sucesso.'});

    } catch (err: any) {
      res.status(400).json({ err: err.message });
    };
  };
};

export = BarberShopController;