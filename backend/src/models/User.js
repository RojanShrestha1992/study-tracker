import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// User schema for auth and core gamification data.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    avatar: {
      type: String,
      default: 'avatar1',
    },
    totalXP: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastStudyDate: {
      type: Date,
      default: null,
    },
    settings: {
      workDuration: {
        type: Number,
        default: 25,
      },
      shortBreak: {
        type: Number,
        default: 5,
      },
      longBreak: {
        type: Number,
        default: 15,
      },
      sessionsBeforeLongBreak: {
        type: Number,
        default: 4,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Hash the password before storing it in MongoDB.
userSchema.pre('save', async function (next) {
  // Skip re-hashing when updating fields other than password.
  if (!this.isModified('password')) {
    return next()
  }
 
  // Salt + hash protects stored credentials if database is exposed.
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = mongoose.model('User', userSchema)

export default User