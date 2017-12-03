var express = require('express');
var router = express.Router();
// var util=require('../config/util.js');
var mysql = require('mysql');
var pool = require('../config/dbConnection.js');

// var Trade_Option = {
// 	title:'Trade',
// 	path:'Trade'
// };

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('main', {
			activeNav : 'Home',
			path: '/'
		});
});

router.get('/welcome', function(req, res, next) {
    res.render('welcome', {
			activeNav : 'Home',
			path: '/'
		});
});

module.exports = router;
