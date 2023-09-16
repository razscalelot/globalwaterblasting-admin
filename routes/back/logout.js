var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const userModel = require('../../models/users.model');


router.get('/' , async (req , res) => {
  const token = req.cookies.token;
  if(token){
    const {user_id} = jwt.verify(token , process.env.AUTH_KEY);
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let user = await primary.model(constants.MODELS.users , userModel).findOne({"id": user_id}).lean();
        if(user){
          res.clearCookie('token');
          res.redirect('/');
        }else{
          res.redirect('/');
        }
  }else{
    res.redirect('/');
  }
})

module.exports = router;