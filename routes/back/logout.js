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
      if(user_id){
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let user = await primary.model(constants.MODELS.users , userModel).findById(user_id).lean();
        if(user){
          res.clearCookie('token');
          return res.redirect('/');
        }else{
          res.clearCookie('token');
          return res.redirect('/');
        }
      }else{
        res.clearCookie('token');
        return res.redirect('/');
      }
    } catch (error) {
      res.clearCookie('token');
      return res.redirect('/');
    }
  }else{
    return res.redirect('/');
  }
});

module.exports = router;