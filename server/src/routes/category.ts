import { Router } from "express";
import { CategoryService } from "../services/CategoryService";
import { Request, Response } from 'express';
import { container } from "tsyringe";

export const createCategoryRoutes = () => {
  const service = container.resolve(CategoryService);
  const router = Router();
  

  router.get("/", async (req: Request, res: Response) => {
    const data = await service.findAll();
    const prepared_data = data.map((category) => {
      return {
        title: category.title,
        id: category.id,
        description: category.description,
        status: category.status ? "On" : "Off",
        create_date: category.time_create
      }
    })
    res.json(prepared_data);
  });

  router.get("/:id", async (req: Request, res: Response) => {
    const data = await service.findOne(Number(req.params.id));
    if (!data) {
      res.status(404).json({ message: "Not found" });
      return
    }
    res.json(data);
  });

  router.post("/", async (req: Request, res: Response) => {
    try {
      const data = await service.create(req.body);
      if (data) {
        res.status(201).json(data);
      } else {
        res.status(409).json({ success: 0, error: `This Category is already exists` });

      }
    } catch (err) {
      res.status(400).json({ success: 0, error: `Error while creating category : ${err}` });

    }

  });

  router.put("/:id", async (req: Request, res: Response) => {
    const data = await service.update(Number(req.params.id), req.body);
    res.json(data);
  });

  router.delete("/:id", async (req: Request, res: Response) => {
    await service.delete(Number(req.params.id));
    res.status(204).send();
  });

  return router;
};
