import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
dotenv.config();

const SECRET: any = process.env.SECRET;

function tokenAdmin(req: Request | any, res: Response, next: any){

    const token: any = req.headers['x-acess-token'];

    console.log(token)
    jwt.verify(token, SECRET, (err: any, decoded: any) => {
        if(err)
           return res.status(401).json({ err: 'Você não tem permissão, autentique-se novamente.' });

        req.sub = decoded.sub

        next();
    })
    
}

export = tokenAdmin;