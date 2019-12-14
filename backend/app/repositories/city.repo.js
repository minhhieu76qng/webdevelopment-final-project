const { City } = require("../models/city.model");

module.exports = {
  find: async function(filter) {
    return await City.find(filter);
  },
  findById: async function(id) {
    return await City.findById(id);
  }
};
