/**
 * Standard API response formatter
 */
const sendResponse = (res, statusCode, success, message, data = null, error = null) => {
  const response = {
    success,
    message,
    ...(data && { data }),
    ...(error && { error })
  };

  return res.status(statusCode).json(response);
};

/**
 * Success response helper
 */
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data);
};

/**
 * Error response helper
 */
const sendError = (res, message, error = null, statusCode = 500) => {
  return sendResponse(res, statusCode, false, message, null, error);
};

/**
 * Validation error response helper
 */
const sendValidationError = (res, message, errors = null) => {
  return sendResponse(res, 400, false, message, null, errors);
};

/**
 * Not found response helper
 */
const sendNotFound = (res, message = 'Resource not found') => {
  return sendResponse(res, 404, false, message);
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound
};
