const _ = require("lodash");
const httpCode = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error.helper");
const teacherRepo = require("../repositories/teacher.repo");
module.exports = {
  getTeacherTags: async function(accountId) {
    const arr = await teacherRepo.getTags(accountId);
    if (arr && _.isArray(arr) && arr.length > 0) {
      let result = { ...arr[0] };
      delete result.tag_list;
      result.tags = [...arr[0].tag_list];
      return result;
    }
    return null;
  },

  updatePrice: async function(id, newPrice) {
    const MIN = 1;

    const tmpPrice = _.toInteger(newPrice);

    if (!_.isNumber(tmpPrice)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "New price must be a number."
      );
    }

    if (tmpPrice < MIN) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        `New price must be greater than or equal to ${MIN}.`
      );
    }

    const result = await teacherRepo.updatePrice(id, tmpPrice);

    return {
      isUpdated: result.nModified === 1
    };
  }
};
