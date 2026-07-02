import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Authenticate user by reading JWT from an HTTP-only cookie.
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token

    if (!token) {
      res.status(401)
      return res.json({ message: 'Not authenticated' })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET not set')
    }

    const payload = jwt.verify(token, secret)

    // Attach user to request for downstream handlers (without password)
    const user = await User.findById(payload.userId).select('-password')
    if (!user) {
      res.status(401)
      return res.json({ message: 'Invalid authentication' })
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: 'Not authenticated' })
  }
}
