import { Router, Request, Response } from "express";
import { BlogService } from "../services/BlogService";
import { container } from "tsyringe";

export const createPublicBlogRoutes = () => {
    const blogService = container.resolve(BlogService)
    const router = Router();

    const formatBlog = (blog: any) => ({
        link: `/blog/${blog.id}`,
        img: blog.img,
        title: blog.title,
        description: blog.description,
        sub_description: blog.sub_description,
    });

    router.get("/popular", async (_req: Request, res: Response) => {
        try {
            const blogs = await blogService.getPopular();
            res.json(blogs.map(formatBlog));
        } catch (err) {
            res.status(400).json({ ok: 0, error: err });
        }
    });

    router.get("/latest", async (_req: Request, res: Response) => {
        try {
            const blogs = await blogService.getLatest();
            res.json(blogs.map(formatBlog));
        }
        catch (err) {
            res.status(400).json({ ok: 0, error: err });
        }
    });

    router.get("/category/:id", async (req: Request, res: Response) => {
        try {
            const blogs = await blogService.getByCategoryId(+req.params.id);
            res.json(blogs.map(formatBlog));
        }
        catch (err) {
            res.status(400).json({ ok: 0, error: err });
        }
    });

    router.get("/:id/similar", async (req: Request, res: Response) => {
        try {
            const blogs = await blogService.getSimilar(+req.params.id);
            res.json(blogs.map(formatBlog));
        }
        catch (err) {
            res.status(400).json({ ok: 0, error: err });
        }
    });

    router.get("/:id/others-popular", async (req: Request, res: Response) => {
        try {
            const blogs = await blogService.getOtherPopular(+req.params.id);
            res.json(blogs.map(formatBlog));
        }
        catch (err) {
            res.status(400).json({ ok: 0, error: err });
        }
    });

    router.get("/:id", async (req: Request, res: Response) => {
        try {
            const blog = await blogService.findOne(+req.params.id);
            if (!blog) { 
                res.status(404).json({ error: "Blog not found" });
                return
            }
            res.json(formatBlog(blog));
        }
        catch (err) {
            res.status(400).json({ ok: 0, error: err });
        }
    });

    return router
}
