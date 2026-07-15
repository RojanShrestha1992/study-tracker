import StudySession from '../models/StudySession.js'
import Subject from '../models/Subject.js'
import Task from '../models/Task.js'
import User from '../models/User.js'
import { addXP } from '../utils/xpUtils.js'
import { updateStreak } from '../utils/streakUtils.js'
import { checkAndUnlockBadges } from '../utils/badgeUtils.js'

function isFirstSessionOfDay(user) {
  if (!user.lastStudyDate) {
    return true
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const lastDate = new Date(user.lastStudyDate)
  lastDate.setHours(0, 0, 0, 0)

  return today.getTime() !== lastDate.getTime()
}

export async function createSession(req, res, next) {
  try {
    const { subjectId, taskId, duration } = req.body

    if (!subjectId || !duration) {
      return res.status(400).json({ message: 'subjectId and duration are required' })
    }

    const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id })
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' })
    }

    if (taskId) {
      const task = await Task.findOne({ _id: taskId, userId: req.user._id })
      if (!task) {
        return res.status(404).json({ message: 'Task not found' })
      }
    }

    const user = await User.findById(req.user._id)
    const baseXP = Number(duration) * 10
    const bonusXP = isFirstSessionOfDay(user) ? 50 : 0
    const totalXpEarned = baseXP + bonusXP

    const session = await StudySession.create({
      userId: req.user._id,
      subjectId,
      taskId: taskId || null,
      duration,
      xpEarned: totalXpEarned,
      completedAt: new Date(),
    })

    const xpResult = await addXP(req.user._id, totalXpEarned)
    const streakResult = await updateStreak(req.user._id)
    const newlyUnlockedBadges = await checkAndUnlockBadges(req.user._id, {
      completedAt: session.completedAt,
      perfectPomodoro: false,
    })

    res.status(201).json({
      session,
      xpEarned: totalXpEarned,
      bonusXP: bonusXP,
      newlyUnlockedBadges,
      leveledUp: xpResult.leveledUp,
      newLevel: xpResult.newLevel,
      currentStreak: streakResult.currentStreak,
    })
  } catch (error) {
    next(error)
  }
}

export async function getSessions(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))
    const skip = (page - 1) * limit

    const sessions = await StudySession.find({ userId: req.user._id })
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('subjectId')
      .populate('taskId')

    const total = await StudySession.countDocuments({ userId: req.user._id })

    res.json({ sessions, page, limit, total })
  } catch (error) {
    next(error)
  }
}

export async function getRecentSessions(req, res, next) {
  try {
    const sessions = await StudySession.find({ userId: req.user._id })
      .sort({ completedAt: -1 })
      .limit(5)
      .populate('subjectId')
      .populate('taskId')

    res.json({ sessions })
  } catch (error) {
    next(error)
  }
}
