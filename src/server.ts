import express from 'express';
import dotenv from 'dotenv';
const server = express();
dotenv.config();
const PORT = process.env.PORT;

console.log(PORT)

server.use(express.json())
server.use('/api/v1/', require('./routes/publicRoutes'))
server.use('/api/v1/usuario', require('./routes/userRoutes'))
server.use('/api/v1/dashboard', require('./routes/barberRoutes'))

server.listen(PORT, () => {
    console.log("Server started on port " + PORT);
})