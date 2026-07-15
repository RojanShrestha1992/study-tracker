import Badge from '../models/Badge.js'
import UserBadge from '../models/UserBadge.js'
import User from '../models/User.js'
import StudySession from '../models/StudySession.js'
import Task from '../models/Task.js'

export async function getAllBadges(_req, res, next) {
  try {
    const badges = await Badge.find({}).sort({ category: 1, name: 1 })
    res.json({ badges })
  } catch (error) {
    next(error)
  }
}

export async function getMyBadges(req, res, next) {
  try {
    const userId = req.user._id
    const badges = await Badge.find({}).sort({ category: 1, name: 1 })
    const unlockedEntries = await UserBadge.find({ userId }).lean()
    const unlockedKeys = new Set(unlockedEntries.map((entry) => entry.badgeKey))
    const user = await User.findById(userId)
    const sessions = await StudySession.find({ userId })
    const tasks = await Task.find({ userId, status: 'completed' })

    const payload = badges.map((badge) => {
      let current = 0
      const target = badge.condition?.value || 0

      switch (badge.condition?.type) {
        case 'streak':
          current = user?.currentStreak || 0
          break
        case 'session_count':
          current = sessions.length
          break
        case 'total_time':
          current = sessions.reduce((sum, session) => sum + Number(session.duration || 0), 0)
          break
        case 'task_count':
          current = tasks.length
          break
        default:
          current = 0
      }

      return {
        badge,
        unlocked: unlockedKeys.has(badge.key),
        unlockedAt: unlockedEntries.find((entry) => entry.badgeKey === badge.key)?.unlockedAt || null,
        progress: {
          current,
          target,
        },
      }
    })

    res.json({ badges: payload })
  } catch (error) {
    next(error)
  }
}
