import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'subjectId is required'],
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    xpReward: {
      type: Number,
      default: 100,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
)

const Task = mongoose.model('Task', taskSchema)

export default Task
