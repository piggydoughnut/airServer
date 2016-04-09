var express = require('express');
var sanitize = require("mongo-sanitize");
var Message = require('../models/message');
import {setUpDb} from '../util/dbHelper';

var router = express.Router();
var collectionName = 'messages';


/* GET Messages */
router.get('/', function (req, res) {
    var collection = setUpDb(req, collectionName);
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
        file: req.body.file,
        description: req.body.text.substr(0, 150)
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

/* GET Message's comments */
router.get('/:id/comments', function (req, res) {
    var collection = setUpDb(req, collectionName);
    collection.find({parent: req.params.id}, {}, function (e, docs) {
        res.json(docs);
    });
});

module.exports = router;
