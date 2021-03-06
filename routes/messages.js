import {querySetUp, createId} from "../util/query.helper";
import {checkView} from "../util/view.helper";
import {checkInput, setMessage, setMessageObj} from "../util/message.helper";
import {addToValidQueue, addToGeoQueue} from "../util/queue.helper";

var express = require('express');
var passport = require('passport');
var sanitize = require("mongo-sanitize");
var async = require('async');
var router = express.Router();

var Message = require('../models/message');
var Comment = require('../models/comment');
var Config = require('../config/config');
var View = require('../models/view');

var geolib = require('geolib/dist/geolib');

/* GET Messages */
router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {

    if (!req.query.hasOwnProperty('lat') || !req.query.hasOwnProperty('lng') || isNaN(req.query.lat) || isNaN(req.query.lng)) {
        return res.status(400).json('Input coordinates are not set');
    }
    var query = {
        valid: true,
        parent: null,
        loc: {
            $geoWithin: {
                $centerSphere: [
                    [
                        parseFloat(req.query.lng),
                        parseFloat(req.query.lat)
                    ],
                    Config.radiusRes
                ]
            }
        }
    };
    var options = {
        limit: 99999999,
        offset: 0,
        select: 'description loc object created_at'
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
router.get('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {

    Message.findOne({_id: createId(req.params.id, res)}, function (err, message) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        if (message) {

            if(!message.valid){
                return res.status(400).json('Given message is not valid anymore');
            }

            if (req.user._id != message.user.id) {
                if (!req.query.hasOwnProperty('lat') || !req.query.hasOwnProperty('lng') || isNaN(req.query.lat) || isNaN(req.query.lng) || req.query.lat==='' || req.query.lat===null || req.query.lng==='' || req.query.lng===null) {
                    return res.status(400).json('Input coordinates are not set');
                }
                /** We cannot read messages if we are not close to them */
                if (geolib.getDistance(
                        {
                            latitude: message.loc.coordinates[1],
                            longitude: message.loc.coordinates[0]
                        }, {
                            latitude: req.query.lat,
                            longitude: req.query.lng
                        }, 1, 1) > Config.distance) {
                    return res.status(400).json('Far');
                }
            }

            checkView(message, req.user._id);

            /** Looking for message's comments **/
            var query = {parent: req.params.id};
            var options = {
                limit: 10,
                sort: {created_at: -1},
                select: 'description text created_at user'
            };
            Message.paginate(query, options).then(function (result, err) {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                result.docs.reverse();
                return res.json({
                    message: message,
                    comments: result
                });
            });
        } else {
            res.status(400).json('Message with id ' + req.params.id + ' does not exist ');
        }
    });
});

/* GET Messages by User */
router.get('/user/:id', passport.authenticate('bearer', { session: false }), function (req, res) {
    if (req.user._id != req.params.id) {
        return res.status(400).json('You cannot get other users messages');
    }
    console.log(req.params);
    var q = querySetUp(req);
    var query = {
        'user.id': req.params.id,
        parent: null,
        valid: true
    };
    var options = {
        limit: q.limit,
        offset: q.offset,
        select: 'description text loc views_count comments_count obj created_at'
    };

    Message.paginate(query, options).then(function (result, err) {

        if (err) {
            console.log(err);
            res.status(400).json(err);
            return;
        }
        var newDocs = [];

        var getCount = function(entry, index, callback){
            View.findOne({user_id: req.params.id, message_id: entry._id}, 'created_at', {sort: {'created_at': -1}}, function (err, res) {
                if (err) {
                    console.log(err);
                }
                if (!res) {
                    res = entry;
                }
                Comment.count({parent: entry._id, created_at: {$gte: res.created_at.toISOString()}, 'user.id': {$ne: req.params.id}}, function (err, count) {
                    if (err) {
                        console.log(err);
                    }

                    newDocs[index] = {};
                    newDocs[index]._id = entry._id;
                    newDocs[index].description = entry.description;
                    newDocs[index].text = entry.text;
                    newDocs[index].created_at = entry.created_at;
                    newDocs[index].loc = {
                        city: 'Prague',
                        country: 'Czech Republic'
                    };
                    newDocs[index].views_count = entry.views_count;
                    newDocs[index].comments_count = entry.comments_count;
                    newDocs[index].new_comments_count = count;
                    callback();
                });
            });
        };

        async.forEachOf(result.docs, getCount, function(err) {
            return res.status(200).json({
                docs: newDocs,
                total: result.total,
                limit: result.limit,
                offset: result.offset
            });
        });
    });
});

/* POST Message */
router.post('/', passport.authenticate('bearer', { session: false }), function (req, res) {

    var q = checkInput(req);
    var message = {};
    if (req.body.hasOwnProperty('obj')) {
        message = setMessageObj(req, q);
    } else {
        message = setMessage(req, q);
    }

    message.save(function (err) {
        if (err) {
            console.log(err);
            res.status(400).json(err);
            return;
        }

        addToValidQueue(req.queue, message);
        addToGeoQueue(req.queue, message);

        res.status(200).json({
            description: message.description,
            _id: message.id,
            user: message.user,
            loc: message.loc,
            object: message.obj ? true : false
        });
    });
});

/* POST Comment on a message */
router.post('/:id/comments', passport.authenticate('bearer', { session: false }), function (req, res) {
    Message.findOne({_id: createId(req.params.id, res)}, function(err, message) {
        if(!message){
            return res.status(400).json('Message with id ' + req.params.id + ' does not exist');
        }
        if(!message.valid){
            return res.status(400).json('Given message is not valid anymore');
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
            message.comments_count = message.comments_count + 1;
            message.save(function(err){
                if(err){
                    console.log(err);
                }
            });
            return res.status(201).json({
                _id: comment.id,
                description: comment.description,
                text: comment.text,
                created_at: comment.created_at,
                user: comment.user
            });
        });
    });
});

/* GET Message's comments */
router.get('/:id/comments', passport.authenticate('bearer', { session: false }), function (req, res) {

    var q = querySetUp(req);
    var query = {parent: req.params.id};
    var options = {
        limit: q.limit,
        offset: q.offset,
        sort: {created_at: -1},
        select: 'description text user created_at'
    };

    Message.findById(createId(req.params.id), function(err, result) {
        if (err) {
            console.log(err);
            res.status(400).json(err);
            return;
        }

        if(!result.valid){
            return res.status(400).json('Given message is not valid anymore');
        }

        Message.paginate(query, options).then(function (result, err) {
            if (err) {
                console.log(err);
                res.status(400).json(err);
                return;
            }
            result.docs.reverse();
            res.status(200).json(result);
        });
    });
});

module.exports = router;
