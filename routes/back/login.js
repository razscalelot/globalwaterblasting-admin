var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const userModel = require('../../models/users.model');

const helper = require('../../utilities/helper');

function validateEmail(email) {
  // Regular expression for a valid email pattern
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // Use the test method of the regular expression to check if the email is valid
  return emailPattern.test(email);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  const token = req.cookies.token;
  if(token){
    return res.redirect('/dashboard');
  }else{
    return res.render('back/app/login', { title: 'Login || Global Water Blasting', layout: false, message: req.flash('message') });
  }
});

router.post('/' , async (req , res) => {
  const token = req.cookies.token;
  if(token){
    res.redirect('/dashboard');
  }else{
    let {email , password} = req.body;
    if(email && email != '' && validateEmail(email)){
      if(password && password != ''){
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let user = await primary.model(constants.MODELS.users , userModel).findOne({"email": email}).lean();
        if(user){
          const decryptPassword = await helper.passwordDecryptor(user.password);
          if(user.email === email && decryptPassword === password){
            const token = jwt.sign({'user_id':user._id} , process.env.AUTH_KEY , {expiresIn: '30d'})
            console.log("token", token);
            res.cookie('token' , token);
            console.log(res.cookie('token' , token));
            return res.redirect('/dashboard');
          }else{
            req.flash('message', 'Invalid mobile or password please try again');
            return res.redirect('/');
          }
        }else{
          req.flash('message', 'Invalid mobile or password please try again');
          return res.redirect('/');
        }
      }else{
        req.flash('message', 'Invalid password, please try again');
        return res.redirect('/');
      }
    }else{
      req.flash('message', 'Invalid email, please try again');
      return res.redirect('/');
    }
  }
})

module.exports = router;