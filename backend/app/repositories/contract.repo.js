const _ = require("lodash");
const { Contract } = require("../models/contract.model");
const { CONTRACT_STATUS } = require("../constance/constance");

module.exports = {
  sendRequest: async function(payload, session = null) {
    const temp = { ...payload };

    temp.status = CONTRACT_STATUS.pending;
    temp.historyStatus = [
      { stt: CONTRACT_STATUS.pending, date: temp.startingDate }
    ];
    const ct = new Contract(temp);

    return await ct.save({ session });
  },

  findByAccountId: async function(accountId, limit, offset, filter = {}) {
    let contracts = await Contract.aggregate([
      {
        $match: {
          $or: [{ teacherAId: accountId }, { studentAId: accountId }]
        }
      },
      {
        $match: filter
      },
      {
        $sort: {
          startingDate: -1
        }
      },
      {
        $skip: offset * limit
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: "accounts",
          localField: "studentAId",
          foreignField: "_id",
          as: "student"
        }
      },
      {
        $lookup: {
          from: "accounts",
          localField: "teacherAId",
          foreignField: "_id",
          as: "teacher"
        }
      }
    ]);

    contracts = contracts.map(ct => {
      if (_.isArray(ct.student) && ct.student.length > 0) {
        ct.student = ct.student[0];
      }
      if (_.isArray(ct.teacher) && ct.teacher.length > 0) {
        ct.teacher = ct.teacher[0];
      }

      return ct;
    });

    return contracts;
  },

  getActiveContracts: async function(accountId, limit, offset) {
    const filter = {
      status: {
        $ne: CONTRACT_STATUS.pending
      }
    };
    return await this.findByAccountId(accountId, limit, offset, filter);
  },

  getPendingContracts: async function(accountId, limit, offset) {
    const filter = {
      status: {
        $eq: CONTRACT_STATUS.pending
      }
    };
    return await this.findByAccountId(accountId, limit, offset, filter);
  },
  count: async function(accountId, filter = {}) {
    return await Contract.aggregate([
      {
        $match: {
          $or: [{ teacherAId: accountId }, { studentAId: accountId }]
        }
      },
      {
        $match: filter
      },
      {
        $count: "total"
      }
    ]);
  },
  countActive: async function(accountId) {
    const filter = {
      status: {
        $ne: CONTRACT_STATUS.pending
      }
    };
    return await this.count(accountId, filter);
  },
  countPending: async function(accountId) {
    const filter = {
      status: {
        $eq: CONTRACT_STATUS.pending
      }
    };
    return await this.count(accountId, filter);
  }
};
