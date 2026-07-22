import { Router } from 'express'
import { getMe, updateUsername, deleteAccount, updateSettings, updateAvatar, getStats } from '../controllers/userController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/me', requireAuth, getMe)
router.put('/me', requireAuth, updateUsername)
router.delete('/me', requireAuth, deleteAccount)
router.put('/me/settings', requireAuth, updateSettings)
router.put('/me/avatar', requireAuth, updateAvatar)
router.get('/me/stats', requireAuth, getStats)

export default router
