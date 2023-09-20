var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const serviceModel = require('../../models/services.model');

/* GET home page. */
router.get('/', async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        const { page = 1, limit = 10, search } = req.query;
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        await primary.model(constants.MODELS.services, serviceModel).paginate({
            $or: [
                { servicename: { '$regex': new RegExp(search, "i") } }
            ]
        }, {
            page,
            limit: parseInt(limit),
            sort: { _id: -1 },
            lean: true
        }).then((serviceData) => {
            res.render('back/app/service', { title: 'Service || Global Water Blasting', active: 'service', serviceData: serviceData, message: req.flash('message') });
        }).catch((error) => {
            res.render('back/app/service', { title: 'Service || Global Water Blasting', active: 'service', serviceData: serviceData, message: req.flash('message') });
        })
    } else {
        res.redirect('/');
    }
});

module.exports = router;
