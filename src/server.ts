import express from 'express';
//import tokenAdmin from './middlewares/tokenAdmin';
const server = express();
const PORT = 3333

server.use(express.json())
server.use('/api/v1/', require('./routes/publicRoutes'))
server.use('/api/v1/usuario', require('./routes/userRoutes'))
server.use('/api/v1/dashboard', require('./routes/barberRoutes'))

server.listen(PORT, () => {
    console.log("Server started on port 3333!");
})