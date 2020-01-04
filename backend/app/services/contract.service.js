const mongoose = require("mongoose");
const _ = require("lodash");
const ObjectId = require("mongoose").Types.ObjectId;
const httpCode = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error.helper");
const teacherService = require("./teacher.service");
const chatService = require("./chat.service");
const contractRepo = require("../repositories/contract.repo");

const paginateValidation = (accountId, limit, page) => {
  if (!ObjectId.isValid(accountId)) {
    throw new ErrorHandler(httpCode.BAD_REQUEST, "Require a valid Id");
  }

  limit = _.toInteger(limit);
  page = _.toInteger(page);

  if (!(_.isInteger(limit) && _.isInteger(page))) {
    throw new ErrorHandler(
      httpCode.BAD_REQUEST,
      "Limit and page must be a number."
    );
  }
  if (limit <= 1) {
    limit = 10;
  }

  if (page <= 0) {
    page = 1;
  }

  return { limit, page };
};

module.exports = {
  // id student, id teacher, starting date, hours, price/h, messageDescription
  sendRequest: async function({
    teacherId,
    studentAccountId,
    startingDate,
    rentalHour,
    description
  }) {
    // kiểm tra điều kiện đầu vào dữ liệu
    if (!(ObjectId.isValid(teacherId) && _.isString(teacherId))) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Teacher Id is not valid.");
    }

    if (!ObjectId.isValid(studentAccountId) && _.isString(studentAccountId)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Student Id is not valid.");
    }

    const sDate = new Date(startingDate);
    const current = new Date();

    if (!(sDate && _.isDate(sDate))) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Starting date is not valid."
      );
    }

    if (!(sDate >= current)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Starting date must be greater than current."
      );
    }
    if (!(_.isNumber(rentalHour) && rentalHour >= 1)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Rental hour must be greater than one."
      );
    }

    if (!(_.isString(description) && description.length > 0)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Contract desciption is required."
      );
    }

    // kiểm tra giáo viên có tồn tại hay không và đã active hay chưa
    const teacher = await teacherService.getTeacherById(teacherId);

    if (!(teacher && teacher.account && teacher.account._id)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Teacher is not exist.");
    }

    // payload
    let payload = {
      teacherAId: teacher.account._id,
      studentAId: studentAccountId,
      startingDate: sDate,
      rentalHour,
      requestMsg: description,
      pricePerHour: teacher.pricePerHour
    };

    // tạo hợp động
    const contractResult = await contractRepo.sendRequest(payload);

    // kiểm tra room có tồn tại hay không
    const existRoom = await chatService.findRoomWithUsers(
      payload.studentAId,
      payload.teacherAId
    );
    // nếu không tồn tại -> tạo room
    if (!existRoom) {
      existRoom = await chatService.createRoom(
        payload.studentAId,
        payload.teacherAId
      );
    }
    // gửi tin nhắn
    const sendingMessage = {
      from: payload.studentAId,
      roomId: _.toString(existRoom._id),
      msg:
        "Hi teacher, I have just sent to you a contract. Please confirm this if you can help me. Thank you.",
      date: current
    };
    const chatResult = await chatService.createMessage(sendingMessage);

    return {
      contractId: contractResult._id,
      message: chatResult.message
    };
  },

  getAllContracts: async function(accountId, limit, page) {
    const pagination = paginateValidation(accountId, limit, page);

    const counter = await contractRepo.count(accountId);
    let total = 0;
    if (counter.length > 0) {
      total = [{ total }];
    }

    const contracts = await contractRepo.findByAccountId(
      accountId,
      pagination.limit,
      pagination.page - 1
    );

    return {
      contracts,
      total,
      limit,
      page
    };
  },

  getAcceptedContracts: async function(accountId, limit, page) {
    const pagination = paginateValidation(accountId, limit, page);

    const counter = await contractRepo.countActive(accountId);
    let total = 0;
    if (counter.length > 0) {
      total = [{ total }];
    }

    const contracts = await contractRepo.getActiveContracts(
      accountId,
      pagination.limit,
      pagination.page - 1
    );
    return {
      contracts,
      total,
      limit,
      page
    };
  },

  getPendingContracts: async function(accountId, limit, page) {
    const pagination = paginateValidation(accountId, limit, page);

    const counter = await contractRepo.countPending(accountId);
    let total = 0;
    if (counter.length > 0) {
      total = [{ total }];
    }

    const contracts = await contractRepo.getPendingContracts(
      accountId,
      pagination.limit,
      pagination.page - 1
    );

    return {
      contracts,
      total,
      limit,
      page
    };
  },

  rejectContract: async function(contractId) {}
};
