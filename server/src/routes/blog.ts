import { Router } from 'express';
import { DataSource } from 'typeorm';
import { BlogService } from '../services/BlogService';
import { Request, Response } from 'express';
const router = Router();

export const createBlogRoutes = (dataSource) => {
  const blogService = new BlogService(dataSource);

  
  router.post('/', async (req : Request, res : Response) => {
    try {
      const blog = await blogService.create(req.body);
      res.status(201).json(blog);
    } catch (err) {
      console.log("Error message : ", err.message)
      res.status(400).json({ error: err.message });
    }
  });

  
  router.get('/', async (_req : Request, res : Response) => {
    const blogs = await blogService.findAll();
    res.json(blogs);
  });

  router.get('/:id', async (req : Request, res : Response) => {
    const blog = await blogService.findOne(Number(req.params.id));
    if (!blog){
      res.status(404).json({ message: 'Blog not found' });
      return 
    } 
    res.json(blog);
  });

  router.put('/:id', async (req : Request, res : Response) => {
    try {
      const updated = await blogService.update(Number(req.params.id), req.body);
      if (!updated) {
        res.status(404).json({ message: 'Blog not found' });
        return
      }
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req : Request, res : Response) => {
    const deleted = await blogService.remove(Number(req.params.id));
    if (!deleted){
      res.status(404).json({ message: 'Blog not found' });
      return
    } 
    res.status(204).json({
      deleted: 1,
      message: "Blog has been deleted successfully"
    });
  });

  return router;
};
