import 'reflect-metadata'
import { container } from 'tsyringe'
import express from 'express'
import { AppDataSource } from './ormconfig'
import {UserDbDataSource} from './dbusersconfig'
import {createBlogRoutes} from './routes/blog'
import {createAuthRoutes} from './routes/auth'
import { createCategoryRoutes } from './routes/category'
import { createChannelRoutes } from './routes/channel'
import { createStyleRoutes } from './routes/style'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import './container'
dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000;

Promise.all([AppDataSource.initialize(), UserDbDataSource.initialize()]).then(() => {
  container.registerInstance('AppDataSource', AppDataSource);
  container.registerInstance('UserDbDataSource', UserDbDataSource);

  console.log('Data Source has been initialized!')
  app.use('/assets', express.static('assets'))
  app.use(bodyParser.json())
  
  app.use('/auth', createAuthRoutes())
  app.use('/blogs', createBlogRoutes())
  app.use('/categories', createCategoryRoutes())
  app.use('/channels', createChannelRoutes())
  app.use('/styles', createStyleRoutes())
  

  app.listen(PORT, () => {
    console.log('Server is running on port ', PORT)
  })
}).catch((err) => {
  console.error('Error during Data Source initialization:', err)
})
