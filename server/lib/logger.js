'use strict';

var path = require('path');
var winston = require('winston');
var ENV = process.env.NODE_ENV || 'development';

var logFile = path.resolve(__dirname + '../../../log', ENV);
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({filename: logFile})
  ]
});

module.exports = logger;
