const passport = require("passport");
const httpCode = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error.helper");

module.exports = {
  authenticateAdmin: () => {
    return (req, res, next) => {
      passport.authenticate("adminJWT", { session: false }, function(
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
          throw new ErrorHandler(
            httpCode.BAD_REQUEST,
            "Your token is not valid"
          );
        }

        req.user = account;

        next();
      })(req, res, next);
    };
  },

  authenticateUser: () => {
    return (req, res, next) => {
      passport.authenticate("userJWT", { session: false }, function(
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
          throw new ErrorHandler(
            httpCode.BAD_REQUEST,
            "Your token is not valid"
          );
        }

        req.user = account;

        next();
      })(req, res, next);
    };
  },

  authorize: (roles = []) => {
    if (typeof roles === "string") {
      roles = [roles];
    }

    return (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        throw new ErrorHandler(httpCode.UNAUTHORIZED, "Unauthorized");
      }

      if (req.user.isBlocked) {
        throw new ErrorHandler(
          httpCode.FORBIDDEN,
          "Your account has been block. Contact your administrator for more details."
        );
      }

      if (!req.user.isVerified) {
        throw new ErrorHandler(
          httpCode.FORBIDDEN,
          "Your account is not verified. Check your mail and follow our guild."
        );
      }
      next();
    };
  }
};
