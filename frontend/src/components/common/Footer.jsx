import { FiZap } from 'react-icons/fi'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-sand bg-surface px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row-reverse md:items-start">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2">
              <FiZap className="text-xl text-primary" />
              <span className="slackey-regular text-xl text-espresso">StudyMitra</span>
            </Link>
            <p className="mt-2 text-sm text-warmgray">Level up your learning journey.</p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <div>
              <h3 className="mb-3 font-semibold text-espresso">Product</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/#features" className="text-black transition-colors hover:text-gray-800">
                  Features
                </Link>
                <Link to="/#how-it-works" className="text-black transition-colors hover:text-gray-800">
                  How It Works
                </Link>
                
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-espresso">Account</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/login" className="text-warmgray transition-colors hover:text-primary">
                  Login
                </Link>
                <Link to="/register" className="text-warmgray transition-colors hover:text-primary">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-sand pt-6 text-center text-sm text-warmgray">
          © 2025 StudyMitra. Built to make studying actually enjoyable.
        </div>
      </div>
    </footer>
  )
}

export default Footer