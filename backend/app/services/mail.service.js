const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const httpCode = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error.helper");
const { generateToken } = require("../helpers/account.helper");

class Mailer {
  constructor(user, pass) {
    this.account = {
      user,
      pass
    };

    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: this.account.user,
        pass: this.account.pass
      }
    });
  }

  async sendMail(toEmail, mailContent) {
    const mailOption = {
      from: this.account.user,
      to: toEmail,
      subject: mailContent.subject || "",
      text: mailContent.text || "",
      html: mailContent.html || ""
    };
    const info = await this.transporter.sendMail(mailOption);
  }
}

const { MAIL_USER, MAIL_PASSWORD } = process.env;
if (!(MAIL_USER && MAIL_PASSWORD)) {
  console.log("Application not contain MAIL_USER or MAIL_PASSWORD");
  process.exit(-1);
}

const mailer = new Mailer(MAIL_USER, MAIL_PASSWORD);

module.exports = {
  sendVerificationMail: async function({ _id, email }) {
    const { JWTSECRET, VERIFIED_LINK } = process.env;

    const token = generateToken({ _id, email });

    const link = `${VERIFIED_LINK}/active-account?token=${token}`;

    const content = {
      subject: "Uber for Tutor - Verify account.",
      html: `<p>Welcome to our website! Please click the below link to verify account!</p><a href="${link}">${link}</a>`
    };

    try {
      return await mailer.sendMail(email, content);
    } catch (err) {
      throw new ErrorHandler(
        httpCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  }
};
