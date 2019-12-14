const cityRepo = require("../repositories/city.repo");

module.exports = {
  getAll: async function() {
    return await cityRepo.find({});
  },
  getById: async function(id) {
    return await cityRepo.findById(id);
  }
};
