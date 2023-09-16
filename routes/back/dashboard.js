var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const contactusModel = require('../../models/contactus.model');
const offerModel = require('../../models/offers.model');
const quoteModel = require('../../models/quotes.model');
const userModel = require('../../models/users.model');
/* GET home page. */

router.get('/', async (req, res) => {
    const token = req.cookies.token;
    if(token){
        const {user_id} = jwt.verify(token , process.env.AUTH_KEY);
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let user = await primary.model(constants.MODELS.users , userModel).findOne({"id": user_id}).lean();
        if(user){
            let primary = mongoConnection.useDb(constants.DEFAULT_DB);
            let contactusCount = await primary.model(constants.MODELS.contactus, contactusModel).countDocuments({ _id: { $ne: null } })
            let offerCount = await primary.model(constants.MODELS.offers, offerModel).countDocuments({ _id: { $ne: null } })
            let quoteCount = await primary.model(constants.MODELS.quotes, quoteModel).countDocuments({ _id: { $ne: null } })
            res.render('back/index', {
                title: 'Dashboard || Global Water Blasting',
                active: 'dashboard',
                contactusCount: contactusCount,
                offerCount: offerCount,
                quoteCount: quoteCount
            });
        }else{
            res.redirect('/');
        }
    }
    else{
        res.redirect('/');
    }
});

module.exports = router;
