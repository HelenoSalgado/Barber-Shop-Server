import prisma from '../database/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
import { Request, Response } from 'express';
import { z } from 'zod';
import { userUpdateSchema } from '../helpers/user/valideUserUpdate';
import { userLoginSchema } from '../helpers/user/valideLogin';
import { userSchema } from '../helpers/user/valideUser';
import { generateId, generateSenha } from '../helpers/user/processDataUser';
dotenv.config();

class UserController {

  static async create(req: Request, res: Response) {

    try {

      const { nome, email, telefone, senha } = userSchema.parse(req.body);

      const senhahash = generateSenha(senha);
      const id = generateId();

      const userExist = await prisma.user.findUnique({
        where: { email },
      });

      if (userExist)
        return res.json({ message: 'Usuário já existe.' });

      const user = await prisma.user.create({
        data: {
          id,
          nome,
          email,
          telefone: telefone.toString(),
          senha: senhahash,
        },
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true
        },
      });
      return res.json(user);

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
      
      const { id, nome, telefone, senha } = userUpdateSchema.parse(req.body);

      const senhahash = generateSenha(senha);

      const user = await prisma.user.update({
        where: { id },
        data: {
          nome,
          telefone,
          senha: senhahash
        },
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

      const { email, senha } = userLoginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: {
          email
        },
      });

      if (!user)
        return res.json({ message: 'Usuário não existe.' });

      // Check password
      const passwordChecked = bcrypt.compareSync(senha, user.senha);

      if (!passwordChecked)
        return res.status(401).json({ message: 'Falha na Autenticação.' });

      // Permissão
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