const passport = require('passport');
const _ = require('lodash');
const LocalStrategy = require('passport-local').Strategy;
const accountService = require('../services/account.service');
const accountHelper = require('../helpers/account.helper');

passport.initialize();

const LS = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async function (email, password, done) {
  try {
    const account = await accountService.findByEmail(email);

    if (!account) {
      return done(null, false, { message: 'Incorrect email.' });
    }

    const isSame = accountHelper.comparePassword(password, account);
    if (!_.isBoolean(isSame)) {
      return done(new Error('Internal Server Error'), false);
    }

    if (!isSame) {
      return done(null, false, { message: 'Incorrect password.' })
    }

    return done(null, account);
  }
  catch (err) {
    return done(err);
    // throw err;
  }
})

passport.use(LS);