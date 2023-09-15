var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const serviceModel = require('../../models/services.model');

router.get('/', async (req, res) => {
    res.render('back/app/create', { title: 'Create New Service || Global Water Blasting', active: 'service' });
});

router.post('/', async (req, res) => {
    let { servicename, image, banner, shortdesc, longdesc, before, after, title, longdesc1, ptitle, desc } = req.body;
    if (servicename && servicename != '') {
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let serviceData = await primary.model(constants.MODELS.services, serviceModel).findOne({ "servicename": servicename }).lean();
        if (serviceData == null) {
            let points = [];
            for (var i = 0; i < ptitle.length; i++) {
                let obj = {
                    title: ptitle[i],
                    decs: desc[i]
                };
                points.push(obj);
            }
            let obj = {
                servicename: servicename,
                image: image,
                banner: banner,
                shortdesc: shortdesc,
                longdesc: longdesc,
                images: {
                    before: before,
                    after: after
                },
                servicedetails: {
                    title: title,
                    longdesc: longdesc1,
                    points: points
                }
            }
            console.log("obj", obj);
            let insertedData = await primary.model(constants.MODELS.services, serviceModel).create(obj)
            if (insertedData && insertedData != null) {
                res.render('back/app/service', {
                    title: 'Service || Global Water Blasting',
                    message: 'Service created successfully!',
                    Data: 0,
                    Status: 200,
                    IsSuccess: true,
                    active: 'service'
                });
            } else {
                res.render('back/app/create', {
                    title: 'Service || Global Water Blasting',
                    message: 'Something went wrong, Please try again',
                    Data: 0,
                    Status: 400,
                    IsSuccess: false,
                    active: 'service'
                });
            }
        } else {
            res.render('back/app/create', {
                title: 'Service || Global Water Blasting',
                message: ' The request message was already sent. We will contact you very soon!',
                Data: 0,
                Status: 400,
                IsSuccess: false,
                active: 'service'
            });
        }
    } else {
        res.render('back/app/create', {
            title: 'Service || Global Water Blasting',
            message: 'Invalid name, email, mobile, address, postcode and message can not be empty, please try again',
            Data: 0,
            Status: 400,
            IsSuccess: false,
            active: 'service'
        });
    }
});

module.exports = router;
