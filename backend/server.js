const http = require("http");
require("dotenv").config();
const app = require("./app/app");

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, function() {
  console.log(`Server is running at ${PORT}`);
});
