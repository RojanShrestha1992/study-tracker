import { Router } from 'express'
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../controllers/subjectController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', requireAuth, getSubjects)
router.post('/', requireAuth, createSubject)
router.put('/:id', requireAuth, updateSubject)
router.delete('/:id', requireAuth, deleteSubject)

export default router
