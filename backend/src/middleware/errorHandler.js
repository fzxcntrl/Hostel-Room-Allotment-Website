function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err); // helpful while prototyping
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Something went wrong. Please try again later.',
  });
}

module.exports = errorHandler;
