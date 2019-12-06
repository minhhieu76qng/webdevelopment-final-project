const mongoose = require("mongoose");
const _ = require("lodash");
const httpCode = require("http-status-codes");
const accountRepo = require("../repositories/account.repo");
const teacherRepo = require("../repositories/teacher.repo");
const mailService = require("./mail.service");
const { ErrorHandler } = require("../helpers/error.helper");
const accountHelper = require("../helpers/account.helper");
const {
  MIN_LENGTH_PASSWORD,
  ROLES
} = require("../constance/account.constance");

function validateString(field, message) {
  if (!_.isString(field)) {
    throw new ErrorHandler(httpCode.BAD_REQUEST, message);
  }
}

module.exports = {
  createNewLocalUser: async function(data) {
    if (
      !(
        data &&
        data.firstName &&
        data.lastName &&
        data.email &&
        data.password &&
        data.confirmPassword &&
        data.job
      )
    ) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Missing some fields!");
    }

    // validate data type
    validateString(data.firstName, "First name must be a string.");
    validateString(data.lastName, "Last name must be a string.");
    validateString(data.email, "Email must be a string.");
    validateString(data.password, "Password must be a string.");
    validateString(data.confirmPassword, "Confirm password must be a string.");
    validateString(data.job, "Job must be a string.");

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

    if (!(data.password === data.confirmPassword)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Password not match.");
    }

    if (!(data.job === ROLES.student || data.job === ROLES.teacher)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Job is not valid.");
    }

    // save user
    const _session = await mongoose.startSession();
    _session.startTransaction();

    try {
      // checking email
      const isExist = await this.findByEmail(data.email);

      if (isExist) {
        throw new ErrorHandler(httpCode.CONFLICT, "Email is already taken.");
      }

      const account = await accountRepo.add(data, _session);

      if (data.job === ROLES.teacher) {
        const teacher = await teacherRepo.add(
          { accountId: account._id },
          _session
        );
      }

      // send verification email
      const result = await mailService.sendVerificationMail({
        _id: account._id,
        email: account.local.email
      });

      await _session.commitTransaction();
      _session.endSession();

      return account;
    } catch (err) {
      await _session.abortTransaction();
      _session.endSession();
      throw err;
    }
  },

  createNewSocialAccount: async function(accountData) {
    if (
      !(
        accountData.name &&
        accountData.name.firstName &&
        accountData.name.lastName
      )
    ) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Missing name.");
    }

    if (!(accountData.google || accountData.facebook)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Missing social account information."
      );
    }

    if (
      accountData.google &&
      !(accountData.google.id || accountData.google.email)
    ) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Missing Google id or Google email."
      );
    }

    if (
      accountData.facebook &&
      !(accountData.facebook.id || accountData.facebook.email)
    ) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Missing Facebook id or Facebook email."
      );
    }

    if (
      !(
        accountData.role === ROLES.student || accountData.role === ROLES.teacher
      )
    ) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Job is not valid.");
    }

    // save user
    const _session = await mongoose.startSession();
    _session.startTransaction();

    try {
      const newAccount = await accountRepo.addSocialAccount(
        accountData,
        _session
      );

      if (accountData.role === ROLES.teacher) {
        const teacher = await teacherRepo.add(
          { accountId: newAccount._id },
          _session
        );
      }

      await _session.commitTransaction();
      _session.endSession();

      return newAccount;
    } catch (err) {
      await _session.abortTransaction();
      _session.endSession();
      throw err;
    }
  },

  findByEmail: async function(email) {
    return await accountRepo.findByEmail(email);
  },

  findWithFacebookId: function(facebookId) {},

  findWithGoogleId: async function(googleId) {
    return await accountRepo.findWithGoogleId(googleId);
  }
};
