import { Router } from 'express';
import { BlogService } from '../services/BlogService';
import { Request, Response } from 'express';
import {upload} from '../middlewares/uploadMiddleware';
import { MulterRequest } from '../interfaces'
import fs from 'fs';
import path from 'path';
import { container } from 'tsyringe'
import {format_seconds_timestamp} from '../helpers/format'
import PQueue from 'p-queue';
import retry from 'async-retry';
import {AIPromtService} from '../services/AIPromtService';


const router = Router();

export const createBlogRoutes = () => {
  const promptQueue = new PQueue({ concurrency: 10 });
  const blogService = container.resolve(BlogService);
  const gemini = container.resolve(AIPromtService);

  const generateBlogContent = (blogId: number, payload: any) => {
          promptQueue.add(() =>
              retry(
                  async () => {
                      const content = await gemini.generateBlogContent(payload);
                      const result = await blogService.addGenerated(blogId, content);
                  },
                  {
                      retries: 3,
                      minTimeout: 1000,
                      onRetry: (err: any, attempt) => {
                          console.warn(`Retry #${attempt} for generateBlogContent:`, err.message);
                      },
                  }
              )
          );
      };

  
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
        create_date: format_seconds_timestamp(blog.time_create, 'YYYY-MM-DD HH:mm:ss'),
        keywords: JSON.parse(blog.keywords),
        sub_description: blog.sub_description,
        category_id: blog.category_id.id,
        status: blog.status 
      }
      generateBlogContent(blog.id, blog.title)
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
        create_date: format_seconds_timestamp(blogs.time_create, 'YYYY-MM-DD HH:mm:ss'),
        keywords: JSON.parse(blogs.keywords),
        sub_description: blogs.sub_description,
        category_id: blogs.category_id.id,
        status: blogs.status

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

  router.post('/:id', upload.single('img'), async (req : any, res : Response) => {
    try {
      const updated = await blogService.update(Number(req.params.id), {
        ...req.body,
        img: req.file ? req.file.path : ""
      });
      if (!updated) {
        res.status(404).json({ message: 'Blog not found' });
        return
      }
      const prepared_data = {
        id: updated.id,
        title: updated.title,
        description: updated.description,
        category: updated.category_id.title,
        create_date: format_seconds_timestamp(updated.time_create, 'YYYY-MM-DD HH:mm:ss'),
        keywords: JSON.parse(updated.keywords),
        sub_description: updated.sub_description,
        category_id: updated.category_id.id
      }
      res.json(prepared_data);
    } catch (err) {
      if(req?.file){
        const filepath = path.join(__dirname, '../..', 'assets', req.file.filename)
        fs.unlink(filepath, (unlinkErr) => {
            if(unlinkErr){
              console.error("Error while deleting file")
            }
        })
      }
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
