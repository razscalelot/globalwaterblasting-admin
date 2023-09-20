var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const serviceModel = require('../../models/services.model');
const mongoose = require('mongoose');
const fs = require('fs');

router.get('/', async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        const { id } = req.query;
        if (id && id != '' && mongoose.Types.ObjectId.isValid(id)) {
            let primary = mongoConnection.useDb(constants.DEFAULT_DB);
            let serviceData = await primary.model(constants.MODELS.services, serviceModel).findById(id).lean();
            console.log("serviceData", serviceData);
            if (serviceData && serviceData != null) {
                console.log("images", serviceData.image, serviceData.banner, serviceData.images.before, serviceData.images.after);
                try {
                    if (serviceData.image != '') {
                        fs.unlinkSync("public/uploads/" + serviceData.image);
                    }
                    if (serviceData.banner != '') {
                        fs.unlinkSync("public/uploads/" + serviceData.banner);
                    }
                    if (serviceData.images.before != '') {
                        fs.unlinkSync("public/uploads/" + serviceData.images.before);
                    }
                    if (serviceData.images.after != '') {
                        fs.unlinkSync("public/uploads/" + serviceData.images.after);
                    }
                    await primary.model(constants.MODELS.services, serviceModel).findByIdAndRemove(id);
                    req.flash('message', 'Service removed successfully!')
                    res.redirect('/service');
                } catch (err) {
                    req.flash('message', err.message);
                    res.redirect('/service');
                }
            } else {
                req.flash('message', 'Invalid service id to remove service, please try again')
                res.redirect('/service');
            }
        } else {
            req.flash('message', 'Invalid service id to remove service, please try again')
            res.redirect('/service');
        }
    } else {
        res.redirect('/');
    }
});

module.exports = router;