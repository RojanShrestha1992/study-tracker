import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { register } from '../utils/authApi.js'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
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

    if (!name || !email || !password || !confirm) {
      setError('Please fill out all fields.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    try {
      setIsSubmitting(true)

      const result = await register({
        name,
        email,
        password,
      })

      // Store auth payload from API response for future protected pages.
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))

      setSuccess(result.message || 'Account created successfully.')
      setName('')
      setEmail('')
      setPassword('')
      setConfirm('')

      // Send the new user directly to dashboard after registration.
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
          <h2 className="mb-1 text-2xl font-bold text-espresso">Create account</h2>
          <p className="mb-6 text-sm text-warmgray">Quick, simple registration for beginners</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-warmgray">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-sand bg-cream px-3 py-2 text-espresso focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Your name"
              />
            </div>

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
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-warmgray">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-xl border border-sand bg-cream px-3 py-2 text-espresso focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Repeat password"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-accent">{success}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary px-4 py-2 font-semibold text-white shadow-warm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-warmgray">
            <Link to="/login" className="text-primary hover:underline">
              Already have an account?
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

export default RegisterPage