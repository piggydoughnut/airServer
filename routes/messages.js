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
        select: 'description location created_at'
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

/* GET Message */
router.get('/:id', function (req, res) {
    Message.findOne({_id: createId(req.params.id, res)}, function(err, docs){
        if (err) {
            res.status(400).json(err);
            return;
        }
        if(docs){
            var query = {parent: req.params.id};
            var options = {
                limit: 10,
                sort: {published_at: -1},
                select: 'description created_at user'
            };
            Message.paginate(query, options).then(function (result, err) {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                result.docs = result.docs.reverse();
                return res.json({
                    message: docs,
                    comments: result
                });
            });
        } else {
            res.status(400).json('Message with id '+ req.params.id + ' does not exist ');
        }
    });
});

/* GET Messages by User */
router.get('/user/:id', function (req, res) {

    var q = querySetUp(req);
    var query = {'user.id': req.params.id, parent: null};
    var options = {
        limit: q.limit,
        offset: q.offset,
        select: 'description location created_at'
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
        created_at: new Date(),
        view_count: 0,
        comments_count: 0
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
        published_at: new Date()
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
        select: 'description location created_at'
    };

    Message.paginate(query, options).then(function (result, err) {
        if (err) {
            console.log(err);
            res.status(400).json(err);
            return;
        }
        result.docs = result.docs.reverse();
        res.status(200).json(result);
    });
});

module.exports = router;
