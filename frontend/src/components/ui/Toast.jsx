function Toast({ toast, onRemove }) {
  const base = 'pointer-events-auto rounded-xl border-l-4 bg-surface/95 p-4 text-sm text-espresso shadow-warm backdrop-blur'

  const styles = {
    success: 'border-accent',
    error: 'border-red-500',
    info: 'border-primary',
    badge: 'border-primary bg-gradient-badge text-white',
  }

  return (
    <div className={`${base} ${styles[toast.type] || styles.info}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 font-semibold">
            {toast.type === 'badge' && <span>🏆</span>}
            <span>{toast.message}</span>
          </div>
        </div>
        <button type="button" onClick={() => onRemove(toast.id)} className="text-current/80 hover:text-current">
          ✕
        </button>
      </div>
    </div>
  )
}

export default Toast
