function TaskCard({ task, onComplete, onDelete }) {
  const completed = task?.status === 'completed'
  const subject = task?.subjectId || task?.subject

  const handleToggle = () => {
    if (!completed) onComplete?.(task._id)
  }

  const xp = task?.xpReward ?? 100

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border border-sand bg-surface shadow-warm p-4 ${completed ? 'opacity-70' : ''}`}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={completed
          ? 'h-6 w-6 rounded-full bg-accent flex items-center justify-center'
          : 'h-6 w-6 rounded-full border-2 border-sand hover:border-primary cursor-pointer'}
        aria-label={completed ? 'Task completed' : 'Complete task'}
      >
        {completed ? <span className="text-white">✓</span> : null}
      </button>

      <div className="flex-1">
        <div className={`text-espresso font-medium ${completed ? 'line-through text-warmgray' : ''}`}>{task.title}</div>

        <div className="mt-2 flex items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-xs"
            style={{ backgroundColor: subject?.color ? `${subject.color}1A` : undefined }}
          >
            <span style={{ color: subject?.color || undefined }} className="font-semibold">
              {subject?.icon ? `${subject.icon} ` : ''}
              {subject?.name || ''}
            </span>
          </span>

          <span className="text-game-xp text-xs font-semibold">+{xp} XP</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete?.(task._id)}
        className="text-warmgray hover:text-status-missed p-2"
        aria-label="Delete task"
      >
        🗑️
      </button>
    </div>
  )
}

export default TaskCard

