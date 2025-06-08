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
import retry from 'async-retry';

export const createLinkRoutes = () => {
    const promptQueue = new PQueue({ concurrency: 10 });

    const generateLinkContent = (linkId: number, payload: any) => {
        promptQueue.add(() =>
            retry(
                async () => {
                    const gemini = container.resolve(AIPromtService);
                    const linkService = container.resolve(LinksService);
                    const content = await gemini.generateLinkContent(payload);
                    await linkService.addGeneratedContent(linkId, content);
                },
                {
                    retries: 3,
                    minTimeout: 1000,
                    onRetry: (err: any, attempt) => {
                        console.warn(`Retry #${attempt} for generateLinkContent:`, err.message);
                    },
                }
            )
        );
    };

    const translateLinkContent = (payload: any, linkId: number) => {
        promptQueue.add(() =>
            retry(
                async () => {
                    const gemini = container.resolve(AIPromtService);
                    const content = await gemini.translateLinkContent(payload);
                    const linkService = container.resolve(LinksService);
                    await linkService.addTraslatedLink(linkId, content, payload?.to_lang); 
                },
                {
                    retries: 3,
                    minTimeout: 1000,
                    onRetry: (err: any, attempt) => {
                        console.warn(`Retry #${attempt} for translateLinkContent:`, err.message);
                    },
                }
            )
        );
    };

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
            if (_updated?.success) {
                res.status(201).json({ status: "ok", url: _updated.link })
            }

        } catch (err) {
            res.status(400).json({ success: 0, error: `Error while update the link` });
        }
    })

    router.get('/link/:link_name', async (req: Request, res: Response) => {
        try {
            const _l = req.params.link_name.split('-')
            const id = Number(_l[0])
            const name = _l[1]
            const link = await linkService.findByUrl({
                id,
                name
            }) // test
            if (link?.translate) {
                translateLinkContent(link?.payload, link.id)
                res.status(201).json({ status: "ok", data: link.data })
            }
            else if (link?.ok) {
                res.status(201).json({ status: "ok", data: link })
            } else {
                res.status(400).json({ error: link.error })
            }
        } catch (err) {
            res.status(400).json({ error: "Bad request", err })
        }
    })

    return router
}
