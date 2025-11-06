const errorhandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message;

  // Duplicate key error 
  if (error.code === 11000) {
    statusCode = 400;
    const msg = Object.values(error.keyValue).join(', ');
    message = `${msg} already exists`;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Your token is invalid, please log in again';
  }

  // Mongoose validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map(err => err.message).join(', ');
  }

  //multer error
  if(error.name === 'MulterError') {
    statusCode = 400
    message = 'File too large. Max size is 2MB'
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : null,
  });
};


export default errorhandler;
