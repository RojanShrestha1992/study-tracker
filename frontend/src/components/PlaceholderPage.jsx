function PlaceholderPage({ title, icon }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-gray-800 bg-gray-900/80 p-10 text-center">
      <div className="mb-4 text-6xl">{icon}</div>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="mt-3 text-gray-400">Coming soon in the next phase 🚀</p>
    </div>
  )
}

export default PlaceholderPage
