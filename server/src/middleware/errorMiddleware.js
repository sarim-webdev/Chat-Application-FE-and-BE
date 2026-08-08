const errorMiddleware = (error, req, res, next) => {
  res.status(500).json({
    status: false,
    message: error.message,
  });
};

export { errorMiddleware };