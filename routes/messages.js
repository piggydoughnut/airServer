var express = require('express');
var sanitize = require("mongo-sanitize");
var Message = require('../models/message');
var Comment = require('../models/comment');
import {querySetUp, createId} from "../util/queryHelper";
import {checkInput} from "../util/messageHelper";

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

    var q = checkInput(req);

    var message = new Message({
        text: req.body.text,
        location: {
            latitude: q.lat,
            longitude: q.lng
        },
        validity: req.body.validity,
        user: req.body.user,
        file: req.body.file,
        description: q.desc,
        created_at: new Date()
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

/* POST Comment on a message */
router.post('/:id/comments', function (req, res) {
    if (!Message.find({_id: createId(req.params.id, res)})) {
        res.status(400).json('Message with id ' + req.params.id + ' does not exist');
    }

    var q = checkInput(req);

    var comment = new Comment({
        parent: req.params.id,
        text: req.body.text,
        user: req.body.user,
        description: q.desc,
        created_at: new Date()
    });

    comment.save(function (err) {
        if (err) {
            console.log(err);
            res.status(400).json(err);
            return;
        }
        res.status(201).json({
            text: comment.text,
            _id: comment.id,
            user: comment.user
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
