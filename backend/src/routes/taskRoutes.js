import { Router } from 'express'
import { getTasks, createTask, completeTask, deleteTask } from '../controllers/taskController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', requireAuth, getTasks)
router.post('/', requireAuth, createTask)
router.put('/:id/complete', requireAuth, completeTask)
router.delete('/:id', requireAuth, deleteTask)

export default router
