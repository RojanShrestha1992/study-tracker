import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// Keep a single response format for both register and login.
function sendAuthResponse(res, user, statusCode) {
  const token = generateToken(user._id)

  // Cookie options: HTTP only so JS cannot read it, secure in production.
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }

  // Set the cookie and also return the user object in JSON.
  res.cookie('token', token, cookieOptions)
  res.status(statusCode).json({
    message: statusCode === 201 ? 'Registration successful' : 'Login successful',
    token: token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  })
}

export async function logoutUser(_req, res) {
  // Clear the token cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  })
  res.json({ message: 'Logged out' })
}

export async function getMe(req, res) {
  // requireAuth middleware will have added req.user
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  res.json({ user: req.user })
}

export async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body

    // Basic required-field validation.
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' })
    }

    // Normalize email so different letter-casing still maps to one account.
    const normalizedEmail = email.trim().toLowerCase()
    const existingUser = await User.findOne({ email: normalizedEmail })

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    // Password hashing is handled in the User model 
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    })

    sendAuthResponse(res, user, 201)
  } catch (error) {
    next(error)
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body

    // Basic required-field validation.
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Explicitly include password because schema sets select:false by default.
    const user = await User.findOne({ email: normalizedEmail }).select('+password')

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Compare plaintext input to the stored hash.
    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    sendAuthResponse(res, user, 200)
  } catch (error) {
    // Forward unexpected errors to centralized error middleware.
    next(error)
  }
}