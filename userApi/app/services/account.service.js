const mongoose = require("mongoose");
const _ = require("lodash");
const httpCode = require("http-status-codes");
const accountRepo = require("../repositories/account.repo");
const teacherRepo = require("../repositories/teacher.repo");
const mailService = require("./mail.service");
const { ErrorHandler } = require("../helpers/error.helper");
const { isEmail } = require("../helpers/account.helper");
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
  createNewUser: async function(data) {
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
    if (!isEmail(data.email)) {
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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const account = await accountRepo.add(data, session);

      if (data.job === ROLES.teacher) {
        const teacher = await teacherRepo.add(
          { accountId: account._id },
          session
        );
      }

      // send verification email
      const result = await mailService.sendVerificationMail({
        _id: account._id,
        email: account.local.email
      });

      await session.commitTransaction();
      session.endSession();

      return {
        _id: account._id,
        name: account.name
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
};
