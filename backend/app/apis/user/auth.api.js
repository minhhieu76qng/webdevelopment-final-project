const router = require("express").Router();
const httpCode = require("http-status-codes");
const accountService = require("../../services/account.service");
const authService = require("../../services/auth.service");

// create new user
router.post("/sign-up", (req, res, next) => {
  accountService
    .createNewLocalUser(req.body)
    .then(result => {
      return res.status(httpCode.CREATED).json({
        _id: result._id,
        name: result.name
      });
    })
    .catch(err => {
      next(err);
    });
});

router.post("/login", authService.user_loginWithLocal);

router.post("/oauth/google", authService.loginWithGoogle);

router.post("/oauth/facebook", authService.loginWithFacebook);

module.exports = router;
