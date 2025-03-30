import { env } from './environment'
import { MongoClient, ServerApiVersion } from 'mongodb'
let planyfiDB = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

export const connectDB = async () => {
    await mongoClientInstance.connect()
    planyfiDB = mongoClientInstance.db(env.DATABASE_NAME)
}

export const getDB = () => {
    if (!planyfiDB) {
        throw new Error('Database not initialized. Call connectDB() first.')
    }
    return planyfiDB
}

export const closeDB = async () => {
    await mongoClientInstance.close()
    }