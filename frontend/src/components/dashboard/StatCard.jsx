function StatCard({ label, value, icon, accentColor, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-sand bg-surface shadow-warm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-warmgray text-xs font-semibold uppercase tracking-wider">{label}</p>
          <div className="mt-2 flex items-center gap-3">
            <p className={`text-espresso text-3xl font-bold`}>{value}</p>
            {icon ? <span className={`${accentColor || 'text-primary'} text-xl`}>{icon}</span> : null}
          </div>
          {subtitle ? <p className="mt-2 text-warmgray text-sm">{subtitle}</p> : null}
        </div>
      </div>

      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  )
}

export default StatCard

