import { Router, Request, Response } from "express";
import { GoogleService } from "../services/GoogleService";
import { container } from "tsyringe";

export const createGoogleRoutes = () => {
    const googleService = container.resolve(GoogleService)
    const router = Router();

    router.get("/", async (req : Request, res : Response) => {
        const q = req.query.q as string
        if(!q){
            res.status(400).json({error: "Missing query param"})
        }

        const result = await googleService.search(q);
        res.json(result);
    })

    return router
}