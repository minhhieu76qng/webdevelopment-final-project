const passport = require("passport");
const httpCode = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error.helper");

function authenticate() {
  return (req, res, next) => {
    passport.authenticate("jwt", { session: false }, function(
      err,
      account,
      info
    ) {
      if (err) {
        throw new ErrorHandler(
          httpCode.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        );
      }

      if (!account) {
        throw new ErrorHandler(httpCode.BAD_REQUEST, "Your token is not valid");
      }

      req.user = account;

      next();
    })(req, res, next);
  };
}

module.exports = {
  authorize: (roles = []) => {
    if (typeof roles === "string") {
      roles = [roles];
    }

    return [
      authenticate(),
      (req, res, next) => {
        if (roles.length && !roles.includes(req.user.role)) {
          throw new ErrorHandler(httpCode.UNAUTHORIZED, "Unauthorized");
        }
        next();
      }
    ];
  }
};
