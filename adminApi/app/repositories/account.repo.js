const bcrypt = require("bcrypt");
const { Account } = require("../models/account.model");
const { SALT_ROUND } = require("../constance/account");
const { ROLES } = require("../constance/role");

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

    accountObject.isVerified = true;
    accountObject.role = ROLES.admin;

    const hash = await bcrypt.hash(accountObject.local.password, SALT_ROUND);
    accountObject.local.password = hash;

    const newAccount = new Account(accountObject);
    return await newAccount.save({ session: session });
  },

  findByEmail: async function(email) {
    return await Account.findOne({ "local.email": email });
  }
};
