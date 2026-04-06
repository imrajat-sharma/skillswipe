const logger = require('../config/logger');

const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: 'Route not found.',
    requestId: req.requestId,
  });
};

const errorHandler = (err, req, res, next) => {
  logger.error(
    {
      err,
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      userId: req.user?._id?.toString(),
    },
    'Request failed'
  );

  if (err.name === 'MulterError') {
    return res.status(400).json({ message: err.message, requestId: req.requestId });
  }

  const status = err.statusCode || err.status || 500;
  return res.status(status).json({
    message: status >= 500 ? 'Internal server error.' : err.message,
    requestId: req.requestId,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
