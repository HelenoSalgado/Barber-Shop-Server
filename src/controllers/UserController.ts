import prisma from '../database/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
import processDataUser from '../helpers/user/processDataUser';
import { Request, Response } from 'express';
import processDataUserUpdate from '../helpers/user/processDataUserUpdate';
import { User } from '../helpers/user/valideUser';
import { z } from 'zod';
import { UserUpdate } from '../helpers/user/valideUserUpdate';
import { UserLogin } from '../helpers/user/valideLogin';

class UserController {

  static async create(req: Request, res: Response) {

    try {

      const dataUser: User = req.body;

      const data = processDataUser(dataUser);

      const userExist = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!userExist) {
        const user = await prisma.user.create({
          data: {
            id: data.id,
            nome: data.nome,
            email: data.email,
            telefone: data.telefone.toString(),
            senha: data.senha,
          },
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true
          },
        });
        return res.json(user);
      };
      return res.json({
        message: 'Usuário já existe.'
      });

    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          errors: err.errors.map(({ message, path }) => ({
            message,
            field: path.join("."),
          })),
        });
      };
      res.status(400).json({ err: err.message });
    };
  };

  static async show(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.body.id },
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          agendamento: {
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
            },
          },
        },
      });
      return res.status(200).json(user)

    } catch (err: any) {
      res.status(400).json({ err: err.message });
    };
  };

  static async update(req: Request, res: Response) {

    try {
      
      const userUpdate: UserUpdate = req.body;

      const data = processDataUserUpdate(userUpdate);

      const user = await prisma.user.update({
        where: { id: data.id },
        data,
        select: {
          nome: true,
          email: true,
          telefone: true
        },
      });
      return res.json(user);

    } catch (err: any) {
      res.status(400).json({ err: err.message });
    };
  };

  static async delete(req: Request, res: Response) {
    try {
      await prisma.user.delete({
        where: { id: req.body.id },
      });
      return res.json({
        message: 'Usuário deletado com sucesso.'
      });

    } catch (err) {
      res.status(400).json({ err });
    };
  };

  static async login(req: Request, res: Response) {

    try {

      const login: UserLogin = req.body;

      const user = await prisma.user.findUnique({
        where: {
          email: login.email
        },
      });

      if (!user)
        return res.json({ message: 'Usuário não existe.' });

      // Check password
      const passwordChecked = bcrypt.compareSync(login.senha, user.senha);

      if (!passwordChecked)
        return res.status(401).json({ message: 'Falha na Autenticação.' });

      // Permisão
      const SECRET: any = process.env.SECRET;

      const token = jwt.sign({
        sub: user.id, role: user.role
      }, SECRET, {
        expiresIn: "3 days"
      });

      return res.status(200).json({ auth: true, token });

    } catch (err: any) {
      res.status(400).json({ err: err.message });
    };
  };
}

export = UserController;