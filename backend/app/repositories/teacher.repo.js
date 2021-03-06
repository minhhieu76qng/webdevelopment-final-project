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
        $project: {
          _id: 1,
          completedRate: 1,
          totalJob: 1,
          totalEarned: 1,
          hoursWorked: 1,
          accountId: 1,
          pricePerHour: 1,
          intro: 1,
          catId: 1,
          tag_list: {
            _id: 1,
            name: 1,
            isDeleted: 1
          },
          firstUpdated: 1
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
  },

  updateIntro: async function(id, intro) {
    return await Teacher.updateOne({ _id: id }, { intro: intro });
  },

  findImpressedTeachers: async function(limit) {
    return await Teacher.aggregate([
      {
        $sort: {
          completedRate: -1
        }
      },
      {
        $limit: limit
      },
      {
        $match: {
          firstUpdated: true
        }
      },
      {
        $lookup: {
          from: "accounts",
          localField: "accountId",
          foreignField: "_id",
          as: "account"
        }
      },
      {
        $match: {
          "account.isBlock": false,
          "account.isVerified": true
        }
      },
      {
        $unwind: {
          path: "$account",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags_out"
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "catId",
          foreignField: "_id",
          as: "categories_out"
        }
      },
      {
        $lookup: {
          from: "cities",
          localField: "account.address.city",
          foreignField: "_id",
          as: "cities_out"
        }
      },
      {
        $match: {
          "categories_out.isDeleted": false,
          "tags_out.isDeleted": false
        }
      },
      {
        $project: {
          _id: 1,
          completedRate: 1,
          totalJob: 1,
          totalEarned: 1,
          hoursWorked: 1,
          pricePerHour: 1,
          intro: 1,
          "account._id": 1,
          "account.google": 1,
          "account.facebook": 1,
          "account.local": 1,
          "account.name": 1,
          "account.avatar": 1,
          "account.address": 1,
          cities_out: 1,
          categories_out: 1,
          tags_out: 1
        }
      }
    ]);
  },

  findTeachersByCatId: async function(catId, limit, offset) {
    return await Teacher.aggregate([
      {
        $match: {
          catId: ObjectId(catId),
          firstUpdated: true
        }
      },
      {
        $sort: {
          completedRate: -1
        }
      },
      // {
      //   $limit: limit
      // },
      // {
      //   $skip: limit * offset
      // },
      {
        $lookup: {
          from: "accounts",
          localField: "accountId",
          foreignField: "_id",
          as: "account"
        }
      },
      {
        $match: {
          "account.isBlock": false,
          "account.isVerified": true
        }
      },
      {
        $unwind: {
          path: "$account",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags_out"
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "catId",
          foreignField: "_id",
          as: "categories_out"
        }
      },
      {
        $lookup: {
          from: "cities",
          localField: "account.address.city",
          foreignField: "_id",
          as: "cities_out"
        }
      },
      {
        $match: {
          "categories_out.isDeleted": false,
          "tags_out.isDeleted": false
        }
      },
      {
        $project: {
          _id: 1,
          completedRate: 1,
          totalJob: 1,
          totalEarned: 1,
          hoursWorked: 1,
          pricePerHour: 1,
          intro: 1,
          "account._id": 1,
          "account.google": 1,
          "account.facebook": 1,
          "account.local": 1,
          "account.name": 1,
          "account.avatar": 1,
          "account.address": 1,
          cities_out: 1,
          categories_out: 1,
          tags_out: 1
        }
      }
    ]);
  },

  countByCatId: async function(catId) {
    return await Teacher.where({
      catId: catId,
      firstUpdated: true
    }).countDocuments();
  },

  findTeacherById: async function(teacherId) {
    return await Teacher.aggregate([
      {
        $match: {
          _id: ObjectId(teacherId),
          firstUpdated: true
        }
      },
      {
        $lookup: {
          from: "accounts",
          localField: "accountId",
          foreignField: "_id",
          as: "account"
        }
      },
      {
        $match: {
          "account.isBlock": false,
          "account.isVerified": true
        }
      },
      {
        $unwind: {
          path: "$account",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags_out"
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "catId",
          foreignField: "_id",
          as: "categories_out"
        }
      },
      {
        $lookup: {
          from: "cities",
          localField: "account.address.city",
          foreignField: "_id",
          as: "cities_out"
        }
      },
      {
        $match: {
          "categories_out.isDeleted": false,
          "tags_out.isDeleted": false
        }
      },
      {
        $project: {
          _id: 1,
          completedRate: 1,
          totalJob: 1,
          totalEarned: 1,
          hoursWorked: 1,
          pricePerHour: 1,
          intro: 1,
          "account._id": 1,
          "account.google": 1,
          "account.facebook": 1,
          "account.local": 1,
          "account.name": 1,
          "account.avatar": 1,
          "account.address": 1,
          cities_out: 1,
          categories_out: 1,
          tags_out: 1
        }
      }
    ]);
  },

  firstUpdate: async function(
    teacherId,
    { category, price, tags },
    session = null
  ) {
    return Teacher.updateOne(
      { _id: teacherId },
      { catId: category, tags: tags, pricePerHour: price, firstUpdated: true },
      { session }
    );
  },

  updateAfterPayment: async function(teacherId, payload, session = null) {
    return await Teacher.updateOne(
      { _id: teacherId },
      {
        completedRate: payload.completedRate,
        $inc: {
          totalJob: 1,
          hoursWorked: payload.hours,
          totalEarned: payload.hours * payload.price
        }
      },
      {
        session
      }
    );
  }
};
