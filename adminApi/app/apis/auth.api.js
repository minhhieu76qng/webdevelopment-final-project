const router = require("express").Router();
const authService = require("../services/auth.service");

router.post("/login", authService.loginWithLocal);

module.exports = router;
