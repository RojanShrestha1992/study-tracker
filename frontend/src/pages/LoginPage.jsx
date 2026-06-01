import { Link } from 'react-router-dom'

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f1a] px-6 text-white">
      <div className="rounded-2xl border border-[#2d2d44] bg-[#1a1a2e] p-8 text-center">
        <h2 className="mb-2 text-2xl font-bold">Login Page</h2>
        <p className="text-[#94a3b8]">lalalal</p>
        <Link to="/" className="mt-6 inline-block text-[#7c3aed] hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default LoginPage