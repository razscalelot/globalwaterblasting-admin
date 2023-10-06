var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const serviceModel = require('../../models/services.model');
const responseManager = require('../../utilities/response.manager');
const mongoose = require('mongoose');
const fs = require('fs');

router.post('/', async (req, res) => {
    console.log("req.body", req.body);
    const token = req.cookies.token;
    if (token) {
        const { id } = req.body;
        if (id && id != '' && mongoose.Types.ObjectId.isValid(id)) {
            let primary = mongoConnection.useDb(constants.DEFAULT_DB);
            let serviceData = await primary.model(constants.MODELS.services, serviceModel).findById(id).lean();
            console.log("serviceData", serviceData);
            if (serviceData && serviceData != null) {
                try {
                    await primary.model(constants.MODELS.services, serviceModel).findByIdAndRemove(id);
                    return responseManager.onSuccess('Service removed successfully!', 1, res);
                } catch (err) {
                    return responseManager.badrequest({message: err.message}, res);
                }
            } else {
                return responseManager.badrequest({message: 'Invalid service id to remove service, please try again'}, res);
            }
        } else {
            return responseManager.badrequest({message: 'Invalid service id to remove service, please try again'}, res);
        }
    } else {
        res.redirect('/');
    }
});

module.exports = router;