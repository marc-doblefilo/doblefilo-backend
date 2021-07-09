const express = require("express");
const dotenv = require("dotenv");
const app = express();
const mariadb = require("mariadb/callback");

dotenv.config();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.get('/projects', function(req, res) {
  const conn = mariadb.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  conn.query('SELECT * FROM projects', function(err, rows) {
    if (err) throw err;
    res.json(rows);
    conn.end();
  });
});

app.listen(process.env.SERVER_PORT, function () {
  console.log('Listening to: ' + process.env.SERVER_PORT);
});
