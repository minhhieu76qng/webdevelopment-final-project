const _ = require("lodash");
const httpCode = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error.helper");
const teacherRepo = require("../repositories/teacher.repo");
const tagService = require("./tag.service");
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

  updatePrice: async function(accountId, newPrice) {
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

    // tim teacher
    const teacher = await teacherRepo.findTeacherByAccountId(accountId);

    if (!teacher) {
      throw new ErrorHandler(httpCode.UNAUTHORIZED, "You are not a teacher.");
    }

    const result = await teacherRepo.updatePrice(teacher._id, tmpPrice);

    return {
      isUpdated: result.nModified === 1
    };
  },

  updateTags: async function(accountId, tags) {
    if (!_.isArray(tags)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Tags must be a array.");
    }

    // tim teacher
    const teacher = await teacherRepo.findTeacherByAccountId(accountId);

    if (!teacher) {
      throw new ErrorHandler(httpCode.UNAUTHORIZED, "You are not a teacher.");
    }

    // kiem tra tags co hop le hay khong
    const validTags = await Promise.all(
      tags.map(val => tagService.isValidTag(val))
    );

    // filter valid id
    const skillTags = tags.filter(val => {
      for (let i = 0; i < validTags.length; i += 1) {
        if (validTags[i]._id == val) {
          return true;
        }
      }
    });

    if (skillTags.length < 1) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Skill tags must be at least 1 tags."
      );
    }

    const result = await teacherRepo.updateTags(teacher._id, skillTags);

    return {
      isUpdated: result.nModified >= 1
    };
  },

  updateIntro: async function(accountId, intro) {
    if (!intro) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Missing intro object.");
    }
    if (!_.isString(intro.title)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Title must be a string.");
    }
    if (!_.isString(intro.content)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Content must be a string.");
    }

    // tim teacher
    const teacher = await teacherRepo.findTeacherByAccountId(accountId);

    if (!teacher) {
      throw new ErrorHandler(httpCode.UNAUTHORIZED, "You are not a teacher.");
    }

    const result = await teacherRepo.updateIntro(teacher._id, intro);

    return {
      isUpdated: result.nModified === 1
    };
  },

  getImpressedTeacher: async function(limit) {
    const teachers = await teacherRepo.findImpressedTeachers(limit);
    // format data
    let temp = [...teachers];
    temp = temp.map(tch => {
      let tmp = { ...tch };
      delete tmp.tags_out;
      delete tmp.categories_out;

      delete tmp.cities_out;
      tmp.tags = [...tch.tags_out];

      if (tmp.account.address) {
        delete tmp.account.address.city;
        tmp.account.address.city = tch.cities_out[0];
      }

      delete tmp.catId;
      tmp.categories = tch.categories_out[0];

      if (tmp.account.local) {
        delete tmp.account.local.password;
      }

      return tmp;
    });
    return temp;
  },

  getTeachersByCatId: async function(catId, limit, offset) {
    if (!catId) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Category ID is not exist.");
    }

    let [teachers, total] = await Promise.all([
      teacherRepo.findTeachersByCatId(catId, limit, offset),
      teacherRepo.countByCatId(catId)
    ]);

    let temp = [...teachers];
    temp = temp.map(tch => {
      let tmp = { ...tch };
      delete tmp.tags_out;
      delete tmp.categories_out;

      delete tmp.cities_out;
      tmp.tags = [...tch.tags_out];

      if (tmp.account.address) {
        delete tmp.account.address.city;
        tmp.account.address.city = tch.cities_out[0];
      }

      delete tmp.catId;
      tmp.categories = tch.categories_out[0];

      if (tmp.account.local) {
        delete tmp.account.local.password;
      }

      return tmp;
    });

    return {
      teachers: temp,
      total
    };
  }
};
