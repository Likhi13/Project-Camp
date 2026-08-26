const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    statusCode,
    message: err.message || "Something went wrong",
    errors: err.errors || [],
    success: false,
  });
};

export { errorHandler };
