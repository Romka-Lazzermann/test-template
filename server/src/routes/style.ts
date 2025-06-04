import { Router } from "express";
import { StyleService } from "../services/StyleService";
import { Request, Response } from 'express';
import { container } from "tsyringe";

export const createStyleRoutes = () => {
    const service = container.resolve(StyleService);
    const router = Router();

    router.get("/", async (req: Request, res: Response) => {
        try {
            const data = await service.findAll();
            res.json(data);
        }
        catch (err) {
            res.status(400).json({ success: 0, error: `Error while fetching styles : ${err}` });
        }

    });

    router.post("/", async (req: Request, res: Response) => {
        try {
            const data = await service.create(req.body);
            res.status(201).json(data);
        }
        catch (err) {
            res.status(400).json({ success: 0, error: `Error while creating style : ${err}` });
        }
    });

    return router;
}