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
    <main className="min-h-screen bg-cream px-6 py-10 text-espresso">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-3xl border border-sand bg-surface p-6 shadow-warm">
          <p className="text-sm text-warmgray">Welcome back</p>
          <h1 className="mt-1 text-3xl font-bold text-espresso">
            {user?.name ? `${user.name}'s Dashboard` : 'Study Dashboard'}
          </h1>
          <p className="mt-2 text-sm text-warmgray">
            This is your starter dashboard. Next, you can add streaks, quests, points, and study
            sessions here.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-sand bg-surface p-5 shadow-warm">
            <p className="text-xs uppercase tracking-wide text-warmgray">Current streak</p>
            <p className="mt-2 text-2xl font-bold text-espresso">0 days</p>
          </article>

          <article className="rounded-2xl border border-sand bg-surface p-5 shadow-warm">
            <p className="text-xs uppercase tracking-wide text-warmgray">XP earned</p>
            <p className="mt-2 text-2xl font-bold text-espresso">0 XP</p>
          </article>

          <article className="rounded-2xl border border-sand bg-surface p-5 shadow-warm">
            <p className="text-xs uppercase tracking-wide text-warmgray">Tasks completed</p>
            <p className="mt-2 text-2xl font-bold text-espresso">0 tasks</p>
          </article>
        </section>

        <section className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-primary/20 bg-primary-light px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            Logout
          </button>

         
        </section>
      </div>
    </main>
  )
}

export default DashboardPage