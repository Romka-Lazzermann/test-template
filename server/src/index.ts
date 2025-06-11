import 'reflect-metadata'
import { container } from 'tsyringe'
import express from 'express'
import { AppDataSource } from './ormconfig'
import { UserDbDataSource } from './dbusersconfig'
import { createBlogRoutes } from './routes/blog'
import { createAuthRoutes } from './routes/auth'
import { createCategoryRoutes } from './routes/category'
import { createChannelRoutes } from './routes/channel'
import { createStyleRoutes } from './routes/style'
import { createLinkRoutes } from './routes/links'
import { createPublicBlogRoutes } from './routes/public_blog'
import { createPublicCategoryRoutes } from './routes/public_category'
import { createGoogleRoutes } from './routes/public_google'
import {post_back_job} from './jobs/send_postback_job'
import {free_combinations_job} from './jobs/free_combinations_job'


import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import './container'
import { authenticateToken } from './middlewares/authMiddleware'
dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000;

Promise.all([AppDataSource.initialize(), UserDbDataSource.initialize()]).then(() => {
  container.registerInstance('AppDataSource', AppDataSource);
  container.registerInstance('UserDbDataSource', UserDbDataSource);

  console.log('Data Source has been initialized!')
  app.use('/assets', express.static('assets'))
  app.use(bodyParser.json())
  app.use('/api', express.Router()
    .use('/public', express.Router()
      .use('/blogs', createPublicBlogRoutes())
      .use('/categories', createPublicCategoryRoutes())
      .use('/search', createGoogleRoutes())
    )
    .use('/', createLinkRoutes())
    .use('/auth', createAuthRoutes())
    .use('/blogs', authenticateToken, createBlogRoutes())
    .use('/categories', authenticateToken, createCategoryRoutes())
    .use('/channels', authenticateToken, createChannelRoutes())
    .use('/styles', authenticateToken, createStyleRoutes())
  )



  app.listen(PORT, () => {
    console.log('Server is running on port ', PORT)
  })
  post_back_job.start()
  free_combinations_job.start()
}).catch((err) => {
  console.error('Error during Data Source initialization:', err)
})
