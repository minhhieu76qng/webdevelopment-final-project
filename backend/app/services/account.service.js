const mongoose = require("mongoose");
const _ = require("lodash");
const httpCode = require("http-status-codes");
const multer = require("multer");
const multerS3 = require("multer-s3");
const Aws = require("aws-sdk");
const accountRepo = require("../repositories/account.repo");
const teacherRepo = require("../repositories/teacher.repo");
const mailService = require("./mail.service");
const cityService = require("./city.service");
const { ErrorHandler } = require("../helpers/error.helper");
const accountHelper = require("../helpers/account.helper");
const { MIN_LENGTH_PASSWORD, ROLES } = require("../constance/constance");

function validateString(field, message) {
  if (!_.isString(field)) {
    throw new ErrorHandler(httpCode.BAD_REQUEST, message);
  }
}

const { USER_KEY, USER_SECRET, BUCKET_NAME } = process.env;
const s3Bucket = new Aws.S3({
  accessKeyId: USER_KEY,
  secretAccessKey: USER_SECRET,
  Bucket: BUCKET_NAME,
  region: "ap-southeast-1"
});

module.exports = {
  createNewLocalUser: async function(data) {
    if (
      !(
        data &&
        data.firstName &&
        data.lastName &&
        data.email &&
        data.password &&
        data.confirmPassword &&
        data.job
      )
    ) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Missing some fields!");
    }

    // validate data type
    validateString(data.firstName, "First name must be a string.");
    validateString(data.lastName, "Last name must be a string.");
    validateString(data.email, "Email must be a string.");
    validateString(data.password, "Password must be a string.");
    validateString(data.confirmPassword, "Confirm password must be a string.");
    validateString(data.job, "Job must be a string.");

    // validate data
    if (!accountHelper.isEmail(data.email)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Email is not valid.");
    }

    if (!(data.password.length >= MIN_LENGTH_PASSWORD)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        `Password must be at least ${MIN_LENGTH_PASSWORD} characters.`
      );
    }

    if (!(data.password === data.confirmPassword)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Password not match.");
    }

    if (!(data.job === ROLES.student || data.job === ROLES.teacher)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Job is not valid.");
    }

    // save user
    const _session = await mongoose.startSession();
    _session.startTransaction();

    try {
      // checking email
      const isExist = await this.findByEmail(data.email);

      if (isExist) {
        throw new ErrorHandler(httpCode.CONFLICT, "Email is already taken.");
      }

      const account = await accountRepo.addUser(data, _session);

      if (data.job === ROLES.teacher) {
        const teacher = await teacherRepo.add(
          { accountId: account._id },
          _session
        );
      }

      // send verification email
      const result = await mailService.sendVerificationMail({
        _id: account._id,
        email: account.local.email
      });

      await _session.commitTransaction();
      _session.endSession();

      return account;
    } catch (err) {
      await _session.abortTransaction();
      _session.endSession();
      throw err;
    }
  },

  createNewAdmin: async function(data) {
    if (
      !(data && data.firstName && data.lastName && data.email && data.password)
    ) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Missing some fields!");
    }

    // validate data type
    validateString(data.firstName, "First name must be a string.");
    validateString(data.lastName, "Last name must be a string.");
    validateString(data.email, "Email must be a string.");
    validateString(data.password, "Password must be a string.");

    // validate data
    if (!accountHelper.isEmail(data.email)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Email is not valid.");
    }

    if (!(data.password.length >= MIN_LENGTH_PASSWORD)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        `Password must be at least ${MIN_LENGTH_PASSWORD} characters.`
      );
    }

    try {
      // checking email
      const isExist = await this.findByEmail(data.email);

      if (isExist) {
        throw new ErrorHandler(httpCode.CONFLICT, "Email is already taken.");
      }

      const account = await accountRepo.addAdmin(data);

      return account;
    } catch (err) {
      throw err;
    }
  },

  createNewSocialAccount: async function(accountData) {
    if (
      !(
        accountData.name &&
        accountData.name.firstName &&
        accountData.name.lastName
      )
    ) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Missing name.");
    }

    if (!(accountData.google || accountData.facebook)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Missing social account information."
      );
    }

    if (
      accountData.google &&
      !(accountData.google.id || accountData.google.email)
    ) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Missing Google id or Google email."
      );
    }

    if (
      accountData.facebook &&
      !(accountData.facebook.id || accountData.facebook.email)
    ) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Missing Facebook id or Facebook email."
      );
    }

    if (
      !(
        accountData.role === ROLES.student || accountData.role === ROLES.teacher
      )
    ) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Job is not valid.");
    }

    // save user
    const _session = await mongoose.startSession();
    _session.startTransaction();

    try {
      const newAccount = await accountRepo.addSocialAccount(
        accountData,
        _session
      );

      if (accountData.role === ROLES.teacher) {
        const teacher = await teacherRepo.add(
          { accountId: newAccount._id },
          _session
        );
      }

      await _session.commitTransaction();
      _session.endSession();

      return newAccount;
    } catch (err) {
      await _session.abortTransaction();
      _session.endSession();
      throw err;
    }
  },

  findByEmail: async function(email) {
    return await accountRepo.findByEmail(email);
  },

  findWithFacebookId: async function(facebookId) {
    return await accountRepo.findWithFacebookId(facebookId);
  },

  getAccounts: async function(offset, limit) {
    const [list, total] = await Promise.all([
      accountRepo.find(offset, limit),
      this.count()
    ]);

    return {
      list,
      total
    };
  },

  count: async function() {
    return await accountRepo.count();
  },

  getInfo: async function(id) {
    let list = await accountRepo.getInfo(id);
    let account = null;
    if (_.isArray(list) && list.length > 0) {
      account = list[0];
    }

    if (account && account.local) {
      delete account.local.password;
    }
    return account;
  },

  findById: async function(id) {
    return accountRepo.findById(id);
  },

  updateAccount: async function(id, account) {
    if (!account)
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Missing payload.");

    if (!account.name || !account.name.firstName || !account.name.lastName) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Missing account name.");
    }

    if (!account.address || !account.address.city || !account.address.street) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Missing address.");
    }

    // kiem tra address co valid hay khong
    const isExist = await cityService.getById(account.address.city);

    if (!isExist) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Your city is not valid.");
    }

    const updatedResult = await accountRepo.updateAccount({
      ...account,
      _id: id
    });

    const updatedAccount = await accountRepo.findById(id);

    if (updatedAccount.local) {
      delete updatedAccount.local.password;
    }

    const token = accountHelper.createToken(updatedAccount);

    return {
      updatedResult,
      token
    };
  },

  findWithGoogleId: async googleId => {
    return await accountRepo.findWithGoogleId(googleId);
  },

  uploadAvatar: async (req, res) => {
    // MULTER
    var upload = multer({
      storage: multerS3({
        s3: s3Bucket,
        bucket: `${BUCKET_NAME}`,
        acl: "public-read",
        metadata: function(req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function(req, file, cb) {
          const name = file.originalname;
          const ext = name.substring(name.lastIndexOf("."), name.length);
          cb(null, `avatars/${Date.now().toString()}${ext}`);
        }
      })
    });

    const multerUploader = upload.single("image");

    multerUploader(req, res, async function(err) {
      if (err) {
        throw new ErrorHandler(
          httpCode.INTERNAL_SERVER_ERROR,
          "Can't upload avatar right now!"
        );
      }

      const location = req.file.location;
      // luu vao db
      try {
        const updatedResult = await accountRepo.updateAvatar(
          req.user._id,
          location
        );

        const updatedAccount = await accountRepo.findById(req.user._id);

        if (updatedAccount.local) {
          delete updatedAccount.local.password;
        }

        // generate token
        const token = accountHelper.createToken(updatedAccount);

        return res.status(httpCode.OK).json({
          isUpdated:
            updatedResult.n === 1 && updatedResult.nModified === 1
              ? true
              : false,
          token
        });
      } catch (err) {
        throw new ErrorHandler(
          httpCode.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        );
      }
    });
  },

  setBlock: async function(id, isBlock) {
    if (!(id && mongoose.Types.ObjectId.isValid(id))) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Account ID is not valid.");
    }

    const account = await accountRepo.findById(id);
    if (!account) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Account is not exist.");
    }

    const result = await accountRepo.setBlock(id, isBlock);
    return {
      isUpdated: result.nModified === 1
    };
  },

  setVerification: async function(id) {
    if (!(id && mongoose.Types.ObjectId.isValid(id))) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Account ID is not valid.");
    }

    // tìm kiếm người dùng
    const account = await accountRepo.findById(id);

    if (!account) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Account is not exist.");
    }

    if (account.isVerified === true) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "The account has been verified."
      );
    }

    const result = await accountRepo.setVerification(id);

    return { isUpdated: result.nModified === 1 };
  },

  changePassword: async function(accountId, newPassword, confirmPw) {
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Account ID is not valid.");
    }

    // kiem tra password moi
    if (!(_.isString(newPassword) && _.isString(confirmPw))) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Password must be a string."
      );
    }

    // match password
    if (!(newPassword === confirmPw)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Password not match.");
    }

    // tim kiem account
    const account = await accountRepo.findById(accountId);

    if (!account) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Account is not exist.");
    }

    // kiem tra account co bi block hay verified chua
    if (account.isBlock === true) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Account has been blocked.");
    }

    if (!(account.isVerified === true)) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "Account has not been verified."
      );
    }

    // thay doi mat khau
    const result = await accountRepo.changePassword(account._id, newPassword);

    return { isUpdated: result.nModified === 1 };
  }
};
