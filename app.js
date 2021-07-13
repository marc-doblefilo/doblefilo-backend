const express = require("express");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use('/api', require('./api-routes/repos'));

app.listen(process.env.SERVER_PORT, function () {
  console.log('Listening to: ' + process.env.SERVER_PORT);
});

module.exports = app;