// config/passport.js

// load all the things we need
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;

var bcrypt = require('bcrypt-nodejs');
// load up the user model
var pool = require('./dbConnection.js');

// var connection = mysql.createConnection(dbconfig.connection);

// pool.getConnection(function(err, connection){
//   if(err) throw err;
//   else{
//     connection.query('USE ' + dbconfig.database);
//   }
// });

// expose this function to our app using module.exports

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
      pool.getConnection(function(err, connection){
        if(err) throw err;
        else{
          connection.query("SELECT * FROM INUUser WHERE UserID = ? ",[user.UserID], function(err, rows){
              done(err, rows[0]);
          });
        }
        connection.release();
      });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'Reg_UserID',
            passwordField : 'Reg_Password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, Reg_UserID, Reg_passWord, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            pool.getConnection(function(err, connection){
              if(err) throw err;
              else{
            connection.query("SELECT * FROM INUUser WHERE UserID = ?", [Reg_UserID], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', '이미 존재하는 아이디입니다.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        'UserID': Reg_UserID,
                        'Password': bcrypt.hashSync(Reg_passWord, null, null),  // use the generateHash function in our user model
                        'NickName': req.body.Reg_Nickname,
                        'UserPhone' :req.body.Reg_UserPhone,
                        'UserEmail' : req.body.Reg_UserEmail,
                        'OtherContact': req.body.Reg_OtherContact,
                        'Introduce' : req.body.Reg_Introduce
                    };
                    console.log(newUserMysql);
                    var insertQuery = "INSERT INTO INUUser SET ?";

                    connection.query(insertQuery,newUserMysql,function(err, rows) {
                      if(err){
                        return done(null, false, req.flash('signupMessage', '로그인 실패'));
                        throw err;
                      }
                      console.log(rows);
                        return done(null, newUserMysql);
                    });
                }
            });
          }
          connection.release();
        });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'Log_UserID',
            passwordField : 'Log_Password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, Log_UserID, Log_Password, done) { // callback with email and password from our form
          pool.getConnection(function(err, connection){
            if(err) throw err;
            else{
              connection.query("SELECT * FROM INUUser WHERE UserID = ?",[Log_UserID], function(err, rows){
                  if (err)
                      return done(err);
                  if (!rows.length) {
                      return done(null, false, req.flash('loginMessage', '유저를 찾을 수 없습니다.')); // req.flash is the way to set flashdata using connect-flash
                  }

                  // if the user is found but the password is wrong
                  if (!bcrypt.compareSync(Log_Password, rows[0].Password))
                      return done(null, false, req.flash('loginMessage', '비밀번호가 올바르지 않습니다')); // create the loginMessage and save it to session as flashdata

                  // all is well, return successful user
                  return done(null, rows[0]);
              });
            }
            connection.release();
          });
        })
    );

    module.exports = passport;
