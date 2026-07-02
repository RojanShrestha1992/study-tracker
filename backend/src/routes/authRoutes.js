import { Router } from 'express'
import { loginUser, registerUser, logoutUser, getMe } from '../controllers/authController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

// Create a new user account.
router.post('/register', registerUser)

// Verify user credentials and set auth cookie.
router.post('/login', loginUser)

// Clear authentication cookie.
router.post('/logout', logoutUser)

// Return the current logged-in user (protected).
router.get('/me', requireAuth, getMe)

export default router