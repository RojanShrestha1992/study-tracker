import jwt from 'jsonwebtoken'

function generateToken(userId) {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }

  // Token includes the user id and expires in 7 days.
  return jwt.sign({ userId }, secret, {
    expiresIn: '7d',
  })
}

export default generateToken