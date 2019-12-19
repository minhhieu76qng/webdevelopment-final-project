const router = require("express").Router();
const httpCode = require("http-status-codes");
const categoryService = require("../services/category.service");

router.get("/", async (req, res, next) => {
  try {
    const list = await categoryService.getAvtives();

    return res.status(httpCode.OK).json({
      categories: list
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
