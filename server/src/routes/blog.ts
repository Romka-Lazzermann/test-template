import { Router } from 'express';
import { BlogService } from '../services/BlogService';
import { Request, Response } from 'express';
import {upload} from '../middlewares/uploadMiddleware';
import { MulterRequest } from '../interfaces'
import fs from 'fs';
import path from 'path';
import { container } from 'tsyringe'

const router = Router();

export const createBlogRoutes = () => {
  const blogService = container.resolve(BlogService);
  
  router.post('/', upload.single('img'), async (req : MulterRequest | Request, res ) => {
    try {
      const blog :any = await blogService.create({
        ...req.body,
        img: req.file ? req.file.path : ""
      });
      const prepared_data = {
        id: blog.id,
        title: blog.title,
        description: blog.description,
        category: blog.category_id.title,
        create_date: blog.time_create,
        keywords: JSON.parse(blog.keywords)
      }
    
      res.status(201).json(prepared_data);
    } catch (err) {
      if(req?.file){
        const filepath = path.join(__dirname, '../..', 'assets', req.file.filename)
        fs.unlink(filepath, (unlinkErr) => {
            if(unlinkErr){
              console.error("Error while deleting file")
            }
        })
      }
      res.status(400).json({ success: 0, error: `Error while creating a blog : ${err}` });
    }
  });

  
  router.get('/', async (_req : Request, res : Response) => {
    const blogs = await blogService.findAll();
    const prepared_data = blogs.map((blogs) => {
      return {
        id: blogs.id,
        title: blogs.title,
        description: blogs.description,
        category: blogs.category_id.title,
        create_date: blogs.time_create,
        keywords: JSON.parse(blogs.keywords)
      }
    })
    res.json(prepared_data);
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
