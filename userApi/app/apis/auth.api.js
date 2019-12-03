const router = require("express").Router();
const passport = require('passport');
const httpCode = require("http-status-codes");
const accountService = require("../services/account.service");
const { ErrorHandler } = require('../helpers/error.helper');

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
      return res.status(httpCode.CREATED).json(result);
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

module.exports = router;
