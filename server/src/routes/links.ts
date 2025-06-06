import { Router } from "express";
import { Request, Response } from 'express';
import { container } from "tsyringe";
import { upload } from '../middlewares/uploadMiddleware';
import path from "path";
import fs from 'fs'
import { LinksService } from "../services/LinksService";
import { validateDynamicLinksRequest } from '../helpers/validate'
import PQueue from 'p-queue';
import { AIPromtService } from "../services/AIPromtService";

export const createLinkRoutes = () => {
    const promptQueue = new PQueue({ concurrency: 10 });

    const generateLinkContent = (linkId: number, payload: any) => {
        promptQueue.add(async () => {
            try {
                const gemini = container.resolve(AIPromtService)
                const linkService = container.resolve(LinksService);
                const content = await gemini.generateLinkContent(payload);
                linkService.addGeneratedContent(linkId, content);
            } catch (err) {
                console.error("Generation error : ", err)
            }
        })
    }

    const router = Router();
    const linkService = container.resolve(LinksService)

    router.post('/link_create', upload.single('image'), async (req: Request, res: Response) => {
        try {
            const body = {
                ...req.body,
                img: req.file ? req.file.path : ""
            };
            const valid_res = validateDynamicLinksRequest(body)
            if (valid_res.success) {
                const _created = await linkService.create(body, valid_res.type)
                if (_created) {
                    generateLinkContent(_created?.id || 0, _created.title);
                    res.status(201).json({ status: "ok", url: _created.link })
                } else {
                    res.status(400).json({ success: 0, error: `Creating fail` });
                }
            } else {
                res.status(400).json({ success: 0, error: `Missing ${valid_res.missing}` });
            }

        } catch (err) {
            if (req?.file) {
                const filepath = path.join(__dirname, '../..', 'assets', req.file.filename)
                fs.unlink(filepath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error("Error while deleting file")
                    }
                })
            }
        }
    })

    router.post('/link_edit', upload.single('image'), async (req: Request, res: Response) => {
        try {
            const body = {
                ...req.body,
                img: req.file ? req.file.path : ""
            }
            const _updated = await linkService.update(body)
            if(_updated?.success){
                res.status(201).json({status: "ok", url: _updated.link})
            }

        } catch (err) {
                res.status(400).json({ success: 0, error: `Error while update the link` });
        }
    })

    return router
}
