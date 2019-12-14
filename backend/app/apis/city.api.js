const router = require("express").Router();
const httpCode = require("http-status-codes");
const cityService = require("../services/city.service");

router.get("/", async (req, res, next) => {
  try {
    const result = await cityService.getAll();
    return res.status(httpCode.OK).json({
      cities: result
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
