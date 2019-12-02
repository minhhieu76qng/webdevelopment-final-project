const router = require("express").Router();
const httpCode = require("http-status-codes");
const userService = require("../services/account.service");

// // create new user
// router.post('/', async (req, res, next) => {
//   const { firstName, lastName, email, password, confirmPassword, job } = req.body;

//   const result = await userService.createNewUser({ firstName, lastName, email, password, confirmPassword, job });

//   return res.status(httpCode.CREATED).json(result);
// })

module.exports = router;
