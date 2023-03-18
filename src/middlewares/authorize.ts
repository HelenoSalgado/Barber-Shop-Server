import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

const SECRET: any = process.env.SECRET;

function authorize(req: Request | any, res: Response, next: any){

    const token: any = req.headers['x-acess-token'];
    jwt.verify(token, SECRET, (err: any, decoded: any) => {
        if(err)
           return res.status(401).json({ err: 'Você não tem permissão, autentique-se novamente.' });

        req.sub = decoded.sub

        next();
    })
    
}

export = authorize;