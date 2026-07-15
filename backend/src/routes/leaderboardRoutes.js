import { Router } from 'express'
import { getLeaderboard, getMyRank } from '../controllers/leaderboardController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', getLeaderboard)
router.get('/me/rank', requireAuth, getMyRank)

export default router
