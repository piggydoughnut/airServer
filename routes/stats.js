var Message = require('../models/message');
var express = require('express');
var router = express.Router();

router.get('/countries', function (req, res) {
    Message.aggregate({$group: {country: '$country', city: '$city'}}, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        if (res) {
            console.log(result);
            return res.status(200).json(result);
        }
    })
});

module.exports = router;
