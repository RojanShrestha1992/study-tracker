function Button({ variant = 'primary', size = 'md', children, onClick, disabled = false, type = 'button', className = '' }) {
  const base = 'rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60'

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:brightness-110',
    secondary: 'border border-gray-700 bg-gray-800 text-gray-100 hover:border-gray-600 hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    ghost: 'bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white',
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()}>
      {children}
    </button>
  )
}

export default Button
