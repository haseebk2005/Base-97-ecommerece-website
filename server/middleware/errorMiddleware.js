exports.notFound = (req,res,next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  exports.errorHandler = (err,req,res,next) => {
    const status = res.statusCode===200?500:res.statusCode;
    res.status(status).json({ message: err.message });
  };
  