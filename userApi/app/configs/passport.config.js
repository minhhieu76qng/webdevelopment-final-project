const passport = require('passport');
const _ = require('lodash');
const LocalStrategy = require('passport-local').Strategy;
const GoogleOAuthStrategy = require('passport-google-plus-token');
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


const googleOAuth = new GoogleOAuthStrategy({
  clientID: '709935789644-953hmsleu2k05fsvoie4faj7alpnb2g6.apps.googleusercontent.com',
  clientSecret: '_NefM9qNc_ISfN0_3SpuTR5h',
}, async function (accessToken, refreshToken, profile, done) {
  const account = {
    google: {
      id: profile.id,
      email: profile.emails[0].value
    },
    name: {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName
    },
    avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
  }

  return done(null, account);
})

passport.use(LS);

passport.use('googleOAuth', googleOAuth);