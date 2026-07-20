import 'dotenv/config'
import connectDB from './config/db.js'
import app from './app.js'

// Use the .env value when available, otherwise run on 5000.
const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    // Do not accept API requests until MongoDB is connected.
    await connectDB()

    // Start the HTTP server after all startup dependencies are ready.
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    // Exit with a failure code so deployment tools can detect startup failure.
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()

