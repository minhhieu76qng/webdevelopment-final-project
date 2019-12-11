const bcrypt = require("bcrypt");
const { Account } = require("../models/account.model");
const { SALT_ROUND, ROLES } = require("../constance/constance");

module.exports = {
  addUser: async function(data, session = null) {
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
    return await newAccount.save({ session: session });
  },

  addAdmin: async function(data, session = null) {
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

    accountObject.isVerified = true;
    accountObject.role = ROLES.admin;

    const hash = await bcrypt.hash(accountObject.local.password, SALT_ROUND);
    accountObject.local.password = hash;

    const newAccount = new Account(accountObject);
    return await newAccount.save({ session: session });
  },

  addSocialAccount: async function(account, session = null) {
    account.isVerified = true;
    const newAccount = new Account(account);
    return await newAccount.save({ session: session });
  },

  findByEmail: async function(email) {
    return await Account.findOne({ "local.email": email });
  },

  findWithGoogleId: async function(googleId) {
    return await Account.findOne({ "google.id": googleId });
  },

  findWithFacebookId: async function(facebookId) {
    return await Account.findOne({ "facebook.id": facebookId });
  }
};
