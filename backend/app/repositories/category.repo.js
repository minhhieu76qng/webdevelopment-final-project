const { Category } = require("../models/category.model");

module.exports = {
  getActives: async function() {
    return Category.find({ isDeleted: false });
  }
};
