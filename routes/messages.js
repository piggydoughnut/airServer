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
        text: sanitize(req.body.text), // ???
        location: {
            lat: req.body.location.lat,
            lng: req.body.location.lng
        },
        validity: req.body.validity
    });

    message.save(function (err) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).json('Messsage was successfully saved');
    })
});

module.exports = router;
