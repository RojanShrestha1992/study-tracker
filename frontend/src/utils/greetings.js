export function getGreeting() {
  const hour = new Date().getHours()

  if (hour >= 5 && hour <= 11) return { text: 'Good morning', emoji: '☀️' }
  if (hour >= 12 && hour <= 16) return { text: 'Good afternoon', emoji: '🌤️' }
  if (hour >= 17 && hour <= 20) return { text: 'Good evening', emoji: '🌙' }

  // 21-4
  return { text: 'Working late', emoji: '🌟' }
}

export function getMotivationalMessage(streak, todaySessions) {
  const safeStreak = Number(streak || 0)
  const safeTodaySessions = Number(todaySessions || 0)

  if (safeTodaySessions === 0 && safeStreak > 0) {
    return `Don't break your ${safeStreak}-day streak! Start a session.`
  }

  if (safeTodaySessions === 0) {
    return 'Ready to start your first session today?'
  }

  if (safeTodaySessions >= 1 && safeTodaySessions < 3) {
    return 'Great start! Keep the momentum going.'
  }

  if (safeTodaySessions >= 3 && safeTodaySessions < 6) {
    return "You're on fire! 🔥 Amazing focus today."
  }

  if (safeTodaySessions >= 6) {
    return 'Incredible dedication! Remember to take breaks.'
  }

  if (safeStreak >= 7) {
    return 'Week champion vibes 🏆 Keep it up!'
  }

  return 'Keep going — every session counts!'
}

