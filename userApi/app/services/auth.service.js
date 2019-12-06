const _ = require("lodash");
const passport = require("passport");
const httpCode = require("http-status-codes");
const accountService = require("./account.service");
const { ErrorHandler } = require("../helpers/error.helper");
const accountHelper = require("../helpers/account.helper");
const { ROLES } = require("../constance/account.constance");

function createToken(account) {
  if (!(account.role === ROLES.student || account.role === ROLES.teacher)) {
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
  },

  loginWithGoogle: (req, res, next) => {
    passport.authenticate(
      "googleOAuth",
      { session: false },
      async (err, accountData, info) => {
        if (err) {
          return next(
            new ErrorHandler(
              httpCode.INTERNAL_SERVER_ERROR,
              "Internal Server Error"
            )
          );
        }

        if (!accountData) {
          return next(
            new ErrorHandler(
              httpCode.INTERNAL_SERVER_ERROR,
              "Internal Server Error"
            )
          );
        }

        try {
          let temp = Object.assign({}, accountData);
          temp.role = req.body.job;

          // find account in db
          let existAccount = await accountService.findWithGoogleId(
            temp.google.id
          );

          if (!existAccount) {
            if (
              !temp.role ||
              !(temp.role === ROLES.student || temp.role === ROLES.teacher)
            ) {
              return res.status(httpCode.ACCEPTED).json({
                isExist: false
              });
            }

            existAccount = await accountService.createNewSocialAccount(temp);
          }

          const { token } = createToken(existAccount);

          return res.status(httpCode.OK).json({
            token
          });
        } catch (err) {
          next(err);
        }
      }
    )(req, res, next);
  },

  isAvailableGoogleAccount: (req, res, next) => {
    passport.authenticate(
      "googleOAuth",
      { session: false },
      async (err, accountData, info) => {
        if (err) {
          return next(
            new ErrorHandler(
              httpCode.INTERNAL_SERVER_ERROR,
              "Internal Server Error"
            )
          );
        }

        if (!accountData) {
          return next(
            new ErrorHandler(
              httpCode.INTERNAL_SERVER_ERROR,
              "Internal Server Error"
            )
          );
        }

        try {
          let temp = Object.assign({}, accountData);
          temp.role = req.body.job;

          // find account in db
          let existAccount = await accountService.findWithGoogleId(
            temp.google.id
          );

          if (!existAccount) {
            existAccount = await accountService.createNewSocialAccount(temp);
          }

          const { token } = createToken(existAccount);

          return res.status(httpCode.OK).json({
            token
          });
        } catch (err) {
          next(err);
        }
      }
    )(req, res, next);
  }
};
