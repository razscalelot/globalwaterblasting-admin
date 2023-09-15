var express = require('express');
var router = express.Router();
const mongoConnection = require('../../utilities/connections');
const constants = require('../../utilities/constants');
const quoteModel = require('../../models/quotes.model');

/* GET home page. */
router.get('/', async (req, res) => {    
    const { page = 1, limit = 10, search } = req.query;
    let primary = mongoConnection.useDb(constants.DEFAULT_DB);
    await primary.model(constants.MODELS.quotes, quoteModel).paginate({
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
    }).then((quoteData) => {
        res.render('back/app/quote', { title: 'Quote || Global Water Blasting', active: 'quote', quoteData: quoteData });
    }).catch((error) => {
        res.render('back/app/quote', { title: 'Quote || Global Water Blasting', active: 'quote', quoteData: quoteData });
    })
});

module.exports = router;
