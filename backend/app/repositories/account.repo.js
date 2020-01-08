const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;
const { Account } = require("../models/account.model");
const { SALT_ROUND, ROLES } = require("../constance/constance");

module.exports = {
  addUser: async function(data, session = null) {
    const accountObject = {
      local: {
        email: data.email,
        password: data.password
      },
      name: {
        firstName: data.firstName,
        lastName: data.lastName
      },
      role: data.job
    };

    const hash = await bcrypt.hash(accountObject.local.password, SALT_ROUND);
    accountObject.local.password = hash;

    const newAccount = new Account(accountObject);
    return await newAccount.save({ session: session });
  },

  addAdmin: async function(data, session = null) {
    const accountObject = {
      local: {
        email: data.email,
        password: data.password
      },
      name: {
        firstName: data.firstName,
        lastName: data.lastName
      },
      role: data.job
    };

    accountObject.isVerified = true;
    accountObject.role = ROLES.admin;

    const hash = await bcrypt.hash(accountObject.local.password, SALT_ROUND);
    accountObject.local.password = hash;

    const newAccount = new Account(accountObject);
    return await newAccount.save({ session: session });
  },

  addSocialAccount: async function(account, session = null) {
    account.isVerified = true;
    const newAccount = new Account(account);
    return await newAccount.save({ session: session });
  },

  findByEmail: async function(email) {
    return await Account.findOne({ "local.email": email });
  },

  findWithGoogleId: async function(googleId) {
    return await Account.findOne({ "google.id": googleId });
  },

  findWithFacebookId: async function(facebookId) {
    return await Account.findOne({ "facebook.id": facebookId });
  },

  find: async function(offset, limit) {
    return await Account.find({})
      .skip(offset * limit)
      .limit(limit);
  },

  findById: async function(id) {
    return await Account.findById(id);
  },

  count: async function() {
    return await Account.countDocuments();
  },

  getInfo: async function(id) {
    return await Account.aggregate([
      {
        $match: {
          _id: ObjectId(id)
        }
      },
      {
        $lookup: {
          from: "teachers",
          localField: "_id",
          foreignField: "accountId",
          as: "teacher"
        }
      },
      {
        $unwind: {
          path: "$teacher",
          preserveNullAndEmptyArrays: true
        }
      }
    ]);
  },

  updateAccount: async function(account) {
    return await Account.updateOne({ _id: account._id }, account);
  },

  updateAvatar: async function(id, avatar) {
    return await Account.updateOne({ _id: id }, { avatar: avatar });
  },

  updateCity: async function(accountId, cityId, session = null) {
    return await Account.updateOne(
      { _id: accountId },
      { "address.city": cityId },
      { session }
    );
  },

  setBlock: async function(accountId, isBlock) {
    return await Account.updateOne({ _id: accountId }, { isBlock });
  },

  setVerification: async function(accountId) {
    return await Account.updateOne({ _id: accountId }, { isVerified: true });
  },

  changePassword: async function(accountId, newPassword) {
    const hash = await bcrypt.hash(newPassword, SALT_ROUND);
    return await Account.updateOne(
      { _id: accountId },
      { "local.password": hash }
    );
  }
};
