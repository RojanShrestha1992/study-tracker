import app from '../src/app.js'
import connectDB from '../src/config/db.js'

let connectionReady = false
let connectionPromise = null

async function ensureDatabaseConnection() {
  if (connectionReady) {
    return
  }

  if (!connectionPromise) {
    connectionPromise = connectDB().then(() => {
      connectionReady = true
    })
  }

  await connectionPromise
}

export default async function handler(req, res) {
  await ensureDatabaseConnection()
  return app(req, res)
}