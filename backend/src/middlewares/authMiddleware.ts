import {Request, Response, NextFunction} from 'express';

export function authmiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if(!token) {
        return res.status(401).json({error:'No autorizado'});
    }

    next();
}