var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const serviceModel = require('../../models/services.model');
let path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const responseManager = require('../../utilities/response.manager');

var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads')
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage })
const slugify = str =>
    str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

router.get('/', async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        const { id } = req.query;
        if (id && id != '' && mongoose.Types.ObjectId.isValid(id)) {
            let primary = mongoConnection.useDb(constants.DEFAULT_DB);
            let serviceData = await primary.model(constants.MODELS.services, serviceModel).findById(id).lean();
            if (serviceData && serviceData != null) {
                res.render('back/app/edit', { title: 'Update Service || Global Water Blasting', active: 'service', AWS_BUCKET_URI: process.env.AWS_BUCKET_URI, serviceData: serviceData, message: req.flash('message') });
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

router.get('/service', async (req, res) => {
    console.log("Edit req.body", req.query);
    const token = req.cookies.token;
    if (token) {
        const { id } = req.query;
        if (id && id != '' && mongoose.Types.ObjectId.isValid(id)) {
            let primary = mongoConnection.useDb(constants.DEFAULT_DB);
            let serviceData = await primary.model(constants.MODELS.services, serviceModel).findById(id).lean();
            if (serviceData && serviceData != null) {
                return responseManager.onSuccess('Service List', serviceData, res);
            } else {
                return responseManager.onSuccess('Service List', serviceData, res);
            }
        } else {
            req.flash('message', 'Invalid service id to update service, please try again');
            res.redirect('/edit');
        }
    } else {
        res.redirect('/');
    }
});

router.post('/', async (req, res) => {
    console.log("req.body", req.body);
    const token = req.cookies.token;
    if (token) {
        let { serviceid, servicename, image, banner, shortdesc, longdesc, images, title, longdesc1, points } = req.body;
        if (serviceid && serviceid != '' && mongoose.Types.ObjectId.isValid(serviceid)) {
            let primary = mongoConnection.useDb(constants.DEFAULT_DB);
            let serviceData = await primary.model(constants.MODELS.services, serviceModel).findById(serviceid).lean();
            if (serviceData && serviceData != null) {
                let serviceslug = slugify(servicename);
                let obj = {
                    servicename: servicename,
                    serviceslug: serviceslug,
                    image: image,
                    banner: banner,
                    shortdesc: shortdesc,
                    longdesc: longdesc,
                    images: images,
                    servicedetails: {
                        title: title,
                        longdesc: longdesc1,
                        points: points
                    }
                }
                let insertedData = await primary.model(constants.MODELS.services, serviceModel).findByIdAndUpdate(serviceid, obj);
                if (insertedData && insertedData != null) {
                    return responseManager.onSuccess('Service updated successfully!', serviceData, res);
                    // req.flash('message', 'Service updated successfully!');
                    // res.redirect('/service');
                } else {
                    return responseManager.badrequest({message: 'Something went wrong, Please try again'}, res);
                    // req.flash('message', 'Something went wrong, Please try again');
                    // res.redirect('/service');
                }
            } else {
                return responseManager.badrequest({message: 'Invalid service id to update service, please try again'}, res);
                // req.flash('message', 'Invalid service id to update service, please try again');
                // res.redirect('/service');
            }
        } else {
            return responseManager.badrequest({message: 'Invalid service id to update service, please try again'}, res);
            // req.flash('message', 'Invalid service id to update service, please try again');
            // res.redirect('/service');
        }
    } else {
        res.redirect('/');
    }
});

module.exports = router;
