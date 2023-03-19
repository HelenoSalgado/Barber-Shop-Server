import { Request, Response } from 'express';

function tokenAdmin(req: Request | any, res: Response, next: any){

    if (req.role =! "ADMIN")
        return res.status(401).json({ message: "Não autorizado."});

}

export = tokenAdmin;