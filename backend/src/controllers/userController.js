import User from '../models/User.js'
import StudySession from '../models/StudySession.js'
import Task from '../models/Task.js'
import UserBadge from '../models/UserBadge.js'
import Badge from '../models/Badge.js'
import { calculateLevel } from '../utils/xpUtils.js'

function buildLevelPayload(user) {
  const plainUser = user && typeof user.toObject === 'function' ? user.toObject() : user
  const levelData = calculateLevel(plainUser.totalXP || 0)

  return {
    ...plainUser,
    levelInfo: {
      level: levelData.level,
      title: levelData.title,
      currentLevelXP: levelData.currentLevelXP,
      nextLevelXP: levelData.nextLevelXP,
      progress: levelData.progress,
      xpNeededForNext: levelData.xpNeededForNext,
    },
  }
}

export async function getMe(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    const user = await User.findById(req.user._id).lean()
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const payload = buildLevelPayload({ ...user, _id: user._id })
    res.json({ user: payload })
  } catch (error) {
    next(error)
  }
}

export async function updateSettings(req, res, next) {
  try {
    const { workDuration, shortBreak, longBreak, sessionsBeforeLongBreak } = req.body
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (workDuration !== undefined) user.settings.workDuration = workDuration
    if (shortBreak !== undefined) user.settings.shortBreak = shortBreak
    if (longBreak !== undefined) user.settings.longBreak = longBreak
    if (sessionsBeforeLongBreak !== undefined) user.settings.sessionsBeforeLongBreak = sessionsBeforeLongBreak

    await user.save()

    res.json({ message: 'Settings updated', settings: user.settings })
  } catch (error) {
    next(error)
  }
}

export async function updateAvatar(req, res, next) {
  try {
    const { avatar } = req.body
    const allowedAvatars = Array.from({ length: 8 }, (_, index) => `avatar${index + 1}`)

    if (!avatar || !allowedAvatars.includes(avatar)) {
      return res.status(400).json({ message: 'Invalid avatar selection' })
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.avatar = avatar
    await user.save()

    res.json({ message: 'Avatar updated', avatar })
  } catch (error) {
    next(error)
  }
}

export async function getStats(req, res, next) {
  try {
    const userId = req.user._id
    const sessions = await StudySession.find({ userId }).sort({ completedAt: -1 })
    const tasks = await Task.find({ userId, status: 'completed' })
    const badges = await UserBadge.find({ userId })
    const totalStudyTime = sessions.reduce((sum, session) => sum + Number(session.duration || 0), 0)

    const today = new Date()
    const weeklyStudyTime = []

    for (let index = 6; index >= 0; index -= 1) {
      const day = new Date(today)
      day.setDate(today.getDate() - index)
      day.setHours(0, 0, 0, 0)

      const nextDay = new Date(day)
      nextDay.setDate(day.getDate() + 1)

      const total = sessions
        .filter((session) => session.completedAt && session.completedAt >= day && session.completedAt < nextDay)
        .reduce((sum, session) => sum + Number(session.duration || 0), 0)

      weeklyStudyTime.push({ day: day.toISOString().slice(0, 10), minutes: total })
    }

    const recentSessions = sessions.slice(0, 5)
    const totalBadges = await Badge.countDocuments({})

    res.json({
      totalSessions: sessions.length,
      totalStudyTime,
      totalTasksCompleted: tasks.length,
      totalBadges: badges.length,
      weeklyStudyTime,
      recentSessions,
      totalBadgesMasterList: totalBadges,
    })
  } catch (error) {
    next(error)
  }
}
