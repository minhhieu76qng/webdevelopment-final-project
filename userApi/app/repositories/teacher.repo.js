const httpCode = require('http-status-codes');
const { ErrorHandler } = require('../helpers/error.helper');
const { Teacher } = require("../models/teacher.model");

module.exports = {
  add: async function (data, session = null) {
    const teacher = new Teacher(data);
    try {
      return await teacher.save({ session });
    }
    catch (err) {
      throw new ErrorHandler(httpCode.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
  }
};
