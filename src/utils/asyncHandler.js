const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    // safe status code, fallback 500
    const status = error.statusCode >= 100 && error.statusCode < 600 ? error.statusCode : 500;

    res.status(status).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export { asyncHandler };
