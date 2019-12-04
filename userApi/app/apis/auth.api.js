const router = require("express").Router();
const passport = require('passport');
const httpCode = require("http-status-codes");
const accountService = require("../services/account.service");
const { ErrorHandler } = require('../helpers/error.helper');
const { ROLES } = require('../constance/account.constance');

// create new user
router.post("/sign-up", (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    job
  } = req.body;

  accountService.createNewUser({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    job
  })
    .then(result => {
      return res.status(httpCode.CREATED).json({
        _id: result._id,
        name: result.name,
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    })
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, function (err, account, info) {
    if (err) {
      return next(err);
    }

    if (!account) {
      return next(new ErrorHandler(httpCode.NOT_FOUND, info.message));
    }

    try {
      // generate token
      const { token } = accountService.login(account);
      return res.status(httpCode.OK).json({ token });
    }
    catch (err) {
      return next(err);
    }

  })(req, res, next);
})

router.get('/oauth/google/is-available', (req, res, next) => {
  passport.authenticate('googleOAuth', { session: false }, async (err, accountData, info) => {
    if (err) {
      return next(new ErrorHandler(httpCode.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    }

    if (!accountData) {
      return next(new ErrorHandler(httpCode.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    }
    // check user exist
    try {
      let existAccount = await accountService.findWithGoogleId(accountData.google.id);

      if (!existAccount) {
        return res.status(httpCode.NOT_FOUND).json({
          isExist: false,
        })
      }
      return res.status(httpCode.OK).json({
        isExist: true,
        google: existAccount.google,
      })
    }
    catch (err) {
      return next(err);
    }
  })(req, res, next);
});

router.post('/oauth/google', (req, res, next) => {
  passport.authenticate('googleOAuth', { session: false }, async (err, accountData, info) => {
    if (err) {
      return next(new ErrorHandler(httpCode.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    }

    if (!accountData) {
      return next(new ErrorHandler(httpCode.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    }

    let temp = Object.assign({}, accountData);
    temp.role = req.body.job;


    try {
      // find account in db
      let existAccount = await accountService.findWithGoogleId(temp.google.id);

      if (!existAccount) {
        existAccount = await accountService.createNewSocialAccount(temp)
      }

      const { token } = accountService.login(existAccount);

      return res.status(httpCode.OK).json({
        token
      })
    }
    catch (err) {
      return next(err);
    }

  })(req, res, next);
})

module.exports = router;
