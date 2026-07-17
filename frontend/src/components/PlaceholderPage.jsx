function PlaceholderPage({ title, icon }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-sand bg-surface/90 p-10 text-center shadow-warm">
      <div className="mb-4 text-6xl">{icon}</div>
      <h1 className="text-3xl font-bold text-espresso">{title}</h1>
      <p className="mt-3 text-warmgray">Coming soon in the next phase 🚀</p>
    </div>
  )
}

export default PlaceholderPage
