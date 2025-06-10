import { Router, Request, Response } from "express";
import { BlogService } from "../services/BlogService";
import { CategoryService } from "../services/CategoryService";
import { container } from "tsyringe";
import {format_seconds_timestamp, isStringifiedArray} from '../helpers/format'

export const createPublicBlogRoutes = () => {
    const blogService = container.resolve(BlogService)
    const categoryService = container.resolve(CategoryService)

    const router = Router();

    const formatBlog = (blog: any) => ({
        link: blog.blog_id ? `/blog/${blog.blog_id}/${blog.blog_name}` : `/blog/${blog.id}/${blog.name}`,
        img: blog.blog_img?  `${process.env.SERVER_URL}/${blog.blog_img}` : `${process.env.SERVER_URL}/${blog.img}`,
        title: blog.blog_title?  blog.blog_title : blog.title,
        description: blog.blog_description?  blog.blog_description : blog.description,
        sub_description: blog.blog_sub_description?  blog.blog_sub_description : blog.sub_description,
        keywords: blog.blog_keywords?  isStringifiedArray(blog.blog_keywords, 1)  : isStringifiedArray(blog.keywords, 1),
        category: blog.category_title?  blog.category_title : blog.category_id.title,
        category_name: blog.category_name?  blog.category_name : blog.category_id.name,
        data_created: blog.blog_time_create ? format_seconds_timestamp(blog.blog_time_create, 'YYYY-MM-DD') 
        : format_seconds_timestamp(blog.time_create, 'YYYY-MM-DD')
    });

    router.get("/popular", async (_req: Request, res: Response) => {
        try {
            const blogs = await blogService.getPopular();
            // 
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

    router.get("/category/:name", async (req: Request, res: Response) => {
        try {
            const category = await categoryService.findOneByName(req.params.name)
            if(!category){
                throw "This category does not exists"
            }
            console.log("Yo", category)
            const blogs = await blogService.getByCategoryId(category?.id || -1);
            res.json(blogs.map(formatBlog));
        }
        catch (err) {
            res.status(400).json({ ok: 0, error: err });
        }
    });

    router.get("/:id/recent", async (req: Request, res: Response) => {
        try {
            const blogs = await blogService.getRecent(+req.params.id);
            res.json(blogs.map(formatBlog));
        }
        catch (err) {
            res.status(400).json({ ok: 0, error: err });
        }
    });

    // router.get("/:id/others-popular", async (req: Request, res: Response) => {
    //     try {
    //         const blogs = await blogService.getOtherPopular(+req.params.id);
    //         res.json(blogs.map(formatBlog));
    //     }
    //     catch (err) {
    //         res.status(400).json({ ok: 0, error: err });
    //     }
    // });

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
