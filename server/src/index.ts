import 'reflect-metadata'
import express from 'express'
import { AppDataSource } from '../ormconfig'
import {createBlogRoutes} from './routes/blog'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000;
AppDataSource.initialize().then(() => {
  console.log('Data Source has been initialized!')
  app.use('/blogs', createBlogRoutes(AppDataSource))

  app.listen(PORT, () => {
    console.log('Server is running on port ', PORT)
  })
}).catch((err) => {
  console.error('Error during Data Source initialization:', err)
})
