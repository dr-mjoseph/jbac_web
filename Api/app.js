var express = require('express');
var app = express();

var mysql = require('mysql');
var bodyParser = require('body-parser');
var useragent = require('express-useragent');
var expressValidator = require('express-validator')
util = require('util');
// ssl
const fs = require("fs");
const https = require("https");
// const express = require("express");
// ssl


app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      fld_nm: formParam,
      msg_tx: msg,
      spld_vl: value
    };
  }
}));

path = require('path');
appRoot = __dirname;


app.use(useragent.express());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // support encoded bodies

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token,usr_id,clnt_id,appname');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});
app.use(logErrors);
app.use('/dashboardapi', require('./dashboard/routes/routes'));
// app.use('/websiteapi', require('./website/routes/routes'));
// var sch = require('./utils/schedules');
// sch.scheduleScripts(function (err) {
//   console.log("Scheduled");
// });

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

app.get('/', function (req, res) {
  res.send("Jesus Server");
});

https.createServer({
    key: fs.readFileSync('./privatekey.pem'),
    cert: fs.readFileSync('./cert.crt'),
    passphrase: '123456'
}, app)
    .listen(9762);
console.log('jesus server http://%s:%s 9762');

// var server = app.listen(1430, function () {
//   var host = server.address().address;
//   var port = server.address().port;
//   console.log('1430 Jesus API Server is listening at http://%s:%s', host, port);
// });