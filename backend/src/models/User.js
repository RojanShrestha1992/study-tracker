import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// User schema for auth. Password is hidden by default in queries.
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
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
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