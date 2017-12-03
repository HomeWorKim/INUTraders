var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var bcrypt = require('bcrypt');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');

var mysql = require('mysql');
var dbSQL = require('./config/dbTables.js');
var pool = require('./config/dbConnection.js');

var main = require('./routes/main');
var about = require('./routes/about');
var trade = require('./routes/trade');
var auth = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// required for passport
app.use(session({
	secret: 'inutraders',
	resave: true,
	saveUninitialized: true
 } )); // session secret
console.log("test");

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next){
	res.locals.isAuthenticated = req.isAuthenticated();
	res.locals.currentUser= req.user;
	next();
});

//Page Routing
app.use('/', main);
app.use('/about', about);
app.use('/trade', trade);
app.use('/auth', auth);

// pool.getConnection(function(err, connection){
//   if(err) throw err;
//   else{
//       console.log('connected as id ' + connection.threadId);
//
//       connection.query(dbSQL.createTrade, function(err, result, fields){
//         if(err) throw err;
//         console.log(result);
//       });
//     connection.release();
//   }
// });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
