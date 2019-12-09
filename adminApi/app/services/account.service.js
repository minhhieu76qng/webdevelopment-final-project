const _ = require("lodash");
const httpCode = require("http-status-codes");
const accountRepo = require("../repositories/account.repo");
const { ErrorHandler } = require("../helpers/error.helper");
const accountHelper = require("../helpers/account.helper");
const { ROLES } = require("../constance/role");
const { MIN_LENGTH_PASSWORD } = require("../constance/account");

function validateString(field, message) {
  if (!_.isString(field)) {
    throw new ErrorHandler(httpCode.BAD_REQUEST, message);
  }
}

module.exports = {
  createNewLocalUser: async function(data) {
    if (
      !(data && data.firstName && data.lastName && data.email && data.password)
    ) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Missing some fields!");
    }

    // validate data type
    validateString(data.firstName, "First name must be a string.");
    validateString(data.lastName, "Last name must be a string.");
    validateString(data.email, "Email must be a string.");
    validateString(data.password, "Password must be a string.");

    // validate data
    if (!accountHelper.isEmail(data.email)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Email is not valid.");
    }

    if (!(data.password.length >= MIN_LENGTH_PASSWORD)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        `Password must be at least ${MIN_LENGTH_PASSWORD} characters.`
      );
    }

    try {
      // checking email
      const isExist = await this.findByEmail(data.email);

      if (isExist) {
        throw new ErrorHandler(httpCode.CONFLICT, "Email is already taken.");
      }

      const account = await accountRepo.add(data);

      return account;
    } catch (err) {
      throw err;
    }
  },

  findByEmail: async function(email) {
    return await accountRepo.findByEmail(email);
  }
};
