const bcrypt = require("bcrypt");
const httpCode = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error.helper");
const { Account } = require("../models/account.model");
const { SALT_ROUND } = require("../constance/account.constance");

module.exports = {
  add: async function(data, session = null) {
    const accountObject = {
      local: {
        email: data.email,
        password: data.password
      },
      name: {
        firstName: data.firstName,
        lastName: data.lastName
      },
      role: data.job
    };

    const hash = await bcrypt.hash(accountObject.local.password, SALT_ROUND);
    accountObject.local.password = hash;

    const newAccount = new Account(accountObject);
    try {
      return await newAccount.save({ session: session });
    } catch (err) {
      throw new ErrorHandler(
        httpCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
      // throw err;
    }
  },

  addSocialAccount: async function(account, session = null) {
    console.log(account);
    account.isVerified = true;
    const newAccount = new Account(account);
    try {
      return await newAccount.save({ session: session });
    } catch (err) {
      console.log(err);
      throw new ErrorHandler(
        httpCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
      // throw err;
    }
  },

  findByEmail: async function(email) {
    try {
      return await Account.findOne({ "local.email": email });
    } catch (err) {
      throw new ErrorHandler(
        httpCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  },

  findWithGoogleId: async function(googleId) {
    try {
      return await Account.findOne({ "google.id": googleId });
    } catch (err) {
      throw new ErrorHandler(
        httpCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  },

  findWithFacebookId: async function(facebookId) {
    return await Account.findOne({ "facebook.id": facebookId });
  }
};
