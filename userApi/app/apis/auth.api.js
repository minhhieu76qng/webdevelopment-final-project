const router = require("express").Router();
const httpCode = require("http-status-codes");
const userService = require("../services/account.service");

// create new user
router.post("/sign-up", (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    job
  } = req.body;

  userService.createNewUser({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    job
  })
    .then(result => {
      return res.status(httpCode.CREATED).json(result);
    })
    .catch(err => {
      console.log(err);
      next(err);
    })
});

module.exports = router;
