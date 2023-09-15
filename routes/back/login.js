var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('back/app/login', { title: 'About Us || Global Water Blasting', layout: false });
});

module.exports = router;
