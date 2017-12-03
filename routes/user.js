var express = require('express');
var router = express.Router();
var general_controller = require('../controllers/generalController');
var user_controller = require('../controllers/userController');

/* GET users listing. */
router.get('/profile/:UserID', function(req, res, next) {
  user_controller.user_profile_get(req, res);
});

router.put('/profile/:UserID', function(req, res){
	user_controller.user_profile_update(req, res);
});

module.exports = router;
