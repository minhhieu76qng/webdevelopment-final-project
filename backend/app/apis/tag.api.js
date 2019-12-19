const router = require("express").Router();
const httpCode = require("http-status-codes");
const _ = require("lodash");
const tagService = require("../services/tag.service");
const { authorize, authenticateAdmin } = require("../middlewares/auth.mdw");
const { ROLES } = require("../constance/constance");

router.post(
  "/",
  authenticateAdmin(),
  authorize([ROLES.root, ROLES.admin]),
  async (req, res, next) => {
    try {
      const result = await tagService.addNewTag(req.body.newTag);

      return res.status(httpCode.CREATED).json({
        newTag: result
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.get("/", async (req, res, next) => {
  let page = _.toInteger(req.query.page) || 1;
  let limit = _.toInteger(req.query.limit) || 10;

  if (page <= 0) {
    page = 1;
  }

  if (limit <= 0) {
    limit = 10;
  }

  try {
    const { list, total } = await tagService.getTagTable(page - 1, limit);

    return res.status(httpCode.OK).json({
      tags: list,
      total
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/list", async (req, res, next) => {
  try {
    const tags = await tagService.getActives();
    return res.status(httpCode.OK).json({ tags });
  } catch (err) {
    return next(err);
  }
});

router.put(
  "/",
  authenticateAdmin(),
  authorize([ROLES.admin, ROLES.root]),
  async (req, res, next) => {
    try {
      const result = await tagService.deleteTags(req.body.tags);
      return res.status(httpCode.ACCEPTED).json({ result });
    } catch (err) {
      return next(err);
    }
  }
);

router.put(
  "/:id",
  authenticateAdmin(),
  authorize([ROLES.admin, ROLES.root]),
  async (req, res, next) => {
    const tagObj = {
      _id: req.params.id,
      tagName: req.body.tagName,
      isDeleted: req.body.isDeleted
    };
    try {
      const result = await tagService.editTag(tagObj);

      return res.status(httpCode.ACCEPTED).json({
        tag: result
      });
    } catch (err) {
      return next(err);
    }
  }
);
module.exports = router;
