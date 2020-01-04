const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContractSchema = new Schema(
  {
    studentAId: {
      type: mongoose.Types.ObjectId,
      requried: true
    },
    teacherAId: {
      type: mongoose.Types.ObjectId,
      requried: true
    },
    requestMsg: {
      type: String,
      required: true
    },
    contractName: {
      type: String,
      default: ""
    },
    startingDate: {
      type: Date,
      required: true
    },
    rentalHour: {
      type: Number,
      required: true
    },
    pricePerHour: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    historyStatus: [
      {
        stt: String,
        date: Date
      }
    ],
    comment: {
      rate: Number,
      text: String,
      date: Date
    }
  },
  { timestamps: true }
);

const Contract = mongoose.model("contracts", ContractSchema);

module.exports = {
  Contract
};
