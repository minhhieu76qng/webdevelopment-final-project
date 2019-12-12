const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Tag = mongoose.model("tags", TagSchema);

module.exports = { Tag };
