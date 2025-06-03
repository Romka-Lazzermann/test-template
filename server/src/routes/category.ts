import { Router } from "express";
import { CategoryService } from "../services/CategoryService";
import { DataSource } from "typeorm";
import { Category } from "../entity/CategoryModel";
import { Request, Response } from 'express';

export const createCategoryRoutes = (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Category);
  const service = new CategoryService(repo);
  const router = Router();
  

  router.get("/", async (req : Request, res: Response) => {
    const data = await service.findAll();
    res.json(data);
  });

  router.get("/:id", async (req : Request, res: Response) => {
    const data = await service.findOne(Number(req.params.id));
    if (!data){
        res.status(404).json({ message: "Not found" });
        return
    }  
    res.json(data);
  });

  router.post("/", async (req : Request, res: Response) => {
    const data = await service.create(req.body);
    res.status(201).json(data);
  });

  router.put("/:id", async (req : Request, res: Response) => {
    const data = await service.update(Number(req.params.id), req.body);
    res.json(data);
  });

  router.delete("/:id", async (req : Request, res: Response) => {
    await service.delete(Number(req.params.id));
    res.status(204).send();
  });

  return router;
};
