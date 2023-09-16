var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const serviceModel = require('../../models/services.model');
const mongoose = require('mongoose');
const fs = require('fs');

router.get('/', async (req, res) => {
    console.log("req.query", req.query);
    const { id } = req.query;
    if (id && id != '' && mongoose.Types.ObjectId.isValid(id)) {
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let serviceData = await primary.model(constants.MODELS.services, serviceModel).findById(id).lean();
        if (serviceData && serviceData != null) {
            let serviceData = await primary.model(constants.MODELS.services, serviceModel).findById(id).lean();
            try{
                fs.unlinkSync("public/uploads/"+serviceData.image);
                fs.unlinkSync("public/uploads/"+serviceData.banner);
                fs.unlinkSync("public/uploads/"+serviceData.images.before);
                fs.unlinkSync("public/uploads/"+serviceData.images.after);
                await primary.model(constants.MODELS.services, serviceModel).findByIdAndRemove(id).lean();
            }catch{
                res.render('back/app/edit', { title: 'Service || Global Water Blasting', active: 'service', serviceData: serviceData });
            }
            if (serviceData) {
                const { page = 1, limit = 10, search } = req.query;
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
                    res.render('back/app/service', { title: 'Service || Global Water Blasting', IsSuccess: true, message: 'Service created successfully!', active: 'service', serviceData: serviceData });
                }).catch((error) => {
                    res.render('back/app/service', { title: 'Service || Global Water Blasting', IsSuccess: false, message: 'Something want wrong!', active: 'service', serviceData: serviceData });
                })
            } else {
                res.render('back/app/edit', { title: 'Update Service || Global Water Blasting', active: 'service', serviceData: serviceData });
            }
        } else {
            res.render('back/app/service', { title: 'Service || Global Water Blasting', active: 'service' });
        }
    }
});

module.exports = router;