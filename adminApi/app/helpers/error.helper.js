class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

function handleError(err, res) {
  const { statusCode, message } = err;
  return res.status(statusCode || 500).json({
    error: {
      msg: message || "Internal Server Error"
    }
  });
}

module.exports = {
  ErrorHandler,
  handleError
};
