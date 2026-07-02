import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const app = express()

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

// Allow the frontend app to call this API from the configured origin.
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
)

// Parse cookies so we can read the JWT cookie
app.use(cookieParser())

// Parse incoming JSON request bodies into req.body.
app.use(express.json())

// Simple health check endpoint for quick server status testing.
app.get('/api/health', (_req, res) => {
  res.json({ message: 'API is healthy' })
})

// Authentication routes for the frontend forms.
app.use('/api/auth', authRoutes)

// If no route matched, create a 404 error.
app.use(notFound)

// Final centralized error formatter for all thrown/forwarded errors.
app.use(errorHandler)

export default app