var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const offerModel = require('../../models/offers.model');

/* GET home page. */
router.get('/', async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        const { page = 1, limit = 10, search } = req.query;
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        await primary.model(constants.MODELS.offers, offerModel).paginate({
            $or: [
                { name: { '$regex': new RegExp(search, "i") } },
                { email: { '$regex': new RegExp(search, "i") } },
                { mobile: { '$regex': new RegExp(search, "i") } },
                { address: { '$regex': new RegExp(search, "i") } },
                { message: { '$regex': new RegExp(search, "i") } },
            ]
        }, {
            page,
            limit: parseInt(limit),
            sort: { _id: -1 },
            lean: true
        }).then((offerData) => {
            res.render('back/app/offer', { title: 'Offer || Global Water Blasting', active: 'offer', offerData: offerData, message: req.flash('message') });
        }).catch((error) => {
            res.render('back/app/offer', { title: 'Offer || Global Water Blasting', active: 'offer', offerData: offerData, message: req.flash('message') });
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;
