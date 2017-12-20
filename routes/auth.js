var express = require('express');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
var passport = require('../config/passport.js');

router.get('/login', function(req, res){
  console.log(req.session.redirectTo);
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res){
  // render the page and pass in any flash data if it exists
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

router.get('/logout', function(req, res) {
     req.logout();
     res.redirect('back');
 });

router.post('/login', passport.authenticate('local-login', {
            // successRedirect : '/trade/all', // redirect to the secure profile section
             failureRedirect : '/auth/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
            console.log(req.session.redirectTo);
            var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
            delete req.session.redirectTo;
            res.redirect(redirectTo);
});

router.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
});


router.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/welcome', // redirect to the secure profile section
		failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
}));


 // route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}


module.exports = router;
