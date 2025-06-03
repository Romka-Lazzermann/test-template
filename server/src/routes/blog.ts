import { Router } from 'express';
import { BlogService } from '../services/BlogService';
import { Request, Response } from 'express';
import { upload } from '../middlewares/uploadMiddleware';
import { MulterRequest } from '../interfaces'
import fs from 'fs';
import path from 'path';

const router = Router();

export const createBlogRoutes = (dataSource) => {
  const blogService = new BlogService(dataSource);
  
  router.post('/', upload.single('img'), async (req : MulterRequest | Request, res ) => {
    try {
      const { title, description, category_id, status } = req.body;
      const blog = await blogService.create({
        title,
        description,
        category_id,
        status,
        img: req.file ? req.file.path : ""
      });
      res.status(201).json(blog);
    } catch (err) {
      if(req?.file){
        const filepath = path.join(__dirname, '../..', 'assets', req.file.filename)
        fs.unlink(filepath, (unlinkErr) => {
            if(unlinkErr){
              console.error("Error while deleting file")
            }
        })
      }
      console.log("Error message : ", err.message)
      res.status(400).json({ success: 0, error: "Error while creating a blog" });
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
