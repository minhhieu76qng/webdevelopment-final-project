const { Category } = require("../models/category.model");

module.exports = {
  getActives: async function() {
    return Category.find({ isDeleted: false });
  },
  getActiveById: async function(catId) {
    return Category.findOne({ _id: catId, isDeleted: false });
  }
};
