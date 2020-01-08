module.exports = {
  MIN_LENGTH_PASSWORD: 6,
  ROLES: {
    student: "STUDENT",
    teacher: "TEACHER",
    root: "ROOT",
    admin: "ADMIN"
  },
  SALT_ROUND: 10,
  CONTRACT_STATUS: {
    pending: "PENDING",
    teaching: "TEACHING",
    paid: "PAID",
    complain: "COMPLAIN",
    reject: "REJECTED"
  },
  MAX_LENGTH_CONTRACT_NAME: 35,
  MIN_PRICE: 5,
  MAX_PRICE: 1000
};
