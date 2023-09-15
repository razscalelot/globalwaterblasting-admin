var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const serviceModel = require('../../models/services.model');

/* GET home page. */
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    let primary = mongoConnection.useDb(constants.DEFAULT_DB);
    await primary.model(constants.MODELS.services, serviceModel).paginate({
        $or: [
            { name: { '$regex': new RegExp(search, "i") } },
            { email: { '$regex': new RegExp(search, "i") } },
            { mobile: { '$regex': new RegExp(search, "i") } },
            { address: { '$regex': new RegExp(search, "i") } },
            { selected_service: { '$regex': new RegExp(search, "i") } },
            { address: { '$regex': new RegExp(search, "i") } },
        ]
    }, {
        page,
        limit: parseInt(limit),
        sort: { _id: -1 },
        lean: true
    }).then((serviceData) => {
        res.render('back/app/service', { title: 'Service || Global Water Blasting', active: 'service', serviceData: serviceData });
    }).catch((error) => {
        res.render('back/app/service', { title: 'Service || Global Water Blasting', active: 'service', serviceData: serviceData });
    })
});

module.exports = router;
