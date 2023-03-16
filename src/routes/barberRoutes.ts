import barberShopController from '../controllers/BarberShop';
//import tokenAdmin from '../middlewares/tokenAdmin';
import express from 'express';

const barberRoutes = express.Router()

// Token de administrativo para todas as rotas dashboard.
//barberRoutes.use(tokenAdmin);

barberRoutes.get('/agendamentos', barberShopController.schedulingsShow);
barberRoutes.get('/usuarios', barberShopController.usersShow);

barberRoutes.post('/servico/criar', barberShopController.serviceCreate);
barberRoutes.put('/servico/atualizar', barberShopController.serviceUpdate);
barberRoutes.delete('/servico/deletar', barberShopController.servicesDelete);

export = barberRoutes;
