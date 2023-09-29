var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const serviceModel = require('../../models/services.model');
const responseManager = require('../../utilities/response.manager');

/* GET home page. */
router.get('/', async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        res.render('back/app/service', { title: 'Service || Global Water Blasting', active: 'service', AWS_BUCKET_URI: process.env.AWS_BUCKET_URI });
    } else {
        res.redirect('/');
    }
});

router.post('/list', async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        console.log("req.query", req.query);
        console.log("req.body", req.body);
        const { page = 1, limit = 10, search } = req.body;
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
            return responseManager.onSuccess('Service List', serviceData, res);
        }).catch((error) => {
            return responseManager.badrequest({message: 'Service not found'}, res);
        })
    } else {
        res.redirect('/');
    }
});

module.exports = router;
