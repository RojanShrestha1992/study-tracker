import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import subjectRoutes from './routes/subjectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js'
import badgeRoutes from './routes/badgeRoutes.js'
import leaderboardRoutes from './routes/leaderboardRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
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
app.use('/api/user', userRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/badges', badgeRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/dashboard', dashboardRoutes)

// If no route matched, create a 404 error.
app.use(notFound)

// Final centralized error formatter for all thrown/forwarded errors.
app.use(errorHandler)

export default app

