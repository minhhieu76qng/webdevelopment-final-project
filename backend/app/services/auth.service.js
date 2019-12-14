const _ = require("lodash");
const passport = require("passport");
const httpCode = require("http-status-codes");
const accountService = require("./account.service");
const { ErrorHandler } = require("../helpers/error.helper");
const accountHelper = require("../helpers/account.helper");
const { ROLES } = require("../constance/constance");

module.exports = {
  user_loginWithLocal: (req, res, next) => {
    passport.authenticate(
      "userLocal",
      { session: false },
      (err, account, info) => {
        if (err) {
          return next(err);
        }

        if (!account) {
          return next(new ErrorHandler(httpCode.BAD_REQUEST, info.message));
        }

        if (
          !(account.role === ROLES.student || account.role === ROLES.teacher)
        ) {
          throw new ErrorHandler(
            httpCode.BAD_REQUEST,
            "Account type is not valid."
          );
        }

        if (!account.isVerified) {
          throw new ErrorHandler(
            httpCode.UNAUTHORIZED,
            "Account is not verified."
          );
        }

        const token = accountHelper.createToken(account);

        return res.status(httpCode.OK).json({ token });
      }
    )(req, res, next);
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

          const token = accountHelper.createToken(existAccount);

          return res.status(httpCode.OK).json({
            token
          });
        } catch (err) {
          next(err);
        }
      }
    )(req, res, next);
  },

  loginWithFacebook: (req, res, next) => {
    passport.authenticate(
      "facebookOAuth",
      { session: false },
      async (err, accountData, info) => {
        if (err) {
          return next(err);
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
          let existAccount = await accountService.findWithFacebookId(
            temp.facebook.id
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

          const token = accountHelper.createToken(existAccount);

          return res.status(httpCode.OK).json({
            token
          });
        } catch (err) {
          next(err);
        }
      }
    )(req, res, next);
  },

  admin_loginWithLocal: (req, res, next) => {
    passport.authenticate(
      "adminLocal",
      { session: false },
      (err, account, info) => {
        if (err) {
          return next(err);
        }

        if (!account) {
          return next(new ErrorHandler(httpCode.BAD_REQUEST, info.message));
        }

        if (!(account.role === ROLES.admin || account.role === ROLES.root)) {
          throw new ErrorHandler(
            httpCode.BAD_REQUEST,
            "Account type is not valid."
          );
        }

        if (!account.isVerified) {
          throw new ErrorHandler(
            httpCode.UNAUTHORIZED,
            "Account is not verified."
          );
        }

        const token = accountHelper.createToken(account);

        return res.status(httpCode.OK).json({ token });
      }
    )(req, res, next);
  }
};
