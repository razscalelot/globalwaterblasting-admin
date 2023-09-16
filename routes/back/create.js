var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const serviceModel = require('../../models/services.model');
let path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads')
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage })

router.get('/', async (req, res) => {
    res.render('back/app/create', { title: 'Create New Service || Global Water Blasting', active: 'service' });
});


router.post('/', upload.fields([{ name: 'image' }, {name: 'banner'}, {name: 'before'}, {name: 'after'}]), async (req, res) => {
    let { servicename, image, banner, shortdesc, longdesc, before, after, title, longdesc1, ptitle, desc } = req.body;
    if (servicename && servicename != '' && shortdesc && shortdesc != '' && longdesc && longdesc != '' && req.files['image'] != null && req.files['banner'] != null && req.files['before'] != null && req.files['after'] != null) {
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
                image: req.files['image'][0].filename,
                banner: req.files['banner'][0].filename,
                shortdesc: shortdesc,
                longdesc: longdesc,
                images: {
                    before: req.files['before'][0].filename,
                    after: req.files['after'][0].filename
                },
                servicedetails: {
                    title: title,
                    longdesc: longdesc1,
                    points: points
                }
            }
            let insertedData = await primary.model(constants.MODELS.services, serviceModel).create(obj)
            if (insertedData && insertedData != null) {
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
                    res.render('back/app/service', { title: 'Service || Global Water Blasting', active: 'service', serviceData: serviceData });
                })
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
            message: 'Invalid service name, descriprions, images and banner can not be empty, please try again',
            Data: 0,
            Status: 400,
            IsSuccess: false,
            active: 'service'
        });
    }
});

module.exports = router;
