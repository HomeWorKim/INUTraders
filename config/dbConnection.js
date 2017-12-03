var mysql = require('mysql');
var dbconfig   = require('./.dbConfig.js');

var pool = mysql.createPool(process.env.JAWSDB_URL);
module.exports = pool;

// var connection = mysql.createConnection(dbconfig);
// module.exports = connection;
