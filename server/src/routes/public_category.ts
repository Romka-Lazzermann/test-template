import { Router, Request, Response } from "express";
import { CategoryService } from "../services/CategoryService";
import { container } from "tsyringe";
import { Category } from "../entity/CategoryModel";

export const createPublicCategoryRoutes = () => {
    const categoryService = container.resolve(CategoryService)
    const router = Router();

    const formatBlog = (blog: any) => ({
        link: `/blog/${blog.id}`,
        img: blog.img,
        title: blog.title,
        description: blog.description,
        sub_description: blog.sub_description,
    });

    router.get("/", async (_req: Request, res: Response) => {
        try {
            const categories = await categoryService.findAll();
            const _c = categories.map((cat : Partial<Category>) => {
                return {
                    id: cat.id,
                    name: cat.name,
                    category: cat.description
                }
            })
            res.status(201).json(_c)
        } catch {
            res.status(500).json({ error: "Failed to fetch categories" });
        }
    });

    // GET /api/public/categories/:id - одна категория по ID
    router.get("/:id", async (req: Request, res: Response) => {
        try {
            const category : Partial<Category> = await categoryService.findOne(+req.params.id) || {};
            if (!category) {
                res.status(404).json({ error: "Category not found" });
            }
            res.json({ id: category.id, name: category.name, description: category.description });
        } catch {
            res.status(500).json({ error: "Failed to fetch category" });
        }
    });

    return router
}

