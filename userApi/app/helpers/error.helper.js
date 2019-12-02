class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

function handleError(err, res) {
  const { statusCode, message } = err;

  return res.status(statusCode).json({
    error: {
      msg: message
    }
  });
}

module.exports = {
  ErrorHandler,
  handleError
};
