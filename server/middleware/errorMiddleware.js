const { sendError } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('SERVER ERROR:', err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  if (err.name === 'CastError') {
    message = `Resource not found with id of ${err.value}`;
    statusCode = 404;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered: ${field}. Please use another value.`;
    statusCode = 400;
  }

  if (err.name === 'ValidationError') {
    errors = Object.values(err.errors).map((val) => val.message);
    message = 'Validation Failed';
    statusCode = 400;
  }

  return sendError(res, statusCode, message, errors);
};

const notFound = (req, res, next) => {
  return sendError(res, 404, `Not Found - ${req.originalUrl}`);
};

module.exports = { errorHandler, notFound };
