import Task from '../models/Task.js'
import Subject from '../models/Subject.js'
import { addXP } from '../utils/xpUtils.js'
import { checkAndUnlockBadges } from '../utils/badgeUtils.js'
import { updateStreak } from '../utils/streakUtils.js'

export async function getTasks(req, res, next) {
  try {
    const tasks = await Task.find({ userId: req.user._id }).populate('subjectId').sort({ createdAt: -1 })
    res.json({ tasks })
  } catch (error) {
    next(error)
  }
}

export async function createTask(req, res, next) {
  try {
    const { subjectId, title } = req.body

    if (!subjectId || !title) {
      return res.status(400).json({ message: 'Subject and title are required' })
    }

    const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id })
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' })
    }

    const task = await Task.create({
      userId: req.user._id,
      subjectId,
      title,
    })

    res.status(201).json({ task })
  } catch (error) {
    next(error)
  }
}

export async function completeTask(req, res, next) {
  try {
    const { id } = req.params
    const task = await Task.findOne({ _id: id, userId: req.user._id })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.status === 'completed') {
      return res.status(400).json({ message: 'Task is already completed' })
    }

    task.status = 'completed'
    task.completedAt = new Date()
    await task.save()

    const xpResult = await addXP(req.user._id, task.xpReward || 100)
    const newlyUnlockedBadges = await checkAndUnlockBadges(req.user._id, {
      completedAt: task.completedAt,
      perfectPomodoro: false,
    })

    res.json({
      task,
      xpEarned: task.xpReward || 100,
      newlyUnlockedBadges,
      leveledUp: xpResult.leveledUp,
      newLevel: xpResult.newLevel,
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params
    const task = await Task.findOne({ _id: id, userId: req.user._id })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    await Task.deleteOne({ _id: id, userId: req.user._id })
    res.json({ message: 'Task deleted' })
  } catch (error) {
    next(error)
  }
}
