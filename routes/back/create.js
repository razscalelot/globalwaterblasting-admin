var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const serviceModel = require('../../models/services.model');
const allowedContentTypes = require("../../utilities/content-types");
let path = require('path');
const multer = require('multer');
const AwsCloud = require('../../utilities/aws');
let fileHelper = require('../../utilities/multer.functions');
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


router.post('/image', fileHelper.memoryUpload.single('image'), async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        if (req.file) {
            if (allowedContentTypes.imagearray.includes(req.file.mimetype)) {
                let filesizeinMb = parseFloat(parseFloat(req.file.size) / 1048576);
                if (filesizeinMb <= 3) {
                    AwsCloud.saveToS3(req.file.buffer, req.file.mimetype, 'service').then((result) => {
                        console.log('result', result);
                        let obj = {
                            s3_url: process.env.AWS_BUCKET_URI,
                            url: result.data.Key
                        };
                        return obj;
                    }).catch((error) => {
                        // return responseManager.onError(error, res);
                        req.flash('message', error);
                        res.redirect('/service');
                    });
                } else {
                    req.flash('message', 'Image file must be <= 3 MB, please try again');
                    res.redirect('/service');
                }
            } else {
                req.flash('message', 'Invalid file type only image files allowed, please try again');
                res.redirect('/service');
            }
        } else {
            req.flash('message', 'Invalid file to upload, please try again');
            res.redirect('/service');
        }
    } else {
        res.redirect('/');
    }
});


router.get('/', async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        res.render('back/app/create', { title: 'Create New Service || Global Water Blasting', active: 'service', message: req.flash('message') });
    } else {
        res.redirect('/');
    }
});


router.post('/', upload.fields([{ name: 'image' }, { name: 'banner' }, { name: 'before' }, { name: 'after' }]), async (req, res) => {
    const token = req.cookies.token;
    if (token) {
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
                let serviceslug = slugify(servicename);
                let obj = {
                    servicename: servicename,
                    serviceslug: serviceslug,
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
                    req.flash('message', 'Service created successfully!')
                    res.redirect('/service');
                } else {
                    req.flash('message', 'Something went wrong, Please try again',)
                    res.redirect('/create');
                }
            } else {
                req.flash('message', 'The request message was already sent. We will contact you very soon!',)
                res.redirect('/create');
            }
        } else {
            req.flash('message', 'Invalid service name, descriprions, images and banner can not be empty, please try again',)
            res.redirect('/create');
        }
    } else {
        res.redirect('/');
    }
});

module.exports = router;
