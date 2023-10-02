var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const contactusModel = require('../../models/contactus.model');
const offerModel = require('../../models/offers.model');
const quoteModel = require('../../models/quotes.model');
const serviceModel = require('../../models/services.model');
/* GET home page. */
router.get('/', async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let contactusCount = await primary.model(constants.MODELS.contactus, contactusModel).countDocuments({ _id: { $ne: null } })
        let serviceCount = await primary.model(constants.MODELS.services, serviceModel).countDocuments({ _id: { $ne: null } })
        let offerCount = await primary.model(constants.MODELS.offers, offerModel).countDocuments({ _id: { $ne: null } })
        let quoteCount = await primary.model(constants.MODELS.quotes, quoteModel).countDocuments({ _id: { $ne: null } })
        res.render('back/index', {
            title: 'Dashboard || Global Water Blasting',
            active: 'dashboard',
            contactusCount: contactusCount,
            offerCount: offerCount,
            quoteCount: quoteCount,
            serviceCount: serviceCount,
            message: req.flash('message')
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;
