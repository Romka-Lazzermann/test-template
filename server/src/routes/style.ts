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
            if (data) {
                res.status(201).json(data);
            }
            else {
                res.status(409).json({ success: 0, error: `This Style is already exists` });

            }
        }
        catch (err) {
            res.status(400).json({ success: 0, error: `Error while creating style : ${err}` });
        }
    });

    router.put("/:id", async (req: Request, res: Response) => {
        try {
            const { style_key } = req.body
            const data = await service.update(Number(req.params.id), { style_key })
            if (data) {
                res.json(data)
            } else {
                res.status(409).json({ success: 0, error: `This Style is already exists` });
            }
        }
        catch (err) {
            res.status(400).json({ success: 0, error: `Error while updating style : ${err}` });

        }

    });

    return router;
}