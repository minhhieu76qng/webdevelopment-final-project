const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ROLES } = require("../constance/constance");

module.exports = {
  isEmail: function(email) {
    return /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/.test(
      email
    );
  },

  comparePassword: function(password, account) {
    if (!account) return null;
    return bcrypt.compareSync(password, account.local.password);
  },

  generateUserToken: function(account, option = null) {
    const { JWTSECRET } = process.env;
    if (option) {
      return jwt.sign(account, JWTSECRET, option);
    }
    return jwt.sign(account, JWTSECRET);
  },

  generateAdminToken: function(account, option = null) {
    const { JWTSECRET_ADMIN } = process.env;
    if (option) {
      return jwt.sign(account, JWTSECRET_ADMIN, option);
    }
    return jwt.sign(account, JWTSECRET_ADMIN);
  },

  generateToken: function(account, option = null) {
    if (account.role === ROLES.student || account.role === ROLES.teacher) {
      return this.generateUserToken(account, option);
    }
    if (account.role === ROLES.admin || account.role === ROLES.root) {
      return this.generateAdminToken(account, option);
    }
  },

  createToken: function(account) {
    let temp = Object.assign({}, account);

    delete temp._doc.local.password;

    const token = this.generateToken(temp._doc, { expiresIn: "1d" });

    return token;
  }
};
