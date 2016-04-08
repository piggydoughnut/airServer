var express = require('express');
var sanitize = require("mongo-sanitize");
var Message = require('../models/message');

var router = express.Router();
var collectionName = 'messages';


/* GET Messages */
router.get('/', function (req, res) {
    var db = req.db;
    var collection = db.get(collectionName);
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

/* POST Message */
router.post('/', function (req, res) {
    var message = new Message({
        text: req.body.text,
        location: {
            latitude: req.body.location.latitude,
            longitude: req.body.location.longitude
        },
        validity: req.body.validity,
        user: req.body.user,
        file: req.body.file
    });

    message.save(function (err) {
        if (err) {
           console.log(err);
            res.status(400).json(err);
            return;
        }
        res.status(200).json({
            text: message.text,
            _id: message.id,
            user: message.user
        });
    });
});

module.exports = router;
