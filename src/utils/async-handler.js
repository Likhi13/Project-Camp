const asyncHandler = (requestHandlerFn) => {
  return (req, res, next) => {
    Promise.resolve(requestHandlerFn(req, res, next)).catch((error) =>
      //Instead of crashing, it passes the error to Express’s error-handling middleware via next(error)
      next(error),
    );
  };
};

export { asyncHandler };
