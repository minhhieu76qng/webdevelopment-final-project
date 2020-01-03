const { Contract } = require("../models/contract.model");
const { CONTRACT_STATUS } = require("../constance/constance");

module.exports = {
  sendRequest: async function(payload, session = null) {
    payload.status = CONTRACT_STATUS.pending;
    payload.historyStatus = [
      { stt: CONTRACT_STATUS.pending, date: payload.startingDate }
    ];
    const ct = new Contract(payload);

    return await ct.save({ session });
  }
};
