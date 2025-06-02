import { Router } from 'express';
import { DataSource } from 'typeorm';
import { BlogService } from '../services/BlogService';

const router = Router();

export const createBlogRoutes = (dataSource) => {
  const blogService = new BlogService(dataSource);

  
  router.post('/', async (req, res) => {
    try {
      const blog = await blogService.create(req.body);
      res.status(201).json(blog);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  
  router.get('/', async (_req, res) => {
    const blogs = await blogService.findAll();
    res.json(blogs);
  });

//   // Read one
//   router.get('/:id', async (req, res) => {
//     const blog = await blogService.findOne(Number(req.params.id));
//     if (!blog) return res.status(404).json({ message: 'Blog not found' });
//     res.json(blog);
//   });

//   // Update
//   router.put('/:id', async (req, res) => {
//     try {
//       const updated = await blogService.update(Number(req.params.id), req.body);
//       if (!updated) return res.status(404).json({ message: 'Blog not found' });
//       res.json(updated);
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   });

//   // Delete
//   router.delete('/:id', async (req, res) => {
//     const deleted = await blogService.remove(Number(req.params.id));
//     if (!deleted) return res.status(404).json({ message: 'Blog not found' });
//     res.status(204).send();
//   });

  return router;
};
