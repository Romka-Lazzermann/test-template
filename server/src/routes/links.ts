import { Router } from "express";
import { Request, Response } from 'express';
import { container } from "tsyringe";
import { upload } from '../middlewares/uploadMiddleware';
import path from "path";
import fs from 'fs'
import { LinksService } from "../services/LinksService";
import { ImpressionService } from "../services/ImpressionService"
import { validateDynamicLinksRequest } from '../helpers/validate'
import PQueue from 'p-queue';
import { AIPromtService } from "../services/AIPromtService";
import retry from 'async-retry';
import { CombinationService } from "../services/CombinationService";
import { isStringifiedArray } from "../helpers/format";

export const createLinkRoutes = () => {
    const promptQueue = new PQueue({ concurrency: 10 });
    const gemini = container.resolve(AIPromtService);

    const generateLinkContent = (linkId: number, payload: any) => {
        promptQueue.add(() =>
            retry(
                async () => {
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
                    const keywords = payload?.keywords_ai
                    if (isStringifiedArray(keywords)) {
                        payload.keywords_ai = JSON.parse(keywords)?.join(",")
                    }
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
    const impressionService = container.resolve(ImpressionService)
    const combinationService = container.resolve(CombinationService)

    router.post('/link_create', upload.single('image'), async (req: Request, res: Response) => {
        try {
            const body = {
                ...req.body,
                img: req.file ? req.file.path : ""
            };
            const valid_res = validateDynamicLinksRequest(body)
            if (valid_res.success) {
                const _created = await linkService.create(body, valid_res.type)
                if (_created.ok) {
                    generateLinkContent(_created?.id || 0, _created.title);
                    res.status(201).json({ status: "ok", url: _created.link })
                } else {
                    res.status(400).json({ status: "error", error: _created.error });
                }
            } else {
                res.status(400).json({ status: "error", error: `Missing ${valid_res.missing}` });
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
    router.get('/link/get_language/:link_name', async (req: Request, res: Response) => {
        try {
            const lang: any = req.query?.lang || ''
            const _l = req.params.link_name.split('-')
            const id = Number(_l[0])
            const name = _l[1]
            const link = await linkService.findByUrl({
                id,
                name
            }, lang)

            if (link?.translate) {
                translateLinkContent(link?.payload, link.id)
                res.status(201).json({ ok: 1, lang: link.lang })
            }
            else if (link?.ok) {
                res.status(201).json({ ok: 1, lang: link.lang })
            } else {
                res.status(400).json({ error: link.error })
            }
        } catch (err) {
            res.status(400).json({ error: "Bad request", err })
        }
    })
    router.get('/link/:link_name', async (req: Request, res: Response) => {
        try {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const ua = req.headers['user-agent'];

            const lang: any = req.query?.lang || ''
            const campaignid: any = req.query?.campaignid || '-'
            const fbclid: any = req.query?.fbclid || ''
            const ttclid: any = req.query?.ttclid || ''

            const _l = req.params.link_name.split('-')
            const id = Number(_l[0])
            const name = _l[1]

            const link = await linkService.findByUrl({
                id,
                name
            }, lang)
            console.log("req.query", JSON.stringify(req.query))
            const impressionService = container.resolve(ImpressionService);
            const combinationService = container.resolve(CombinationService);

            const impression = await impressionService.create(link.data?.id || 0, campaignid, fbclid, ttclid, {ip, ua} )
            const combination = await combinationService.findByID(impression.combination_id);
            if (link?.translate) {
                translateLinkContent(link?.payload, link.id)
                res.status(201).json({ ok: 1, data: { ...link.data, ...combination, impression_id: impression.id } })
            }
            else if (link?.ok) {
                res.status(201).json({ ok: 1, data: { ...link.data, ...combination, impression_id: impression.id } })
            } else {
                res.status(400).json({ error: link.error })
            }
        } catch (err) {
            res.status(400).json({ error: "Bad request", err })
        }
    })

    router.post('/impression/clicked', async (req: Request, res: Response) => {
        try {
            const _updated = await impressionService.click(Number(req.body.impression_id))
            if (_updated) {
                res.status(201).json({ ok: 1 })
            }

        } catch (err) {
            res.status(400).json({ ok: 0, error: `Error while the click` });
        }
    })

    router.get('/channel_api', async (req: Request, res: Response) => {
        try {
            const data = await combinationService.getUsedCombinations()
            res.status(201).json({ ok: 1, data: { ...data } })
        } catch (err) {
            res.status(400).json({ ok: 0, error: `Error while get channel api` });
        }
    })

    return router
}
