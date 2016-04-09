var express = require('express');
var sanitize = require("mongo-sanitize");
var Message = require('../models/message');
import {querySetUp} from "../util/queryHelper";

var router = express.Router();


/* GET Messages */
router.get('/', function (req, res) {

    var q = querySetUp(req);
    var query = {parent: null};
    var options = {
        limit: q.limit,
        offset: q.offset,
        select: 'description location'
    };
    console.log(q.limit);
    console.log(q.offset);

    Message.paginate(query, options).then(function (result, err) {
        if (err) {
            console.log(err);
            res.status(400).json(err);
            return;
        }
        res.json(result);
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

    var q = querySetUp(req);
    var query = {parent: req.params.id};
    var options = {
        limit: q.limit,
        offset: q.offset,
        sort: {published_at: -1},
        select: 'description published_at user'
    };

    Message.paginate(query, options).then(function (result, err) {
        if (err) {
            console.log(err);
            res.status(400).json(err);
            return;
        }
        res.status(200).json(result);
    });
});

module.exports = router;
