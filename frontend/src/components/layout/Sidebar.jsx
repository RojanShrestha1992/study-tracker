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
      <button type="button" className="fixed left-4 top-4 z-40 rounded-lg border border-sand bg-surface p-2 text-espresso md:hidden" onClick={() => setOpen(true)}>
        ☰
      </button>
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-sand bg-sidebar text-espresso transition-transform duration-200 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} md:static md:h-screen md:translate-x-0`}>
        <div className="flex h-full flex-col px-4 py-6">
          <div className="mb-6 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-badge font-bold text-white">⚡</div>
            <div>
              <p className="text-lg font-semibold text-espresso">StudyMitra</p>
              <p className="text-xs text-warmgray">Focus mode</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${isActive ? 'border-l-4 border-primary bg-primary/10 text-espresso' : 'text-warmgray hover:bg-primary-light hover:text-espresso'}`
                }
                onClick={() => setOpen(false)}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 rounded-2xl border border-sand bg-surface/80 p-4 shadow-warm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-badge font-semibold text-white">
                {avatarLetter}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-espresso">{displayName}</p>
                <p className="text-xs text-warmgray">Level {user?.level ?? 1} {levelTitle}</p>
              </div>
            </div>
            <button type="button" onClick={handleLogout} className="mt-4 w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-100">
              Logout
            </button>
          </div>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}
    </>
  )
}

export default Sidebar
