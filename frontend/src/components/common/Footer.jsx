import { FiZap } from 'react-icons/fi'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-[#2d2d44] bg-[#1a1a2e] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2">
              <FiZap className="text-xl text-[#7c3aed]" />
              <span className="text-xl font-bold text-white">StudyMitra</span>
            </Link>
            <p className="mt-2 text-sm text-[#94a3b8]">Level up your learning journey.</p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <div>
              <h3 className="mb-3 font-semibold text-white">Product</h3>
              <div className="flex flex-col gap-2 text-sm">
                <a href="#features" className="text-[#94a3b8] transition-colors hover:text-white">
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-[#94a3b8] transition-colors hover:text-white"
                >
                  How It Works
                </a>
                <a href="#features" className="text-[#94a3b8] transition-colors hover:text-white">
                  Leaderboard
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-white">Account</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/login" className="text-[#94a3b8] transition-colors hover:text-white">
                  Login
                </Link>
                <Link to="/register" className="text-[#94a3b8] transition-colors hover:text-white">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#2d2d44] pt-6 text-center text-sm text-[#94a3b8]">
          © 2025 StudyQuest. Built to make studying actually enjoyable.
        </div>
      </div>
    </footer>
  )
}

export default Footer