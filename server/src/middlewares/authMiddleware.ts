import jwt from "jsonwebtoken";
import { UserService } from '../services/UseService'
import { container } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { UserRole } from "../interfaces";

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const service = container.resolve(UserService);
    const authHeader = req.headers['authorization'];
    const token : any = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token required' });
        return
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || ""); // user.id, user.login
        const user = await service.findUser({ id: decoded.id, login: decoded.login })
        if (user?.role !== UserRole.ADMIN) {
            res.status(401).json({ message: 'User permission denied' });
            return
        }
        if (!user) {
            res.status(404).json({ message: 'User not found in database' });
            return
        }
    next();

    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
        return
    }

}