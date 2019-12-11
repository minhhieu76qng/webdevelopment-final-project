const express = require("express");
const morgan = require("morgan");
const httpCode = require("http-status-codes");
const cors = require("cors");
require("./configs/mongoose.config");
require("./configs/passport.user");
require("./configs/passport.admin");

const { handleError } = require("./helpers/error.helper");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res, next) => {
  return res.status(200).json({
    msg: "aaaa"
  });
});

app.use("/api", require("./apis/index.api"));

// not found
app.use((req, res, next) => {
  return res.status(httpCode.NOT_FOUND).json({
    error: {
      msg: "Api not found",
      api: req.originalUrl
    }
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  return handleError(err, res);
});

module.exports = app;
