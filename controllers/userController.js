var mysql = require('mysql');
var pool = require('../config/dbConnection.js');
var general_controller = require('../controllers/generalController');
var bcrypt = require('bcrypt-nodejs');

exports.user_profile_get = function(req, res){
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{
      // const myURL = new URL(req.originalUrl, 'https://'+req.hostname);

      connection.query('SELECT * FROM INUUser WHERE UserID = ?', req.params.UserID,  function(err, result, fields){
        if(err) throw err;
          var redirectBack = general_controller.getRedirecturl(req);
          general_controller.saveUrl(req, res);
          res.render('../views/user/profile', {
            userData: result[0],
            BackURL : redirectBack
            // urlQuery : myURL.search
          });
        });
    connection.release();
    }
  });
};

exports.user_profile_update = function(req, res){
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{

      var updateData = {
        'NickName' : req.body.Reg_Nickname,
        'UserPhone' : req.body.Reg_UserPhone,
        'UserEmail' : req.body.Reg_UserEmail,
        'OtherContact' : req.body.Reg_OtherContact,
        'Introduce' : req.body.Reg_Introduce
      };
      if(req.body.Reg_Password){
        updateData.Password = bcrypt.hashSync(req.body.Reg_Password, null, null);
      }
      connection.query('UPDATE INUUser SET ? WHERE UserID = ?', [updateData, req.params.UserID],  function(err, result, fields){
        if(err) throw err;
        console.log(result);
        res.redirect('/user/profile/'+req.params.UserID);
      });
    }
    connection.release();
  });
};
