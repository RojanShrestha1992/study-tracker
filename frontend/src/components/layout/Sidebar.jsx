import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useUserStore from '../../stores/userStore.js'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/timer', label: 'Timer', icon: '⏱️' },
  { to: '/tasks', label: 'Tasks', icon: '✅' },
  { to: '/subjects', label: 'Subjects', icon: '📚' },
  { to: '/achievements', label: 'Achievements', icon: '🏆' },
  { to: '/leaderboard', label: 'Leaderboard', icon: '👑' },
  { to: '/profile', label: 'Profile', icon: '👤' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

function Sidebar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)
  const clearUser = useUserStore((state) => state.clearUser)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    clearUser()
    navigate('/login', { replace: true })
  }

  const levelTitle = user?.levelInfo?.title || 'Student'
  const displayName = user?.name || 'Student'
  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <>
      <button type="button" className="fixed left-4 top-4 z-40 rounded-lg border border-gray-800 bg-gray-900 p-2 text-white md:hidden" onClick={() => setOpen(true)}>
        ☰
      </button>
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-gray-800 bg-gray-900 text-white transition-transform duration-200 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} md:static md:h-screen md:translate-x-0`}>
        <div className="flex h-full flex-col px-4 py-6">
          <div className="mb-6 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 font-bold text-white">⚡</div>
            <div>
              <p className="text-lg font-semibold">StudyMitra</p>
              <p className="text-xs text-gray-400">Focus mode</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${isActive ? 'border-l-4 border-purple-500 bg-purple-500/10 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                }
                onClick={() => setOpen(false)}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 font-semibold text-white">
                {avatarLetter}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{displayName}</p>
                <p className="text-xs text-gray-400">Level {user?.level ?? 1} {levelTitle}</p>
              </div>
            </div>
            <button type="button" onClick={handleLogout} className="mt-4 w-full rounded-lg border border-red-500/30 px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10">
              Logout
            </button>
          </div>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setOpen(false)} />}
    </>
  )
}

export default Sidebar
