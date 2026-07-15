import User from '../models/User.js'

export async function getLeaderboard(req, res, next) {
  try {
    const users = await User.find({})
      .select('name avatar totalXP level')
      .sort({ totalXP: -1, level: -1, createdAt: 1 })
      .limit(100)
      .lean()

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.name,
      avatar: user.avatar,
      level: user.level,
      totalXP: user.totalXP,
    }))

    res.json({ leaderboard })
  } catch (error) {
    next(error)
  }
}

export async function getMyRank(req, res, next) {
  try {
    const users = await User.find({})
      .select('name totalXP level')
      .sort({ totalXP: -1, level: -1, createdAt: 1 })
      .lean()

    const rank = users.findIndex((user) => String(user._id) === String(req.user._id)) + 1

    res.json({ rank: rank > 0 ? rank : null, totalUsers: users.length })
  } catch (error) {
    next(error)
  }
}
