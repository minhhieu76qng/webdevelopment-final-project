const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  isEmail: function (email) {
    return /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/.test(
      email
    );
  },

  comparePassword: function (password, account) {
    if (!account) return null;
    return bcrypt.compareSync(password, account.local.password);
  },

  generateToken: function (account, option = null) {
    const { JWTSECRET } = process.env;
    if (option) {
      return jwt.sign(account, JWTSECRET, option);
    }
    return jwt.sign(account, JWTSECRET);
  }
};
