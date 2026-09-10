import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, 'super_secret_key');
        (req as any).userId = (decoded as any).id;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};
