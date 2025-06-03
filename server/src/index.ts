import 'reflect-metadata'
import express from 'express'
import { AppDataSource } from '../ormconfig'
import {createBlogRoutes} from './routes/blog'
import { createCategoryRoutes } from './routes/category'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

dotenv.config();
const app = express()

const PORT = process.env.PORT || 3000;
AppDataSource.initialize().then(() => {
  console.log('Data Source has been initialized!')
  app.use('/assets', express.static('assets'))
  
  app.use('/blogs', createBlogRoutes(AppDataSource))
  app.use('/category', createCategoryRoutes(AppDataSource))

  app.use(bodyParser.json())

  app.listen(PORT, () => {
    console.log('Server is running on port ', PORT)
  })
}).catch((err) => {
  console.error('Error during Data Source initialization:', err)
})
