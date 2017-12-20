var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;

var bcrypt = require('bcrypt-nodejs');
var pool = require('./dbConnection.js');


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

    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField : 'Reg_UserID',
            passwordField : 'Reg_Password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, Reg_UserID, Reg_passWord, done) {
            pool.getConnection(function(err, connection){
              if(err) throw err;
              else{
            connection.query("SELECT * FROM INUUser WHERE UserID = ?", [Reg_UserID], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', '이미 존재하는 아이디입니다.'));
                } else {
                    var newUserMysql = {
                        'UserID': Reg_UserID,
                        'Password': bcrypt.hashSync(Reg_passWord, null, null),
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
                        //throw err;
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

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField : 'Log_UserID',
            passwordField : 'Log_Password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, Log_UserID, Log_Password, done) {
          pool.getConnection(function(err, connection){
            if(err) throw err;
            else{
              connection.query("SELECT * FROM INUUser WHERE UserID = ?",[Log_UserID], function(err, rows){
                  if (err)
                      return done(err);
                  if (!rows.length) {
                      return done(null, false, req.flash('loginMessage', '유저를 찾을 수 없습니다.'));
                  }
                  if (!bcrypt.compareSync(Log_Password, rows[0].Password))
                      return done(null, false, req.flash('loginMessage', '비밀번호가 올바르지 않습니다'));
                  return done(null, rows[0]);
              });
            }
            connection.release();
          });
        })
    );

    module.exports = passport;
