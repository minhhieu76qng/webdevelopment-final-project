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
        $unwind: {
          path: "$student"
        }
      },
      {
        $lookup: {
          from: "accounts",
          localField: "teacherAId",
          foreignField: "_id",
          as: "teacher"
        }
      },
      {
        $unwind: {
          path: "$teacher"
        }
      },
      {
        $lookup: {
          from: "teachers",
          localField: "teacherAId",
          foreignField: "accountId",
          as: "teacher.teacherInfo"
        }
      },
      {
        $unwind: {
          path: "$teacher.teacherInfo"
        }
      }
    ]);

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

  getAllDoneContractOfTeacher: async function(accountId) {
    return Contract.find({
      teacherAId: accountId,
      $or: [
        {
          status: CONTRACT_STATUS.paid
        },
        {
          status: CONTRACT_STATUS.complain
        }
      ]
    });
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
    acceptedDate = new Date(),
    session = null
  ) {
    const statusObj = { stt: contractStatus, date: acceptedDate };
    return await Contract.updateMany(
      { _id: { $in: contracts } },
      { status: contractStatus, $push: { historyStatus: statusObj } },
      {
        session
      }
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
