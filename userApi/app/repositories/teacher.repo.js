const { Teacher } = require("../models/teacher.model");

module.exports = {
  add: async function(data, session = null) {
    const teacher = new Teacher(data);
    return await teacher.save({ session });
  }
};
