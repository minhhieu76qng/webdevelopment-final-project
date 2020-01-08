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

router.put("/confirm-email", async (req, res, next) => {
  const { token } = req.query;

  try {
    const { isUpdated } = await authService.verifyEmail(token);

    return res.status(httpCode.OK).json({
      isUpdated
    });
  } catch (err) {
    return next(err);
  }
});

// send email
router.put("/send-forgot-pw", async (req, res, next) => {
  const { email } = req.body;

  try {
    const { isSent } = await authService.sendForgotPasswordMail(email);

    return res.status(httpCode.OK).json({
      isSent
    });
  } catch (err) {
    return next(err);
  }
});

// xu li thay doi mat khau
router.put("/forgot-password", async (req, res, next) => {
  const { token, newPassword, confirmPw } = req.body;
  try {
    const { isUpdated } = await authService.forgotPassword(
      token,
      newPassword,
      confirmPw
    );

    return res.status(httpCode.OK).json({ isUpdated });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
