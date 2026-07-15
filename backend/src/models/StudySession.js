import mongoose from 'mongoose'

const studySessionSchema = new mongoose.Schema(
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
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    duration: {
      type: Number,
      required: [true, 'Session duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    xpEarned: {
      type: Number,
      required: [true, 'xpEarned is required'],
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
)

const StudySession = mongoose.model('StudySession', studySessionSchema)

export default StudySession
