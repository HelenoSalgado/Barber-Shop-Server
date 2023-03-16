import barberShopController from '../controllers/BarberShop';
import SchedulingController from '../controllers/SchedulingController';
import UserController from '../controllers/UserController';
import express from 'express';

const publicRoutes = express.Router();

publicRoutes.get('/servicos', barberShopController.servicesShow);

// Fazer primeiro agendamento, caso o usuário não possua um perfil no sistema.
// O perfil do usuário será automaticamente criado.
publicRoutes.post('/agendamento/criar', SchedulingController.create);
publicRoutes.post('/criar-conta',UserController.create);
publicRoutes.post('/entrar', UserController.login);

export = publicRoutes;