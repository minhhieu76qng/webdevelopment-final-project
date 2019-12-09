const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    local: {
      email: {
        type: String,
        index: true,
        unique: true,
        sparse: true
      },
      password: String
    },
    facebook: {
      id: String,
      email: String
    },
    google: {
      id: String,
      email: String
    },
    name: {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      }
    },
    avatar: String,
    address: String,
    role: {
      type: String,
      required: true
    },
    isBlock: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Account = mongoose.model("accounts", AccountSchema);

module.exports = {
  Account
};
