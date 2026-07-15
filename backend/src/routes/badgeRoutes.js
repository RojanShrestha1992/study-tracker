import { Router } from 'express'
import { getAllBadges, getMyBadges } from '../controllers/badgeController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', getAllBadges)
router.get('/me', requireAuth, getMyBadges)

export default router
