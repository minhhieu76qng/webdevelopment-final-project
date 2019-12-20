const _ = require("lodash");
const httpCode = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error.helper");

const tagRepo = require("../repositories/tag.repo");

module.exports = {
  addNewTag: async function(tag) {
    if (!tag) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Missing tag name.");
    }

    if (!_.isString(tag)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Type of tag name is not valid."
      );
    }

    if (tag.length <= 0) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Tag name can't be empty.");
    }

    const newTag = await tagRepo.add({ name: tag });
    return newTag;
  },

  getTagTable: async function(offset, limit) {
    const [list, total] = await Promise.all([
      tagRepo.find({}, offset, limit),
      tagRepo.count()
    ]);

    return {
      list,
      total
    };
  },

  deleteTags: async function(tags) {
    if (!_.isArray(tags)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Deleted tags must be an array."
      );
    }

    if (tags.length === 0) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Deleted tags can't be empty"
      );
    }

    return await tagRepo.deleteMore(tags);
  },

  editTag: async function({ _id, tagName, isDeleted }) {
    if (!tagName || !_.isString(tagName) || tagName.length === 0) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Tag name must be a string."
      );
    }

    if (!_.isBoolean(isDeleted)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Tag status must be true or false."
      );
    }

    return await tagRepo.updateTag({ _id, tagName, isDeleted });
  },

  getActives: async function() {
    return await tagRepo.findActive();
  },

  isValidTag: async function(tagId) {
    if (!_.isString(tagId)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Tag id must be a string");
    }
    return await tagRepo.findOne(tagId);
  }
};
