const _ = require("lodash");
const moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const httpCode = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error.helper");
const teacherService = require("./teacher.service");
const chatService = require("./chat.service");
const contractRepo = require("../repositories/contract.repo");
const paymentService = require("./payment.service");
const {
  CONTRACT_STATUS,
  MAX_LENGTH_CONTRACT_NAME
} = require("../constance/constance");

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
  if (limit < 1) {
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
    if (!(ObjectId.isValid(studentAccountId) && _.isString(studentAccountId))) {
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
    rentalHour = _.toNumber(rentalHour);
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
    let existRoom = await chatService.findRoomWithUsers(
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

  getContractById: async function(contractId, accountId) {
    if (!ObjectId.isValid(contractId)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Contract ID is not valid.");
    }
    if (!ObjectId.isValid(accountId)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Account ID is not valid.");
    }

    // get contract -> kiểm tra xem user này có tồn tại trong contract hay không
    const contract = await contractRepo.getContractDetail(
      contractId,
      accountId
    );

    if (!contract) {
      return { contract: null };
    }

    let isExist = false;

    if (_.toString(contract.teacherAId) === _.toString(accountId) && !isExist) {
      isExist = true;
    }

    if (_.toString(contract.studentAId) === _.toString(accountId) && !isExist) {
      isExist = true;
    }

    return {
      contract: isExist ? contract : null
    };
  },

  getAllContracts: async function(accountId, limit, page) {
    const pagination = paginateValidation(accountId, limit, page);

    const [counter, contracts] = await Promise.all([
      contractRepo.count(accountId),
      contractRepo.findByAccountId(
        accountId,
        pagination.limit,
        pagination.page - 1
      )
    ]);

    let total = 0;
    if (counter.length > 0) {
      total = counter[0].total;
    }

    return {
      contracts,
      total,
      ...pagination
    };
  },

  getAcceptedContracts: async function(accountId, limit, page) {
    const pagination = paginateValidation(accountId, limit, page);

    const [counter, contracts] = await Promise.all([
      contractRepo.countActive(accountId),
      contractRepo.getActiveContracts(
        accountId,
        pagination.limit,
        pagination.page - 1
      )
    ]);

    let total = 0;
    if (counter.length > 0) {
      total = counter[0].total;
    }
    return {
      contracts,
      total,
      ...pagination
    };
  },

  getPendingContracts: async function(accountId, limit, page) {
    const pagination = paginateValidation(accountId, limit, page);

    const [counter, contracts] = await Promise.all([
      contractRepo.countPending(accountId),
      contractRepo.getPendingContracts(
        accountId,
        pagination.limit,
        pagination.page - 1
      )
    ]);

    let total = 0;
    if (counter.length > 0) {
      total = counter[0].total;
    }
    return {
      contracts,
      total,
      ...pagination
    };
  },

  acceptContracts: async function(contractList, accountId, acceptDate) {
    // kiểm tra dữ liệu
    if (!(_.isArray(contractList) && contractList.length > 0)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "The contract list must be an array with at least one item."
      );
    }

    if (!ObjectId.isValid(accountId)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Teacher ID is not valid.");
    }

    const acDate = new Date(acceptDate);
    if (!moment(acDate).isValid()) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Accepted date is not valid."
      );
    }

    // lấy duy nhất item
    // lọc ra các item: là valid Contract ID, và name <= 35
    let tmp = [];
    for (let i = 0; i < contractList.length; i++) {
      let { contractId, name } = contractList[i];
      if (
        contractId &&
        ObjectId.isValid(contractId) &&
        _.isString(name) &&
        name.length <= MAX_LENGTH_CONTRACT_NAME
      ) {
        const exist = tmp.find(val => val.contractId === contractId);
        if (!exist) {
          tmp.push({ ...contractList[i] });
        }
      }
    }

    if (tmp.length === 0) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "All contracts are not valid."
      );
    }

    // lấy danh sách các contract được tải lên của accountId
    let contracts = await Promise.all(
      tmp.map(ct => this.getContractById(ct.contractId, accountId))
    );

    // destruct
    contracts = contracts.map(val => val.contract);

    // filter những giá trị sai
    contracts = contracts.filter(val => val !== null);

    if (contracts.length === 0) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "All contracts are not exist."
      );
    }

    contracts = contracts.filter(val => {
      if (
        !(
          val.status === CONTRACT_STATUS.pending &&
          new Date(val.startingDate) >= acDate
        )
      ) {
        return false;
      }

      return true;
    });

    if (contracts.length === 0) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "All contracts are not valid."
      );
    }

    contracts = contracts.map(val => val._id);

    let contractsWithName = [];
    contracts.map(ct => {
      const exist = tmp.find(
        val => _.toString(val.contractId) === _.toString(ct)
      );
      if (exist) {
        contractsWithName.push({ ...exist });
      }
    });

    // set lại trạng thái của hợp đồng sang teaching
    const totalModified = await contractRepo.acceptContracts(
      contractsWithName,
      acDate
    );

    return {
      isUpdated: totalModified > 0,
      nModified: totalModified,
      contracts: contractsWithName
    };
  },

  payContract: async function(contractId, studentAId) {
    if (!ObjectId.isValid(contractId)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Contract ID is not valid.");
    }
    if (!ObjectId.isValid(studentAId)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Student account ID is not valid."
      );
    }

    // kiểm tra hợp đồng có tồn tại hay không
    const contract = await contractRepo.getContractDetail(
      contractId,
      studentAId
    );

    if (!contract) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Contract is not exist.");
    }

    // người thanh toán không phải là học sinh
    if (!(_.toString(contract.student._id) === _.toString(studentAId))) {
      throw new ErrorHandler(
        httpCode.FORBIDDEN,
        "You do not authorize payment for this student's contract."
      );
    }

    // hợp đồng chỉ được thanh toán khi ở trạng thái teaching hoặc complain
    let isValidStatus = false;
    if (!isValidStatus && contract.status === CONTRACT_STATUS.teaching) {
      isValidStatus = true;
    }
    if (!isValidStatus && contract.status === CONTRACT_STATUS.complain) {
      isValidStatus = true;
    }
    if (!isValidStatus) {
      throw new ErrorHandler(
        httpCode.FORBIDDEN,
        'Only pay when contract status is "Teaching" or "Complain"'
      );
    }

    // transaction
    const _session = await mongoose.startSession();
    _session.startTransaction();
    try {
      // gọi một function để thanh toán tiền tới tài khoản của teacher
      paymentService.pay(contract.teacher._id, _session);

      // lấy danh sách các contracts của giáo viên này
      // lấy các contract paid / hoàn thành -> completed Rate
      const teacherContractList = await contractRepo.getAllDoneContractOfTeacher(
        contract.teacher._id
      );
      if (!teacherContractList) {
        throw new ErrorHandler(
          httpCode.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        );
      }
      const total = teacherContractList.length;
      let paidCount = 0;
      teacherContractList.map(ct => {
        if (ct.status === CONTRACT_STATUS.paid) {
          paidCount += 1;
        }
        return 1;
      });

      // cộng tiền, thời gian, ... cho giáo viên
      await teacherService.updateStatisticsAfterPayment(
        contract.teacher._id,
        {
          hours: contract.rentalHour,
          price: contract.pricePerHour,
          completedRate: _.round(((paidCount + 1) / (total + 1)) * 100, 2)
        },
        _session
      );

      // chuyển trạng thái của hợp đồng
      const result = await contractRepo.updateContractsStatus(
        [contractId],
        CONTRACT_STATUS.paid,
        new Date(),
        _session
      );

      await _session.commitTransaction();
      _session.endSession();

      return { isUpdated: result.nModified > 0, nModified: result.nModified };
    } catch (err) {
      await _session.abortTransaction();
      _session.endSession();
      throw err;
    }
  },

  rejectContract: async function(contractId) {}
};
