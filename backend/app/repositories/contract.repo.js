const _ = require("lodash");
const { ObjectId } = require("mongoose").Types;
const { Contract } = require("../models/contract.model");
const { CONTRACT_STATUS } = require("../constance/constance");

module.exports = {
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

  getContractDetail: async function(contractId, accountId) {
    const contracts = await this.findByAccountId(accountId, 1, 0, {
      _id: ObjectId(contractId)
    });
    if (!(_.isArray(contracts) && contracts.length > 0)) {
      return null;
    }
    return contracts[0];
  },

  // -------------- SET ---------------------

  sendRequest: async function(payload, session = null) {
    const temp = { ...payload };

    temp.status = CONTRACT_STATUS.pending;
    temp.historyStatus = [{ stt: CONTRACT_STATUS.pending, date: new Date() }];
    const ct = new Contract(temp);

    return await ct.save({ session });
  },

  updateContractsStatus: async function(
    contracts,
    contractStatus,
    acceptedDate = new Date()
  ) {
    const statusObj = { stt: contractStatus, date: acceptedDate };
    return await Contract.updateMany(
      { _id: { $in: contracts } },
      { status: contractStatus, $push: { historyStatus: statusObj } }
    );
  },

  acceptContracts: async function(contracts, acDate) {
    const statusObj = {
      stt: CONTRACT_STATUS.teaching,
      date: acDate
    };
    const result = await Promise.all(
      contracts.map(val =>
        Contract.updateOne(
          {
            _id: val.contractId
          },
          {
            contractName: val.name,
            status: CONTRACT_STATUS.teaching,
            $push: { historyStatus: statusObj }
          }
        )
      )
    );

    let totalModified = 0;
    result.map(v => {
      if (v && v.nModified >= 0) {
        totalModified += v.nModified;
      }
    });
    return totalModified;
  },

  // -------------- COUNT --------------------
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
