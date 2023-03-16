import prisma from '../database/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
import processDataUser from '../helpers/processDataUser';
import { Request, Response } from 'express';
import processDataUserUpdate from '../helpers/processDataUserUpdate';

class UserController {

  static async create(req: Request, res: Response) {

    const dataUser: any = req.body;

    try {

      const data: any = processDataUser(dataUser);
      const email: string = req.body.email;

      const userExist = await prisma.user.findUnique({
        where: { email },
      });

      if (!userExist) {
        const user = await prisma.user.create({
          data,
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
      console.log(err);
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

    let { id, nome, email, telefone, senha } = req.body;

    if (email)
      return res.json({
        message: 'Você não pode atualizar o email.'
      });

    if (senha) {
      const salt = bcrypt.genSaltSync(10);
      senha = bcrypt.hashSync(senha, salt);
    };

    const dataUser = {
      nome,
      telefone,
      senha
    }

    try {

      const data = processDataUserUpdate(dataUser);

      const user = await prisma.user.update({
        where: { id },
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

    } catch (err: any) {
      res.status(400).json({ err: err.message });
    };
  };

  static async login(req: Request, res: Response) {

    interface LoginUser{
      email: string,
      senha: string
    }

    try {

      const login: LoginUser = req.body;

      console.log(login)

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
        userId: user.id,
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