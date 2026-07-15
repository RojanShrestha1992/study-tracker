import Badge from '../models/Badge.js'
import UserBadge from '../models/UserBadge.js'
import StudySession from '../models/StudySession.js'
import Task from '../models/Task.js'
import User from '../models/User.js'

function getDayKey(date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy.toISOString().slice(0, 10)
}

async function checkAndUnlockBadges(userId, context = {}) {
  const user = await User.findById(userId)

  if (!user) {
    throw new Error('User not found')
  }

  const badges = await Badge.find({})
  const unlockedBadges = await UserBadge.find({ userId }).lean()
  const unlockedKeys = new Set(unlockedBadges.map((entry) => entry.badgeKey))

  const sessions = await StudySession.find({ userId })
  const tasks = await Task.find({ userId, status: 'completed' })

  const stats = {
    streak: user.currentStreak,
    sessionsCount: sessions.length,
    totalTime: sessions.reduce((sum, session) => sum + Number(session.duration || 0), 0),
    taskCount: tasks.length,
    totalXP: user.totalXP,
    level: user.level,
  }

  const newlyUnlocked = []

  for (const badge of badges) {
    if (unlockedKeys.has(badge.key)) {
      continue
    }

    let isUnlocked = false

    switch (badge.condition?.type) {
      case 'streak':
        isUnlocked = stats.streak >= Number(badge.condition.value || 0)
        break
      case 'session_count':
        isUnlocked = stats.sessionsCount >= Number(badge.condition.value || 0)
        break
      case 'total_time':
        isUnlocked = stats.totalTime >= Number(badge.condition.value || 0)
        break
      case 'task_count':
        isUnlocked = stats.taskCount >= Number(badge.condition.value || 0)
        break
      case 'special':
        isUnlocked = checkSpecialBadge(badge, context, stats, sessions)
        break
      default:
        isUnlocked = false
    }

    if (isUnlocked) {
      await UserBadge.create({ userId, badgeKey: badge.key })
      newlyUnlocked.push({ key: badge.key, name: badge.name, icon: badge.icon })
    }
  }

  return newlyUnlocked
}

function checkSpecialBadge(badge, context, stats, sessions) {
  if (badge.key === 'night_owl') {
    return context.completedAt ? new Date(context.completedAt).getHours() >= 22 : false
  }

  if (badge.key === 'early_bird') {
    return context.completedAt ? new Date(context.completedAt).getHours() < 7 : false
  }

  if (badge.key === 'marathon') {
    const dayKey = context.completedAt ? getDayKey(context.completedAt) : null
    if (!dayKey) return false
    const sameDaySessions = sessions.filter((session) => getDayKey(session.completedAt) === dayKey)
    return sameDaySessions.length >= 4
  }

  if (badge.key === 'xp_5000') {
    return stats.totalXP >= 5000
  }

  if (badge.key === 'first_subject') {
    return stats.sessionsCount >= 1
  }

  if (badge.key === 'first_task') {
    return stats.taskCount >= 1
  }

  if (badge.key === 'level_5') {
    return stats.level >= 5
  }

  if (badge.key === 'level_10') {
    return stats.level >= 10
  }

  if (badge.key === 'perfect_pomodoro') {
    return Boolean(context.perfectPomodoro)
  }

  if (badge.key === 'streak_saver') {
    return stats.streak >= 2
  }

  return false
}

export { checkAndUnlockBadges }
export default { checkAndUnlockBadges }
