import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { login } from '../utils/authApi.js'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()    
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    try {
      setIsSubmitting(true)

      const result = await login({
        email,
        password,
      })

      // Keep auth response in localStorage so later pages can read it.
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))

      setSuccess(result.message || 'Login successful.')
      setEmail('')
      setPassword('')

      // Send the user to the app area after successful login.
      navigate('/dashboard', { replace: true })
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream text-espresso">
      <Navbar />
      <main className="flex items-center justify-center px-6 pt-20 pb-12">
        <div className="w-full max-w-md rounded-3xl border border-sand bg-surface p-8 shadow-warm-lg">
          <h2 className="mb-1 text-2xl font-bold text-espresso">Sign in</h2>
          <p className="mb-6 text-sm text-warmgray"></p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-warmgray">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-sand bg-cream px-3 py-2 text-espresso focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-warmgray">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-sand bg-cream px-3 py-2 text-espresso focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Your password"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-accent">{success}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary px-4 py-2 font-semibold text-white shadow-warm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-warmgray">
            <Link to="/register" className="text-primary hover:underline">
              Create account
            </Link>
            <Link to="/" className="hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default LoginPage