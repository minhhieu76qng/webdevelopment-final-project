const _ = require("lodash");
const mongoose = require("mongoose");
const httpCode = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error.helper");
const teacherRepo = require("../repositories/teacher.repo");
const accountRepo = require("../repositories/account.repo");
const tagService = require("./tag.service");
const categoryService = require("./category.service");
const cityService = require("./city.service");
const { MIN_PRICE, MAX_PRICE } = require("../constance/constance");

module.exports = {
  getTeacherTags: async function(accountId) {
    const arr = await teacherRepo.getTags(accountId);

    if (arr && _.isArray(arr) && arr.length > 0) {
      let result = { ...arr[0] };
      if (_.isArray(result.tag_list)) {
        result.tags = [...arr[0].tag_list];
        console.log(result.tags);
        result.tags = result.tags.filter(t => t.isDeleted === false);
      }
      delete result.tag_list;

      return result;
    }
    return null;
  },

  updatePrice: async function(accountId, newPrice) {
    const tmpPrice = _.toInteger(newPrice);

    if (!_.isNumber(tmpPrice)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "New price must be a number."
      );
    }

    if (tmpPrice < MIN_PRICE) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        `New price must be greater than or equal to ${MIN_PRICE}.`
      );
    }

    if (tmpPrice > MAX_PRICE) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        `New price must be lower than or equal to ${MAX_PRICE}.`
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
      tags.map(val => tagService.getActiveById(val))
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

  getTeachersByCatId: async function(catId) {
    if (!catId) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Category ID is not exist.");
    }

    const teachers = await teacherRepo.findTeachersByCatId(catId);

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
      teachers: temp
    };
  },

  getTeacherById: async function(teacherId) {
    if (!teacherId) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Teacher ID is not valid.");
    }

    const result = await teacherRepo.findTeacherById(teacherId);
    let temp = null;

    if (_.isArray(result) && result.length > 0) {
      temp = { ...result[0] };
    }

    if (temp) {
      delete temp.tags_out;
      delete temp.categories_out;

      delete temp.cities_out;
      temp.tags = [...result[0].tags_out];

      if (temp.account.address) {
        delete temp.account.address.city;
        temp.account.address.city = result[0].cities_out[0];
      }

      delete temp.catId;
      temp.categories = result[0].categories_out[0];

      if (temp.account.local) {
        delete temp.account.local.password;
      }
    }

    return temp;
  },

  firstUpdate: async function(accountId, data) {
    let payload = { ...data };
    payload.price = _.toNumber(payload.price);
    // validate input
    if (!(_.isString(payload.city) && payload.city.length > 0)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "City must be a string.");
    }
    if (!(_.isString(payload.category) && payload.category.length > 0)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Category must be a string."
      );
    }
    if (!(_.isArray(payload.tags) && payload.tags.length > 0)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Tags must be a array with at least one item."
      );
    }
    if (!_.isNumber(payload.price)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Price must be a number.");
    }

    if (!(payload.price >= MIN_PRICE && payload.price <= MAX_PRICE)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        `Price must be between ${MIN_PRICE} and ${MAX_PRICE}.`
      );
    }

    // tim teacher
    const teacher = await teacherRepo.findTeacherByAccountId(accountId);

    if (!teacher) {
      throw new ErrorHandler(httpCode.UNAUTHORIZED, "You are not a teacher.");
    }

    if (teacher.firstUpdated === true) {
      throw new ErrorHandler(
        httpCode.FORBIDDEN,
        "You are not allow to update again."
      );
    }

    // validate payload trong db
    // kiem tra category co trong db
    const [category, city] = await Promise.all([
      categoryService.getActiveById(payload.category),
      cityService.getById(payload.city)
    ]);

    if (!category) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Category is not exist.");
    }
    if (!city) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "City is not exist.");
    }

    let validTags = await Promise.all(
      payload.tags.map(val => tagService.getActiveById(val))
    );
    if (!validTags) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Tags are not exist.");
    }

    validTags = validTags.filter(val => val !== null);
    validTags = validTags.map(val => val._id);

    if (validTags.length === 0) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Missing tags.");
    }

    const _session = await mongoose.startSession();
    _session.startTransaction();
    try {
      const teacherResult = await teacherRepo.firstUpdate(
        teacher._id,
        { ...payload, tags: validTags },
        _session
      );
      const accountResult = await accountRepo.updateCity(
        teacher.accountId,
        payload.city,
        _session
      );

      await _session.commitTransaction();
      _session.endSession();

      return {
        isUpdated:
          teacherResult.nModified === 1 && accountResult.nModified === 1
      };
    } catch (err) {
      await _session.abortTransaction();
      _session.endSession();
      throw err;
    }
  },

  getTeacherByAccountId: async function(accountId) {
    return await teacherRepo.findTeacherByAccountId(accountId);
  },

  updateStatisticsAfterPayment: async function(
    accountId,
    { hours, price, completedRate },
    _session = null
  ) {
    if (!(_.isNumber(hours) && hours >= 1)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Hours worked must be positive number."
      );
    }

    if (!(_.isNumber(price) && price >= MIN_PRICE && price <= MAX_PRICE)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        `Price must be between ${MIN_PRICE} and ${MAX_PRICE}.`
      );
    }

    if (!(_.isNumber(completedRate) && completedRate >= 0)) {
      throw new ErrorHandler(
        "Completed rate must be a number and greater or equal to 0."
      );
    }
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Account ID is not valid.");
    }

    const teacher = await teacherRepo.findTeacherByAccountId(accountId);

    if (!teacher) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Teacher is not exist.");
    }

    const result = await teacherRepo.updateAfterPayment(
      teacher._id,
      { price, hours, completedRate },
      _session
    );

    return { isUpdated: result.nModified };
  }
};
