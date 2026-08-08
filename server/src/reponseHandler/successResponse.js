const successResponse = (res, statusCode, status, message, data = {}) => {
  res.status(statusCode).json({
    status,
    message,
    data,
  });
};

export { successResponse };
