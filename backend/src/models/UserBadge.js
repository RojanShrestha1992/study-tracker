import mongoose from 'mongoose'

const userBadgeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
    },
    badgeKey: {
      type: String,
      required: [true, 'badgeKey is required'],
      trim: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
)

userBadgeSchema.index({ userId: 1, badgeKey: 1 }, { unique: true })

const UserBadge = mongoose.model('UserBadge', userBadgeSchema)

export default UserBadge
