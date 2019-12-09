const express = require("express");
const morgan = require("morgan");
const httpCode = require("http-status-codes");
const cors = require("cors");
require("./configs/mongoose.config");
require("./configs/passport.config");
const { handleError } = require("./helpers/error.helper");
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/admin", require("./apis/admin"));

// not found
app.use((req, res, next) => {
  return res.status(httpCode.NOT_FOUND).json({
    errors: [
      {
        msg: "Api not found",
        api: req.originalUrl
      }
    ]
  });
});

app.use((err, req, res, next) => {
  // console.log(err);
  return handleError(err, res);
});

module.exports = app;
