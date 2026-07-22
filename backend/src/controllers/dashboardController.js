import User from '../models/User.js'
import StudySession from '../models/StudySession.js'
import Task from '../models/Task.js'
import Badge from '../models/Badge.js'
import UserBadge from '../models/UserBadge.js'

function getUTCDateParts(date = new Date()) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
  }
}

function toUTCISODate(date) {
  const { year, month, day } = getUTCDateParts(date)
  const d = new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
  return d.toISOString().slice(0, 10)
}

function getStartOfUTCDay(date = new Date()) {
  const { year, month, day } = getUTCDateParts(date)
  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
}

export async function getDashboard(req, res, next) {
  try {
    const userId = req.user._id

    const now = new Date()
    const todayStart = getStartOfUTCDay(now)

    const tomorrowStart = new Date(todayStart)
    tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1)

    const sevenDaysAgoStart = new Date(todayStart)
    sevenDaysAgoStart.setUTCDate(sevenDaysAgoStart.getUTCDate() - 6)

    const [user, todaySessions, recentSessions, pendingTasks, recentUnlockedSafe] = await Promise.all([
      User.findById(userId)
        .select('name totalXP currentStreak longestStreak level avatar')
        .lean(),

      StudySession.find({
        userId,
        completedAt: { $gte: todayStart, $lt: tomorrowStart },
      })
        .populate('subjectId')
        .sort({ completedAt: -1 }),

      StudySession.find({ userId })
        .sort({ completedAt: -1 })
        .limit(5)
        .populate('subjectId'),

      Task.find({
        userId,
        status: { $ne: 'completed' },
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('subjectId'),

      UserBadge.find({ userId })
        .sort({ unlockedAt: -1 })
        .limit(4)
        .lean(),
    ])

    const todaySessionsCount = todaySessions.length
    const todayStudyMinutes = todaySessions.reduce((sum, s) => sum + Number(s.duration || 0), 0)

    // weeklyStudyData: 7 objects oldest -> newest (UTC), including today
    const weeklyStudyData = Array.from({ length: 7 }, (_, idx) => {
      const dayOffset = 6 - idx
      const d = new Date(todayStart)
      d.setUTCDate(d.getUTCDate() - dayOffset)

      const date = toUTCISODate(d)
      const weekday = d.toLocaleDateString('en-US', {
        weekday: 'short',
        timeZone: 'UTC',
      })

      const day = weekday.replace('.', '')

      return { day, date, minutes: 0 }
    })

    const weekSessions = await StudySession.find({
      userId,
      completedAt: { $gte: sevenDaysAgoStart, $lt: tomorrowStart },
    })
      .select('duration completedAt')
      .lean()

    const minutesByISODate = new Map()
    for (const s of weekSessions) {
      if (!s.completedAt) continue
      const iso = toUTCISODate(new Date(s.completedAt))
      minutesByISODate.set(iso, (minutesByISODate.get(iso) || 0) + Number(s.duration || 0))
    }

    for (const entry of weeklyStudyData) {
      entry.minutes = minutesByISODate.get(entry.date) || 0
    }

    const todayTasks = pendingTasks.map((t) => ({
      _id: t._id,
      title: t.title,
      subject: t.subjectId
        ? { name: t.subjectId.name, color: t.subjectId.color, icon: t.subjectId.icon }
        : null,
      xpReward: t.xpReward,
    }))

    const recentSessionsPayload = recentSessions.map((s) => ({
      _id: s._id,
      subject: s.subjectId
        ? { name: s.subjectId.name, color: s.subjectId.color, icon: s.subjectId.icon }
        : null,
      duration: s.duration,
      completedAt: s.completedAt,
    }))

    const badgeKeys = recentUnlockedSafe.map((x) => x.badgeKey)
    const badges = badgeKeys.length
      ? await Badge.find({ key: { $in: badgeKeys } }).lean()
      : []

    const badgeByKey = new Map(badges.map((b) => [b.key, b]))

    const recentBadges = recentUnlockedSafe
      .map((ub) => {
        const b = badgeByKey.get(ub.badgeKey)
        return b
          ? {
              key: b.key,
              name: b.name,
              icon: b.icon,
              unlockedAt: ub.unlockedAt,
            }
          : null
      })
      .filter(Boolean)

    res.json({
      success: true,
      data: {
        user,
        todaySessionsCount,
        todayStudyMinutes,
        weeklyStudyData,
        todayTasks,
        recentSessions: recentSessionsPayload,
        recentBadges,
      },
    })
  } catch (error) {
    next(error)
  }
}

