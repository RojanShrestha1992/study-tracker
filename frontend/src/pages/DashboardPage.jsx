import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function DashboardPage() {
  const navigate = useNavigate()

  const user = useMemo(() => {
    const rawUser = localStorage.getItem('user')

    if (!rawUser) {
      return null
    }

    try {
      return JSON.parse(rawUser)
    } catch {
      return null
    }
  }, [])

  function handleLogout() {
    // Clear saved auth data and return to login screen.
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-screen bg-[#0f0f1a] px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-2xl border border-[#2d2d44] bg-[#1a1a2e] p-6">
          <p className="text-sm text-[#94a3b8]">Welcome back</p>
          <h1 className="mt-1 text-3xl font-bold text-white">
            {user?.name ? `${user.name}'s Dashboard` : 'Study Dashboard'}
          </h1>
          <p className="mt-2 text-sm text-[#cbd5e1]">
            This is your starter dashboard. Next, you can add streaks, quests, points, and study
            sessions here.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-[#2d2d44] bg-[#1a1a2e] p-5">
            <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Current streak</p>
            <p className="mt-2 text-2xl font-bold">0 days</p>
          </article>

          <article className="rounded-xl border border-[#2d2d44] bg-[#1a1a2e] p-5">
            <p className="text-xs uppercase tracking-wide text-[#94a3b8]">XP earned</p>
            <p className="mt-2 text-2xl font-bold">0 XP</p>
          </article>

          <article className="rounded-xl border border-[#2d2d44] bg-[#1a1a2e] p-5">
            <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Tasks completed</p>
            <p className="mt-2 text-2xl font-bold">0 tasks</p>
          </article>
        </section>

        <section className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-[#7c3aed] px-4 py-2 text-sm font-semibold text-[#7c3aed] transition-colors hover:bg-[#7c3aed] hover:text-white"
          >
            Logout
          </button>

         
        </section>
      </div>
    </main>
  )
}

export default DashboardPage