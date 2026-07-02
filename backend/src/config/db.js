import mongoose from 'mongoose'

async function connectDB() {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined')
  }

  // strictQuery=true helps avoid ambiguous query behavior.
  mongoose.set('strictQuery', true)

  // Open one shared MongoDB connection for the entire app.
  await mongoose.connect(mongoUri)
  console.log('MongoDB connected')
}

export default connectDB