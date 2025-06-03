import { Router } from 'express';
import { Request, Response } from 'express';
import {UserService} from '../services/UseService'
import validator from "validator"
import { container } from 'tsyringe';

const router = Router();

export const createAuthRoutes = () => {
    const userService = container.resolve(UserService)

    router.post("/register", async (req: Request, res: Response) => {
    
    const { login, password } = req.body;
    if(!validator.isEmail(login)){
        res.status(401).json({
            message: "You must provide the email",
            success: 0
        })
        return
    }
    const db_user = await userService.compareUser({login})
    if(db_user){
        res.status(401).json({
            message: "This user is already exists",
            success: 0
        })
        return 
    }
    try {
        const createUser = await userService.createUser({
            login,
            hash: password
        })
    }catch (e) {
        res.status(401).json({ error: e.message });
        return
    }
    res.status(201).json({ message: 'User registered successfully' });
    })

    router.post("/login", async (req: Request, res: Response) => {
        const { login, password } = req.body;
        if(validator.isEmail(login)){
            const loginResult = await userService.loginUser({
                login,
                password
            })
            if(loginResult.success){
                res.status(200).json({token: loginResult.token})
            }else {
                res.status(401).json({...loginResult});
                return 
            }
        }
        res.status(401).json({ error: 'Invalid credentials' });
        return 
    })

    return router;
}