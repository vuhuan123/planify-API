/* eslint-disable no-console */
import express from 'express'
import { env } from './config/environment'
import { APIs_V1 } from '~/routes/v1'
import { connectDB, closeDB } from './config/mongodb'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cors from 'cors'
import { corsOptions } from './config/cors'
const START_SERVER = () => {
  const app = express()
  // app.use(cors()) // enable CORS for all routes
  app.use(cors(corsOptions)) // enable CORS for a routes
// enable req.body json data parsing
  app.use(express.json())
  app.use('/v1', APIs_V1)

  //error handling middleware
  app.use(errorHandlingMiddleware)
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hi ${env.AUTHOR} .I am running at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  process.on('SIGINT', async () => {
    console.log('"Closing MongoDB connection..."')
    await closeDB()
    process.exit(0)
})

}

connectDB()
  .then(() => console.log('MongoDB connected successfully'))
  .then(() => { START_SERVER() })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
    process.exit(0)
  })