const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.errors
    })
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      message: 'Duplicate entry',
      field: err.meta?.target
    })
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      message: 'Record not found'
    })
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = errorHandler