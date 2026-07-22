import mongoose from 'mongoose'

let cachedConnection = globalThis.__studyMitraMongoConnection
let cachedPromise = globalThis.__studyMitraMongoPromise

async function connectDB() {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined')
  }

  if (cachedConnection) {
    return cachedConnection
  }

  if (!cachedPromise) {
    // Reuse the same connection promise across cold starts and warm invocations.
    cachedPromise = mongoose.connect(mongoUri)
  }

  // strictQuery=true helps avoid ambiguous query behavior.
  mongoose.set('strictQuery', true)

  // Open one shared MongoDB connection for the entire app.
  cachedConnection = await cachedPromise
  globalThis.__studyMitraMongoConnection = cachedConnection
  globalThis.__studyMitraMongoPromise = cachedPromise
  console.log('MongoDB connected')

  return cachedConnection
}

export default connectDB