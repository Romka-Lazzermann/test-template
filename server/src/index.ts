import 'reflect-metadata'
import express from 'express'
import { AppDataSource } from '../ormconfig'
import {UserDbDataSource} from '../dbusersconfig'
import {createBlogRoutes} from './routes/blog'
import {createAuthRoutes} from './routes/auth'
import { createCategoryRoutes } from './routes/category'
import bodyParser from 'body-parser'
import 'dotenv/config';

const app = express()

const PORT = process.env.PORT || 3000;
Promise.all([AppDataSource.initialize(), UserDbDataSource.initialize()]).then(() => {
  console.log('Data Source has been initialized!')
  app.use('/assets', express.static('assets'))
  app.use(bodyParser.json())
  
  app.use('/auth', createAuthRoutes(UserDbDataSource))
  app.use('/blogs', createBlogRoutes(AppDataSource))
  app.use('/category', createCategoryRoutes(AppDataSource))

  

  app.listen(PORT, () => {
    console.log('Server is running on port ', PORT)
  })
}).catch((err) => {
  console.error('Error during Data Source initialization:', err)
})
