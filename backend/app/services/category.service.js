const categoryRepo = require("../repositories/category.repo");

module.exports = {
  getAvtives: async function() {
    return await categoryRepo.getActives();
  },

  getActiveById: async function(catId) {
    return await categoryRepo.getActiveById(catId);
  }
};
