import { Router } from "express";
import { ChannelService } from "../services/ChannelService";
import { Request, Response } from 'express';
import { container } from "tsyringe";

export const createChannelRoutes = () => {
    const service = container.resolve(ChannelService);
    const router = Router();

    router.get("/", async (req: Request, res: Response) => {
        try {
            const data = await service.findAll();
            res.json(data);
        }
        catch (err) {
            res.status(400).json({ success: 0, error: `Error while fetching channels : ${err}` });
        }

    });

    router.post("/", async (req: Request, res: Response) => {
        try {
            const data = await service.create(req.body);
            if(data){
                res.status(201).json(data);
            }else {
                res.status(409).json({ success: 0, error: `This channel is already exists` });
            }
        }
        catch (err) {
            res.status(400).json({ success: 0, error: `Error while creating channel : ${err}` });
        }
    });

    router.put("/:id", async (req: Request, res: Response) => {
        try{
            const { channel_key, channel_value } = req.body
            const data = await service.update(Number(req.params.id), { channel_key, channel_value });
            if(data){
                res.status(201).json(data);
            }else {
                res.status(409).json({ success: 0, error: `This channel is already exists` });
            }
        }
        catch(err){
            res.status(400).json({ success: 0, error: `Error while updating channel : ${err}` });
        }
    })

    return router;
}