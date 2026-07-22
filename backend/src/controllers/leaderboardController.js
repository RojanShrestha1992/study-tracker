import User from '../models/User.js'

function getLevelTitle(level) {
  const numericLevel = Number(level || 1)

  if (numericLevel >= 20) return 'Grandmaster'
  if (numericLevel >= 10) return 'Master'
  if (numericLevel >= 9) return 'Expert'
  if (numericLevel >= 8) return 'Thinker'
  if (numericLevel >= 7) return 'Intellectual'
  if (numericLevel >= 6) return 'Scholar'
  if (numericLevel >= 5) return 'Learner'
  if (numericLevel >= 4) return 'Student'
  if (numericLevel >= 3) return 'Apprentice'
  if (numericLevel >= 2) return 'Novice'
  return 'Beginner'
}

function formatLeaderboardUser(user, rank) {
  return {
    rank,
    userId: String(user._id),
    username: user.name,
    avatar: user.avatar,
    level: user.level,
    levelTitle: getLevelTitle(user.level),
    totalXP: user.totalXP || 0,
  }
}

export async function getLeaderboard(req, res, next) {
  try {
    const skip = Math.max(0, Number.parseInt(req.query.skip || '0', 10) || 0)
    const limit = Math.max(1, Number.parseInt(req.query.limit || '20', 10) || 20)

    const [totalUsers, users] = await Promise.all([
      User.countDocuments({}),
      User.find({})
        .select('name avatar totalXP level createdAt')
      .sort({ totalXP: -1, level: -1, createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ])

    let currentUser = null

    if (skip === 0 && req.user) {
      const currentUserData = req.user.toObject ? req.user.toObject() : req.user
      const aheadCount = await User.countDocuments({
        $or: [
          { totalXP: { $gt: currentUserData.totalXP || 0 } },
          {
            totalXP: currentUserData.totalXP || 0,
            level: { $gt: currentUserData.level || 1 },
          },
          {
            totalXP: currentUserData.totalXP || 0,
            level: currentUserData.level || 1,
            createdAt: { $lt: currentUserData.createdAt },
          },
        ],
      })

      currentUser = formatLeaderboardUser(currentUserData, aheadCount + 1)
    }

    const leaderboard = users.map((user, index) => formatLeaderboardUser(user, skip + index + 1))

    res.json({
      success: true,
      leaderboard,
      totalUsers,
      ...(currentUser ? { currentUser } : {}),
    })
  } catch (error) {
    next(error)
  }
}

export async function getMyRank(req, res, next) {
  try {
    const users = await User.find({})
      .select('name totalXP level createdAt')
      .sort({ totalXP: -1, level: -1, createdAt: 1 })
      .lean()

    const rank = users.findIndex((user) => String(user._id) === String(req.user._id)) + 1

    res.json({ rank: rank > 0 ? rank : null, totalUsers: users.length })
  } catch (error) {
    next(error)
  }
}
