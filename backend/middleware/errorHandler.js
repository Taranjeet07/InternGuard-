/**
 * Centralized Error Handling Middleware for InternGuard
 */
function errorHandler(err, req, res, next) {
  console.error('Error encountered:', err.stack || err.message || err);

  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message
  });
}

module.exports = errorHandler;
