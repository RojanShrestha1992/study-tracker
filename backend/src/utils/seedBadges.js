import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Badge from '../models/Badge.js'
import connectDB from '../config/db.js'

dotenv.config()

const badges = [
  { key: 'streak_3', name: 'First Spark', description: 'Maintain a 3-day streak', icon: '🔥', category: 'streak', condition: { type: 'streak', value: 3 } },
  { key: 'streak_7', name: 'Week Champion', description: 'Maintain a 7-day streak', icon: '🔥', category: 'streak', condition: { type: 'streak', value: 7 } },
  { key: 'streak_30', name: 'Momentum Master', description: 'Maintain a 30-day streak', icon: '🔥', category: 'streak', condition: { type: 'streak', value: 30 } },
  { key: 'streak_100', name: 'Century Streak', description: 'Maintain a 100-day streak', icon: '🔥', category: 'streak', condition: { type: 'streak', value: 100 } },
  { key: 'session_1', name: 'First Steps', description: 'Complete your first study session', icon: '⏱️', category: 'session', condition: { type: 'session_count', value: 1 } },
  { key: 'session_10', name: 'Consistency Keeper', description: 'Complete 10 study sessions', icon: '⏱️', category: 'session', condition: { type: 'session_count', value: 10 } },
  { key: 'session_50', name: 'Session Veteran', description: 'Complete 50 study sessions', icon: '⏱️', category: 'session', condition: { type: 'session_count', value: 50 } },
  { key: 'session_100', name: 'Session Legend', description: 'Complete 100 study sessions', icon: '⏱️', category: 'session', condition: { type: 'session_count', value: 100 } },
  { key: 'time_1h', name: 'Hour One', description: 'Accumulate 1 hour of study time', icon: '📚', category: 'time', condition: { type: 'total_time', value: 60 } },
  { key: 'time_10h', name: 'Study Veteran', description: 'Accumulate 10 hours of study time', icon: '📚', category: 'time', condition: { type: 'total_time', value: 600 } },
  { key: 'time_50h', name: 'Deep Diver', description: 'Accumulate 50 hours of study time', icon: '📚', category: 'time', condition: { type: 'total_time', value: 3000 } },
  { key: 'time_100h', name: 'Century Scholar', description: 'Accumulate 100 hours of study time', icon: '📚', category: 'time', condition: { type: 'total_time', value: 6000 } },
  { key: 'task_1', name: 'Task Starter', description: 'Complete your first task', icon: '✅', category: 'task', condition: { type: 'task_count', value: 1 } },
  { key: 'task_25', name: 'Task Finisher', description: 'Complete 25 tasks', icon: '✅', category: 'task', condition: { type: 'task_count', value: 25 } },
  { key: 'task_100', name: 'Task Master', description: 'Complete 100 tasks', icon: '✅', category: 'task', condition: { type: 'task_count', value: 100 } },
  { key: 'night_owl', name: 'Night Owl', description: 'Complete a session after 10 PM', icon: '🌙', category: 'special', condition: { type: 'special', value: 1 } },
  { key: 'early_bird', name: 'Early Bird', description: 'Complete a session before 7 AM', icon: '🌅', category: 'special', condition: { type: 'special', value: 1 } },
  { key: 'marathon', name: 'Marathon', description: 'Complete 4 sessions in one day', icon: '🏃', category: 'special', condition: { type: 'special', value: 4 } },
  { key: 'xp_5000', name: 'XP Collector', description: 'Reach 5000 XP', icon: '⭐', category: 'special', condition: { type: 'special', value: 5000 } },
  { key: 'first_subject', name: 'Subject Starter', description: 'Create your first subject', icon: '📘', category: 'special', condition: { type: 'special', value: 1 } },
  { key: 'first_task', name: 'First Task', description: 'Create or complete your first task', icon: '📝', category: 'special', condition: { type: 'special', value: 1 } },
  { key: 'level_5', name: 'Level 5', description: 'Reach level 5', icon: '⬆️', category: 'special', condition: { type: 'special', value: 5 } },
  { key: 'level_10', name: 'Level 10', description: 'Reach level 10', icon: '🏆', category: 'special', condition: { type: 'special', value: 10 } },
  { key: 'perfect_pomodoro', name: 'Perfect Pomodoro', description: 'Complete a pomodoro without pausing', icon: '🎯', category: 'special', condition: { type: 'special', value: 1 } },
  { key: 'streak_saver', name: 'Streak Saver', description: 'Keep a streak alive for two days', icon: '🛟', category: 'special', condition: { type: 'special', value: 2 } },
]

async function seedBadges() {
  await connectDB()

  for (const badge of badges) {
    await Badge.findOneAndUpdate(
      { key: badge.key },
      { $set: badge },
      { upsert: true, new: true }
    )
  }

  console.log(`Seeded ${badges.length} badges`)
  await mongoose.disconnect()
}

seedBadges().catch((error) => {
  console.error('Badge seeding failed:', error)
  process.exit(1)
})
