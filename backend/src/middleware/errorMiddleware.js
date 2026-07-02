function notFound(_req, res, next) {
  // Convert unknown routes into a standard 404 error.
  const error = new Error('Route not found')
  error.statusCode = 404
  next(error)
}

function errorHandler(error, _req, res, _next) {
  // Use an explicit status if present; otherwise default to 500.
  const statusCode = error.statusCode || res.statusCode || 500
  const message = error.message || 'Internal server error'

  res.status(statusCode).json({
    message,
    // Expose stack traces only in development for easier debugging.
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  })
}

export { notFound, errorHandler }