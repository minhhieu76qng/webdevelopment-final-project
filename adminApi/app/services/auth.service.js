const passport = require("passport");
const httpCode = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error.helper");
const accountHelper = require("../helpers/account.helper");
const { ROLES } = require("../constance/role");

function createToken(account) {
  if (!(account.role === ROLES.root || account.role === ROLES.admin)) {
    throw new ErrorHandler(httpCode.NOT_FOUND, "Account type is not valid.");
  }

  if (!account.isVerified) {
    throw new ErrorHandler(httpCode.UNAUTHORIZED, "Account is not verified.");
  }

  let temp = Object.assign({}, account);

  delete temp._doc.local.password;

  const token = accountHelper.generateToken(temp._doc, { expiresIn: "1d" });

  return {
    token
  };
}

module.exports = {
  createToken,
  loginWithLocal: (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, account, info) => {
      if (err) {
        return next(err);
      }

      if (!account) {
        return next(new ErrorHandler(httpCode.NOT_FOUND, info.message));
      }

      const { token } = createToken(account);

      return res.status(httpCode.OK).json({ token });
    })(req, res, next);
  }
};
