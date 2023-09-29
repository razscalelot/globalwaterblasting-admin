var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const serviceModel = require('../../models/services.model');
let path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');

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
    const token = req.cookies.token;
    if (token) {
        const { id } = req.query;
        if (id && id != '' && mongoose.Types.ObjectId.isValid(id)) {
            let primary = mongoConnection.useDb(constants.DEFAULT_DB);
            let serviceData = await primary.model(constants.MODELS.services, serviceModel).findById(id).lean();
            if (serviceData && serviceData != null) {
                res.render('back/app/edit', { title: 'Update Service || Global Water Blasting', active: 'service', serviceData: serviceData, message: req.flash('message') });
            } else {
                res.render('back/app/service', { title: 'Service || Global Water Blasting', active: 'service', message: req.flash('message') });
            }
        } else {
            req.flash('message', 'Invalid service id to update service, please try again');
            res.redirect('/edit');
        }
    } else {
        res.redirect('/');
    }
});

router.post('/edit', async (req, res) => {
    console.log("Edit req.body", req.body);
    const token = req.cookies.token;
    if (token) {
        const { id } = req.body;
        if (id && id != '' && mongoose.Types.ObjectId.isValid(id)) {
            let primary = mongoConnection.useDb(constants.DEFAULT_DB);
            let serviceData = await primary.model(constants.MODELS.services, serviceModel).findById(id).lean();
            if (serviceData && serviceData != null) {
                res.render('back/app/edit', { title: 'Update Service || Global Water Blasting', active: 'service', serviceData: serviceData, message: req.flash('message') });
            } else {
                res.render('back/app/service', { title: 'Service || Global Water Blasting', active: 'service', message: req.flash('message') });
            }
        } else {
            req.flash('message', 'Invalid service id to update service, please try again');
            res.redirect('/edit');
        }
    } else {
        res.redirect('/');
    }
});

router.post('/', upload.fields([{ name: 'image' }, { name: 'banner' }, { name: 'before' }, { name: 'after' }]), async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        let { serviceid, servicename, image, banner, shortdesc, longdesc, before, after, title, longdesc1, ptitle, desc } = req.body;
        if (serviceid && serviceid != '' && mongoose.Types.ObjectId.isValid(serviceid)) {
            let primary = mongoConnection.useDb(constants.DEFAULT_DB);
            let serviceData = await primary.model(constants.MODELS.services, serviceModel).findById(serviceid).lean();
            if (serviceData && serviceData != null) {
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
                    image: (req.files['image'] == null) ? image : req.files['image'][0].filename,
                    banner: (req.files['banner'] == null) ? banner : req.files['banner'][0].filename,
                    shortdesc: shortdesc,
                    longdesc: longdesc,
                    images: {
                        before: (req.files['before'] == null) ? before : req.files['before'][0].filename,
                        after: (req.files['after'] == null) ? after : req.files['after'][0].filename,
                    },
                    servicedetails: {
                        title: title,
                        longdesc: longdesc1,
                        points: points
                    }
                }
                let insertedData = await primary.model(constants.MODELS.services, serviceModel).findByIdAndUpdate(serviceid, obj);
                if (insertedData && insertedData != null) {
                    req.flash('message', 'Service updated successfully!');
                    res.redirect('/service');
                } else {
                    req.flash('message', 'Something went wrong, Please try again');
                    res.redirect('/service');
                }
            } else {
                req.flash('message', 'Invalid service id to update service, please try again');
                res.redirect('/service');
            }
        } else {
            req.flash('message', 'Invalid service id to update service, please try again');
            res.redirect('/service');
        }
    } else {
        res.redirect('/');
    }
});

module.exports = router;
