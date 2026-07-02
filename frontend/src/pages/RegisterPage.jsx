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
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <Navbar />
      <main className="flex items-center justify-center px-6 pt-20 pb-12">
        <div className="w-full max-w-md rounded-2xl border border-[#2d2d44] bg-[#1a1a2e] p-8">
          <h2 className="mb-1 text-2xl font-bold">Create account</h2>
          <p className="mb-6 text-sm text-[#94a3b8]">Quick, simple registration for beginners</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-[#cbd5e1]">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[#2d2d44] bg-[#0f1724] px-3 py-2 text-white focus:outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#cbd5e1]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#2d2d44] bg-[#0f1724] px-3 py-2 text-white focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#cbd5e1]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[#2d2d44] bg-[#0f1724] px-3 py-2 text-white focus:outline-none"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#cbd5e1]">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-lg border border-[#2d2d44] bg-[#0f1724] px-3 py-2 text-white focus:outline-none"
                placeholder="Repeat password"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-green-400">{success}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#7c3aed] px-4 py-2 font-semibold text-white hover:bg-[#6b21c8] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-[#94a3b8]">
            <Link to="/login" className="text-[#7c3aed] hover:underline">
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