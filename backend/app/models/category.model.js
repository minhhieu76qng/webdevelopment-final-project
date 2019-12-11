const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    parrentId: {
      type: mongoose.Types.ObjectId,
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Category = mongoose.model("categories", CategorySchema);

module.exports = {
  Category
};
