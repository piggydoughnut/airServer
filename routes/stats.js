var Message = require('../models/message');
var express = require('express');
var router = express.Router();

router.get('/countries', function (req, res) {
    Message.aggregate([
        {$group: {_id: "$country", value: {$sum: 1}}},
        {$project: {_id: 0, x: "$_id", y: "$value"}},
        {$sort: {y: -1}},
        {$limit: 10}
    ], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        if (res) {
            return res.status(200).json({values: result});
        }
    })
});

router.get('/cities', function (req, res) {
    Message.aggregate([
        {$group: {_id: "$city", value: {$sum: 1}}},
        {$project: {_id: 0, x: "$_id", y: "$value"}},
        {$sort: {y: -1}},
        {$limit: 10}
    ], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        if (res) {
            return res.status(200).json({values: result});
        }
    })
});

module.exports = router;
