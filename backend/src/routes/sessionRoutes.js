import { Router } from 'express'
import { createSession, getSessions, getRecentSessions } from '../controllers/sessionController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/', requireAuth, createSession)
router.get('/', requireAuth, getSessions)
router.get('/recent', requireAuth, getRecentSessions)

export default router
