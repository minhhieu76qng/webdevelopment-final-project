const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TeacherSchema = new Schema(
  {
    accountId: {
      type: mongoose.Types.ObjectId,
      unique: true
    },
    tags: [
      {
        type: mongoose.Types.ObjectId
      }
    ],
    intro: {
      introTitle: String,
      introContent: String
    },
    completedRate: {
      type: Number,
      default: 100
    },
    pricePerHour: Number,
    totalJob: {
      type: Number,
      default: 0
    },
    totalEarned: {
      type: Number,
      default: 0
    },
    hoursWorked: {
      type: Number,
      default: 0
    },
    intro: {
      title: String,
      content: String
    },
    catId: {
      type: mongoose.Types.ObjectId
    },
    firstUpdated: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Teacher = mongoose.model("teachers", TeacherSchema);

module.exports = {
  Teacher
};
