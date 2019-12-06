const passport = require("passport");
const _ = require("lodash");
const LocalStrategy = require("passport-local").Strategy;
const GoogleOAuthStrategy = require("passport-google-token").Strategy;
const accountService = require("../services/account.service");
const accountHelper = require("../helpers/account.helper");

passport.initialize();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const LS = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password"
  },
  async function(email, password, done) {
    try {
      const account = await accountService.findByEmail(email);

      if (!account) {
        return done(null, false, { message: "Incorrect email." });
      }

      const isSame = accountHelper.comparePassword(password, account);
      if (!_.isBoolean(isSame)) {
        return done(new Error("Internal Server Error"), false);
      }

      if (!isSame) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, account);
    } catch (err) {
      return done(err);
      // throw err;
    }
  }
);

const googleOAuth = new GoogleOAuthStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET
  },
  async function(accessToken, refreshToken, profile, done) {
    const jsonData = profile._json;
    const account = {
      google: {
        id: jsonData.id,
        email: jsonData.email
      },
      name: {
        firstName: jsonData.given_name,
        lastName: jsonData.family_name
      },
      avatar: jsonData.picture
    };

    return done(null, account);
  }
);

passport.use(LS);

passport.use("googleOAuth", googleOAuth);
