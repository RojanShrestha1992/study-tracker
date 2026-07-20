function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-sand bg-surface/50 p-8 text-center shadow-warm">
      <div className="text-5xl">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-espresso">{title}</h3>
      <p className="mt-2 text-sm text-warmgray">{description}</p>
      {action ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={action.onClick}
            className="rounded-xl bg-gradient-badge px-5 py-2.5 text-sm font-semibold text-white shadow-warm hover:brightness-110"
          >
            {action.label}
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default EmptyState

