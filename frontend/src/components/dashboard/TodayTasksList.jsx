import EmptyState from '../ui/EmptyState.jsx'

function TodayTasksList({ tasks, onComplete }) {
  const safe = Array.isArray(tasks) ? tasks.slice(0, 5) : []

  return (
    <div className="rounded-2xl border border-sand bg-surface shadow-warm p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-espresso font-semibold">📝 Today's Tasks</h3>
        <a href="/tasks" className="text-primary text-sm hover:underline">
          View All →
        </a>
      </div>

      {safe.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon="✅"
            title="No pending tasks. Great job!"
            description="You’re all caught up — start a new task when you’re ready."
          />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {safe.map((t) => {
            const completed = t.status === 'completed'
            return (
              <div key={t._id} className="flex items-center gap-3 rounded-xl border border-sand bg-surface p-3">
                <button
                  type="button"
                  disabled={completed}
                  onClick={() => onComplete?.(t._id)}
                  className={completed
                    ? 'h-6 w-6 rounded-full bg-accent flex items-center justify-center opacity-70'
                    : 'h-6 w-6 rounded-full border-2 border-sand hover:border-primary cursor-pointer'}
                >
                  {completed ? <span className="text-white">✓</span> : null}
                </button>

                <div className="min-w-0 flex-1">
                  <div className={`truncate text-espresso ${completed ? 'line-through text-warmgray' : 'font-medium'}`}>{t.title}</div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <div className="text-warmgray text-xs">
                      {t.subject?.icon ? <span>{t.subject.icon} </span> : null}
                      {t.subject?.name}
                    </div>
                    <div className="text-game-xp text-xs font-semibold">+{t.xpReward ?? 100} XP</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TodayTasksList

