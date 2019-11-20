const express = require('express');

const app = express();

const PORT = 4000;

app.get('/', (req, res, next) => {

})

app.listen(PORT, function () {
  console.log(`Server is running at port ${PORT}`);
})