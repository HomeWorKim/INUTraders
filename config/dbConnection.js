var mysql = require('mysql');
var dbconfig   = require('./.dbConfig.js');

var pool = mysql.createPool(process.env.JAWSDB_URL);
//var pool = mysql.createPool(dbconfig);
module.exports = pool;
