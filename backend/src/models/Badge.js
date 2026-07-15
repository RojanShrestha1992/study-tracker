import mongoose from 'mongoose'

const badgeSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Badge key is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Badge description is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Badge icon is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['streak', 'session', 'time', 'task', 'special'],
      required: [true, 'Badge category is required'],
    },
    condition: {
      type: {
        type: String,
        required: [true, 'Condition type is required'],
      },
      value: {
        type: Number,
        default: 0,
      },
      meta: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
    },
  },
  {
    timestamps: false,
  }
)

const Badge = mongoose.model('Badge', badgeSchema)

export default Badge
