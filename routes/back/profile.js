var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const userModel = require('../../models/users.model');
const helper = require('../../utilities/helper');


router.get('/' , async (req , res) => {
  const token = req.cookies.token;
  if(token){
    try {
      const {user_id} = jwt.verify(token , process.env.AUTH_KEY);
      let primary = mongoConnection.useDb(constants.DEFAULT_DB);
      let user = await primary.model(constants.MODELS.users , userModel).findById(user_id).select('-password -tc -createdBy -updatedBy -createAt -updatedAt').lean();
      if(user){
        console.log("user :",user);
        res.render('back/profile', {
          title: 'Profile || Global Water Blasting',
          active: 'dashboard',
          admin: user
        });
      }else{
        res.clearCookie('token');
        res.redirect('/');
      }
    } catch (error) {
      console.log("error :",error);
      res.clearCookie('token');
      res.redirect('/');
    }
  }else{
    console.log("Logout...!");
    res.redirect('/');
  }
});

router.post('/' , async (req , res) => {
  const token = req.cookies.token;
  if(token){
    try {
      const {user_id} = jwt.verify(token , process.env.AUTH_KEY);
      let primary = mongoConnection.useDb(constants.DEFAULT_DB);
      let user = await primary.model(constants.MODELS.users , userModel).findById(user_id).select('-password -tc -createdBy -updatedBy').lean();
      if(user){
        const {name , phone, email } = req.body;
        if(name && name != '' && email && email != ''){
          const obj = {
            name: name,
            mobile: phone,
            email: email,
            updatedAt: Date.now(),
          }
          await primary.model(constants.MODELS.users , userModel).findByIdAndUpdate(user_id , obj);
          res.redirect('/profile')
        }else
        res.render('back/profile', {
          title: 'Profile || Global Water Blasting',
          active: 'dashboard',
          admin: user
        });
      }else{
        res.clearCookie('token');
        res.redirect('/');
      }
    } catch (error) {
      res.clearCookie('token');
      res.redirect('/');
    }
  }else{
    res.clearCookie('token');
    res.redirect('/');
  }
});

router.post('/changepassword' , async (req , res) => {
  const token = req.cookies.token;
  if(token){
    try {
      const {current_password , new_password , conform_new_password} = req.body;
      if(current_password && current_password != '' && new_password && new_password != '' && conform_new_password && conform_new_password != ''){
        const {user_id} = jwt.verify(token , process.env.AUTH_KEY);
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let user = await primary.model(constants.MODELS.users , userModel).findById(user_id).lean();
        if(user){
          const decryptPassword = await helper.passwordDecryptor(user.password);
          if(current_password === decryptPassword){
            if(new_password === conform_new_password){
              const encryptPassword = await helper.passwordEncryptor(new_password);
              if(encryptPassword){
                const obj = {
                  password: encryptPassword,
                  updatedAt: Date.now(),
                };
                const updateUser = await primary.model(constants.MODELS.users , userModel).findByIdAndUpdate(user._id , { $set: obj});
                res.clearCookie('token');
                res.redirect('/');
              }else{
                res.redirect('/profile');
              }
            }else{
              res.redirect('/profile');
            }
          }else{
            res.redirect('/profile');
          }
        }else{
          res.clearCookie('token');
          res.redirect('/');
        }
      }else{
        res.redirect('/profile');
      }
    } catch (error) {
      res.clearCookie('token');
      res.redirect('/');
    }
  }else{
    res.clearCookie('token');
    res.redirect('/');
  }
})

module.exports = router;