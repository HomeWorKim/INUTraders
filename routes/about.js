var express = require('express');
var router = express.Router();
var general_controller = require('../controllers/generalController');

/* GET home page. */
router.get('/', function(req, res, next) {
  general_controller.saveUrl(req, res);
  res.render('about', {
    activeNav : 'About'
  });
});

module.exports = router;
