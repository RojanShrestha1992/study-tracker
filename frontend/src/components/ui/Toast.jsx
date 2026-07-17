function Toast({ toast, onRemove }) {
  const base = 'pointer-events-auto rounded-xl border-l-4 bg-gray-900/95 p-4 text-sm text-white shadow-lg backdrop-blur'

  const styles = {
    success: 'border-green-500',
    error: 'border-red-500',
    info: 'border-blue-500',
    badge: 'border-purple-500 bg-gradient-to-r from-purple-600 to-blue-500',
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
        <button type="button" onClick={() => onRemove(toast.id)} className="text-white/80 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  )
}

export default Toast
