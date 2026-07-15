const LEVEL_THRESHOLDS = [
  0, 500, 1200, 2000, 3000, 4200, 5600, 7200, 9000, 11000,
  13200, 15600, 18200, 21000, 24000, 27200, 30600, 34200, 38000, 42000,
]

const LEVEL_TITLES = [
  'Beginner',
  'Novice',
  'Apprentice',
  'Student',
  'Learner',
  'Scholar',
  'Intellectual',
  'Thinker',
  'Expert',
  'Master',
  'Grandmaster',
  'Legend',
  'Champion',
  'Hero',
  'Virtuoso',
  'Ace',
  'Sage',
  'Oracle',
  'Architect',
  'Legendary',
]

import User from '../models/User.js'

function calculateLevel(totalXP) {
  let level = 1

  while (level < LEVEL_THRESHOLDS.length && totalXP >= LEVEL_THRESHOLDS[level]) {
    level += 1
  }

  const currentLevelXP = LEVEL_THRESHOLDS[level - 1] || 0
  const nextLevelXP = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const xpInCurrentLevel = totalXP - currentLevelXP
  const xpNeededForNext = Math.max(nextLevelXP - totalXP, 0)
  const progress = nextLevelXP === currentLevelXP
    ? 100
    : Math.min(100, Math.max(0, (xpInCurrentLevel / (nextLevelXP - currentLevelXP)) * 100))

  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    currentLevelXP,
    nextLevelXP,
    progress,
    xpNeededForNext,
  }
}

async function addXP(userId, amount) {
  const user = await User.findById(userId)

  if (!user) {
    throw new Error('User not found')
  }

  const previousLevel = user.level
  const previousXP = user.totalXP
  const newXP = previousXP + amount
  const levelData = calculateLevel(newXP)

  user.totalXP = newXP
  user.level = levelData.level
  await user.save()

  return {
    newXP,
    newLevel: levelData.level,
    leveledUp: levelData.level > previousLevel,
    previousLevel,
    previousXP,
    levelTitle: levelData.title,
  }
}

export { LEVEL_THRESHOLDS, LEVEL_TITLES, calculateLevel, addXP }
export default { LEVEL_THRESHOLDS, LEVEL_TITLES, calculateLevel, addXP }
