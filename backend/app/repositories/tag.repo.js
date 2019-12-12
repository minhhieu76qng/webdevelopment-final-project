const ObjectId = require("mongoose").Types.ObjectId;
const { Tag } = require("../models/tag.model");

async function findWithOption(option = {}, offset, limit) {
  console.log(offset);
  console.log(limit);
  return Tag.find(option || {})
    .skip(offset * limit)
    .limit(limit);
}

module.exports = {
  add: async function({ name }) {
    const newTag = new Tag({ name });

    return await newTag.save();
  },

  deleteMore: async function(tags) {
    return await Tag.updateMany(
      {
        _id: {
          $in: tags.map(val => ObjectId(val))
        }
      },
      { $set: { isDeleted: true } }
    );
  },

  find: async function(option = {}, offset, limit) {
    return await findWithOption(option, offset, limit);
  },

  findActive: async function(limit, offset) {
    return await findWithOption({ isDeleted: false }, limit, offset);
  },

  updateTag: async function({ _id, tagName, isDeleted }) {
    return await Tag.findOneAndUpdate(
      { _id: _id },
      { name: tagName, isDeleted: isDeleted },
      { new: true }
    );
  },

  count: async function() {
    return await Tag.countDocuments();
  }
};
