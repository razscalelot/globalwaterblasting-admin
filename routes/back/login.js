var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const userModel = require('../../models/users.model');

function validateEmail(email) {
  // Regular expression for a valid email pattern
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // Use the test method of the regular expression to check if the email is valid
  return emailPattern.test(email);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('back/app/login', { title: 'About Us || Global Water Blasting', layout: false });
});

module.exports = router;