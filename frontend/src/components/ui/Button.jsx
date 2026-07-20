const base = 'rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary: 'bg-gradient-badge text-white hover:brightness-110 shadow-warm',
  secondary: 'border border-sand bg-surface text-espresso hover:border-primary hover:bg-primary-light',
  danger: 'bg-red-500 text-white hover:bg-red-400',
  ghost: 'bg-transparent text-warmgray hover:bg-primary-light hover:text-primary',
}

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
}

function Button({ variant = 'primary', size = 'md', children, onClick, disabled = false, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()}
    >
      {children}
    </button>
  )
}

export default Button

