function SkeletonLoader({ variant = 'card', className = '' }) {
  if (variant === 'list-item') {
    return (
      <div className={`flex items-center gap-3 rounded-2xl p-3 ${className}`.trim()}>
        <div className="h-10 w-10 rounded-full bg-sand/40 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/5 rounded bg-sand/40 animate-pulse" />
          <div className="h-3 w-2/5 rounded bg-sand/40 animate-pulse" />
        </div>
      </div>
    )
  }

  const baseClasses = {
    card: 'h-32 rounded-2xl bg-sand/40 animate-pulse',
    stat: 'h-24 rounded-2xl bg-sand/40 animate-pulse',
    text: 'h-4 rounded bg-sand/40 animate-pulse',
    circle: 'rounded-full bg-sand/40 animate-pulse',
  }

  return <div className={`${baseClasses[variant] || baseClasses.card} ${className}`.trim()} />
}

export function SkeletonGroup({ count = 1, variant = 'card', className = '' }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonLoader key={`${variant}-${index}`} variant={variant} className={className} />
      ))}
    </>
  )
}

export default SkeletonLoader