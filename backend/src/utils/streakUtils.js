import User from '../models/User.js'

function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function isSameDay(first, second) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate()
}

function getYesterday(date) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() - 1)
  return copy
}

async function updateStreak(userId) {
  const user = await User.findById(userId)

  if (!user) {
    throw new Error('User not found')
  }

  const today = startOfDay(new Date())
  const lastStudyDate = user.lastStudyDate ? startOfDay(new Date(user.lastStudyDate)) : null

  if (!lastStudyDate) {
    user.currentStreak = 1
    user.longestStreak = Math.max(user.longestStreak, user.currentStreak)
    user.lastStudyDate = today
  } else if (isSameDay(lastStudyDate, today)) {
    // No change needed when the user already logged a session today.
    user.currentStreak = user.currentStreak || 1
  } else if (isSameDay(getYesterday(today), lastStudyDate)) {
    user.currentStreak += 1
    user.longestStreak = Math.max(user.longestStreak, user.currentStreak)
    user.lastStudyDate = today
  } else {
    user.currentStreak = 1
    user.longestStreak = Math.max(user.longestStreak, user.currentStreak)
    user.lastStudyDate = today
  }

  await user.save()

  return {
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
  }
}

export { updateStreak }
export default { updateStreak }
