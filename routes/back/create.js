var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const serviceModel = require('../../models/services.model');
const allowedContentTypes = require("../../utilities/content-types");
let path = require('path');
// const multer = require('multer');
const AwsCloud = require('../../utilities/aws');
let fileHelper = require('../../utilities/multer.functions');
const responseManager = require('../../utilities/response.manager');
const multer = require('multer');
const upload = multer();

// var storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'public/uploads')
//     },
//     filename: (req, file, callback) => {
//         callback(null, Date.now() + path.extname(file.originalname));
//     }
// });

// var upload = multer({ storage })

const slugify = str =>
    str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');


function uploadImage(res, req) {
    console.log("req.body", req.body);
    if (req.files) {
        if (allowedContentTypes.imagearray.includes(req.files['image'][0].mimetype)) {
            let filesizeinMb = parseFloat(parseFloat(req.files['image'][0].size) / 1048576);
            if (filesizeinMb <= 3) {
                AwsCloud.saveToS3(req.files['image'][0].buffer, req.files['image'][0].mimetype, 'service').then((result) => {
                    let obj = {
                        s3_url: process.env.AWS_BUCKET_URI,
                        url: result.data.Key
                    };
                    return responseManager.onSuccess('File uploaded successfully!', obj, res);
                }).catch((error) => {
                    return responseManager.onError(error, res);
                });
            } else {
                return responseManager.badrequest({ message: 'Image file must be <= 3 MB, please try again' }, res);
            }
        } else {
            return responseManager.badrequest({ message: 'Invalid file type only image files allowed, please try again' }, res);
        }
    } else {
        return responseManager.badrequest({ message: 'Invalid file to upload, please try again' }, res);
    }
}

router.post('/image', fileHelper.memoryUpload.single('image'), async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        console.log('req.file', req.file);
        if (req.file) {
            if (allowedContentTypes.imagearray.includes(req.file.mimetype)) {
                let filesizeinMb = parseFloat(parseFloat(req.file.size) / 1048576);
                if (filesizeinMb <= 7) {
                    AwsCloud.saveToS3(req.file.buffer, req.file.mimetype, 'service').then((result) => {
                        let obj = {
                            s3_url: process.env.AWS_BUCKET_URI,
                            url: result.data.Key
                        };
                        console.log('obj', obj);
                        return responseManager.onSuccess('File uploaded successfully!', obj, res);
                    }).catch((error) => {
                        return responseManager.onError(error, res);
                    });
                } else {
                    return responseManager.badrequest({message:'Image file must be <= 3 MB, please try again'}, res);
                }
            } else {
                return responseManager.badrequest({message:'Invalid file type only image files allowed, please try again'}, res);
            }
        } else {
            return responseManager.badrequest({message:'Invalid file to upload, please try again'}, res);
        }
    } else {
        res.redirect('/');
    }
});
router.post('/banner', fileHelper.memoryUpload.single('banner'), async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        console.log('req.file', req.file);
        if (req.file) {
            if (allowedContentTypes.imagearray.includes(req.file.mimetype)) {
                let filesizeinMb = parseFloat(parseFloat(req.file.size) / 1048576);
                if (filesizeinMb <= 7) {
                    AwsCloud.saveToS3(req.file.buffer, req.file.mimetype, 'service').then((result) => {
                        let obj = {
                            s3_url: process.env.AWS_BUCKET_URI,
                            url: result.data.Key
                        };
                        console.log('obj', obj);
                        return responseManager.onSuccess('File uploaded successfully!', obj, res);
                    }).catch((error) => {
                        return responseManager.onError(error, res);
                    });
                } else {
                    return responseManager.badrequest({message:'Image file must be <= 3 MB, please try again'}, res);
                }
            } else {
                return responseManager.badrequest({message:'Invalid file type only image files allowed, please try again'}, res);
            }
        } else {
            return responseManager.badrequest({message:'Invalid file to upload, please try again'}, res);
        }
    } else {
        res.redirect('/');
    }
});
router.post('/before', fileHelper.memoryUpload.single('before'), async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        console.log('req.file', req.file);
        if (req.file) {
            if (allowedContentTypes.imagearray.includes(req.file.mimetype)) {
                let filesizeinMb = parseFloat(parseFloat(req.file.size) / 1048576);
                if (filesizeinMb <= 7) {
                    AwsCloud.saveToS3(req.file.buffer, req.file.mimetype, 'service').then((result) => {
                        let obj = {
                            s3_url: process.env.AWS_BUCKET_URI,
                            url: result.data.Key
                        };
                        console.log('obj', obj);
                        return responseManager.onSuccess('File uploaded successfully!', obj, res);
                    }).catch((error) => {
                        return responseManager.onError(error, res);
                    });
                } else {
                    return responseManager.badrequest({message:'Image file must be <= 3 MB, please try again'}, res);
                }
            } else {
                return responseManager.badrequest({message:'Invalid file type only image files allowed, please try again'}, res);
            }
        } else {
            return responseManager.badrequest({message:'Invalid file to upload, please try again'}, res);
        }
    } else {
        res.redirect('/');
    }
});
router.post('/after', fileHelper.memoryUpload.single('after'), async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        console.log('req.file', req.file);
        if (req.file) {
            if (allowedContentTypes.imagearray.includes(req.file.mimetype)) {
                let filesizeinMb = parseFloat(parseFloat(req.file.size) / 1048576);
                if (filesizeinMb <= 7) {
                    AwsCloud.saveToS3(req.file.buffer, req.file.mimetype, 'service').then((result) => {
                        let obj = {
                            s3_url: process.env.AWS_BUCKET_URI,
                            url: result.data.Key
                        };
                        console.log('obj', obj);
                        return responseManager.onSuccess('File uploaded successfully!', obj, res);
                    }).catch((error) => {
                        return responseManager.onError(error, res);
                    });
                } else {
                    return responseManager.badrequest({message:'Image file must be <= 3 MB, please try again'}, res);
                }
            } else {
                return responseManager.badrequest({message:'Invalid file type only image files allowed, please try again'}, res);
            }
        } else {
            return responseManager.badrequest({message:'Invalid file to upload, please try again'}, res);
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


router.post('/', async (req, res) => {
    console.log("req.body", req.body);
    const token = req.cookies.token;
    if (token) {
        let { servicename, image, banner, shortdesc, longdesc, before, after, title, longdesc1, points } = req.body;
        if (servicename && servicename != '' && shortdesc && shortdesc != '' && longdesc && longdesc != '') {
            let primary = mongoConnection.useDb(constants.DEFAULT_DB);
            let serviceData = await primary.model(constants.MODELS.services, serviceModel).findOne({ "servicename": servicename }).lean();
            if (serviceData == null) {
                let serviceslug = slugify(servicename);
                let obj = {
                    servicename: servicename,
                    serviceslug: serviceslug,
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
                let insertedData = await primary.model(constants.MODELS.services, serviceModel).create(obj)
                if (insertedData && insertedData != null) {
                    return responseManager.onSuccess('Service created successfully!', obj, res);
                } else {
                    return responseManager.badrequest({ message: 'Something went wrong, Please try again' }, res);
                }
            } else {
                return responseManager.badrequest({ message: 'Service already exist with same name, Please try again...' }, res);
            }
        } else {
            return responseManager.badrequest({ message: 'Invalid service name, descriprions, images and banner can not be empty, please try again' }, res);
        }
    } else {
        res.redirect('/');
    }
});

module.exports = router;
