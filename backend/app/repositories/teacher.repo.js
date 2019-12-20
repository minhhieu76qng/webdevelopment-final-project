const httpCode = require("http-status-codes");
const ObjectId = require("mongoose").Types.ObjectId;
const { ErrorHandler } = require("../helpers/error.helper");
const { Teacher } = require("../models/teacher.model");

module.exports = {
  add: async function(data, session = null) {
    const teacher = new Teacher(data);
    try {
      return await teacher.save({ session });
    } catch (err) {
      throw new ErrorHandler(
        httpCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  },

  getTags: async function(accountId) {
    return Teacher.aggregate([
      {
        $match: {
          accountId: ObjectId(accountId)
        }
      },
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tag_list"
        }
      },
      {
        $match: {
          "tag_list.isDeleted": false
        }
      },
      {
        $project: {
          _id: "$_id",
          completedRate: "$completedRate",
          totalJob: "$totalJob",
          totalEarned: "$totalEarned",
          hoursWorked: "$hoursWorked",
          accountId: "$accountId",
          pricePerHour: "$pricePerHour",
          tag_list: {
            _id: 1,
            name: 1
          }
        }
      }
    ]);
  },

  updatePrice: async function(id, newPrice) {
    return await Teacher.updateOne({ _id: id }, { pricePerHour: newPrice });
  },

  updateTags: async function(id, tags) {
    return await Teacher.updateOne({ _id: id }, { tags: tags });
  },

  findTeacherByAccountId: async function(id) {
    return await Teacher.findOne({ accountId: id });
  }
};
