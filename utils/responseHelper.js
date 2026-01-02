function sendResponse(res, statusCode, message, data = null, filePath = '') {
  const response = {
    status: statusCode >= 200 && statusCode < 300,
    statusCode: statusCode,
    message: message,
    count: Array.isArray(data) ? data.length : (data ? 1 : 0),
    filePath: filePath,
    data: data
  };
  return res.status(statusCode).json(response);
}

function sendSuccess(res, message, data = null, statusCode = 200) {
  return sendResponse(res, statusCode, message, data);
}

function sendError(res, message, statusCode = 400) {
  return sendResponse(res, statusCode, message, null);
}

module.exports = {
  sendResponse,
  sendSuccess,
  sendError
};

