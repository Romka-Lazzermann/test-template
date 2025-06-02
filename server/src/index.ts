import 'reflect-metadata'
import express from 'express'
import { AppDataSource } from '../ormconfig'
import {createBlogRoutes} from './controllers/blog'

const app = express()
app.use(express.json())

AppDataSource.initialize().then(() => {
  console.log('Data Source has been initialized!')
  app.use('/blogs', createBlogRoutes(AppDataSource))

  app.listen(3000, () => {
    console.log('Server is running on port 3000')
  })
}).catch((err) => {
  console.error('Error during Data Source initialization:', err)
})
