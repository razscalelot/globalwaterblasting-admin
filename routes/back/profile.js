var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const userModel = require('../../models/users.model');


router.get('/' , async (req , res) => {
  const token = req.cookies.token;
  if(token){
    try {
      const {user_id} = jwt.verify(token , process.env.AUTH_KEY);
      let primary = mongoConnection.useDb(constants.DEFAULT_DB);
      let user = await primary.model(constants.MODELS.users , userModel).findById(user_id).select('-password -tc -createdBy -updatedBy').lean();
      if(user){
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
        const {fname , lname , email } = req.body;
        if(fname && fname != '' && lname && lname != '' && email && email != ''){
          const obj = {
            fname: fname,
            lname: lname,
            email: email,
            createAt: "",
            updatedAt: Date.now(),
          }
          let user = await primary.model(constants.MODELS.users , userModel).findByIdAndUpdate(user_id , { $set: obj});
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
        if(current_password === user.password){
          if(new_password === conform_new_password){
            const saltRounds = 10;
            const hashpassword = await bcrypt.hash(new_password , saltRounds);
            const obj = {
              password: hashpassword,
              updatedAt: Date.now(),
            }
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