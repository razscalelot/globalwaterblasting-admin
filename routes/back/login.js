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
  const token = req.cookies.token;
  if(token){
    res.redirect('/dashboard');
  }else{
    res.render('back/app/login', { title: 'Login || Global Water Blasting', layout: false });
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
          if(user.email === email && user.password === password){
            const token = jwt.sign({'user_id':user.id} , process.env.AUTH_KEY , {expiresIn: '30d'})
            res.cookie('token' , token);
            res.redirect('/dashboard');
          }else{
            res.render('back/app/login', {
              title: 'Login || Global Water Blasting',
              message: 'Invalid email or password.',
              Data: 0,
              Status: 400,
              IsSuccess: false,
            })
          }
        }else{
          console.log('user not found.')
          res.redirect('/');
        }
      }else{
        res.render('back/app/login', {
          title: 'Login || Global Water Blasting',
          message: 'Invalid password, please try again',
          Data: 0,
          Status: 400,
          IsSuccess: false,
        })
      }
    }else{
      res.render('back/app/login', {
        title: 'Login || Global Water Blasting',
        message: 'Invalid email, please try again',
        Data: 0,
        Status: 400,
        IsSuccess: false,
        active: 'service'
      })
    }
  }
})

module.exports = router;
