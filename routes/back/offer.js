var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const offerModel = require('../../models/offers.model');
const responseManager = require('../../utilities/response.manager');

/* GET home page. */
router.get('/', async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        res.render('back/app/offer', { title: 'Offer || Global Water Blasting', active: 'offer', });
    } else {
        res.redirect('/');
    }
});

router.post('/list', async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        const { page = 1, limit = 10, search } = req.body;
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        await primary.model(constants.MODELS.offers, offerModel).paginate({
            $or: [
                { name: { '$regex': new RegExp(search, "i") } },
                { email: { '$regex': new RegExp(search, "i") } },
                { mobile: { '$regex': new RegExp(search, "i") } },
                { address : { '$regex': new RegExp(search, "i") } },
                { postcode : { '$regex': new RegExp(search, "i") } },
                { message : { '$regex': new RegExp(search, "i") } },
            ]
        }, {
            page,
            limit: parseInt(limit),
            sort: { _id: -1 },
            lean: true
        }).then((offerData) => {
            return responseManager.onSuccess('Offer List', offerData, res);
        }).catch((error) => {
            return responseManager.badrequest({message: 'Offer not found'}, res);
        })
    } else {
        res.redirect('/');
    }
});

module.exports = router;
