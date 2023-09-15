var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const contactusModel = require('../../models/contactus.model');

/* GET home page. */
router.get('/', async (req, res) => {    
    const { page = 1, limit = 10, search } = req.query;
    let primary = mongoConnection.useDb(constants.DEFAULT_DB);
    await primary.model(constants.MODELS.contactus, contactusModel).paginate({
        $or: [
            { name: { '$regex': new RegExp(search, "i") } },
            { email: { '$regex': new RegExp(search, "i") } },
            { mobile: { '$regex': new RegExp(search, "i") } },
            { address: { '$regex': new RegExp(search, "i") } }
        ]
    }, {
        page,
        limit: parseInt(limit),
        sort: { _id: -1 },
        lean: true
    }).then((contactusData) => {
        res.render('back/app/contactus', { title: 'Contact Us || Global Water Blasting', active: 'contactus', contactusData: contactusData });
    }).catch((error) => {
        res.render('back/app/contactus', { title: 'Contact Us || Global Water Blasting', active: 'contactus', contactusData: contactusData });
    })
});

module.exports = router;
