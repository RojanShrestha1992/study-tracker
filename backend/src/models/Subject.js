import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    color: {
      type: String,
      required: [true, 'Subject color is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Subject icon is required'],
      trim: true,
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

const Subject = mongoose.model('Subject', subjectSchema)

export default Subject
