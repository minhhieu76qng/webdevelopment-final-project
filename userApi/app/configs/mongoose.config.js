const mongoose = require("mongoose");
const CONNECTION_STRING =
  process.env.CONNECTION_STRING || "mongodb://localhost:27017/uberfortutor";

mongoose
  .connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(function() {
    console.log("Mongoose connected!");
  })
  .catch(error => {
    console.log(error);
    process.exit(-1);
  });
