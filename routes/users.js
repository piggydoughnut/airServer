import {createId} from "../util/queryHelper";

var express = require('express');
var passport = require('passport');
var router = express.Router();
var userController = require('../controllers/users.controller');
var collectionName = 'users';


router.get('/info', passport.authenticate('bearer', { session: false }),
    function(req, res) {
        // req.authInfo is set using the `info` argument supplied by
        // `BearerStrategy`.  It is typically used to indicate scope of the token,
        // and used in access control checks.  For illustrative purposes, this
        // example simply returns the scope in the response.
        res.json({
            user_id: req.user.userId,
            name: req.user.username,
            scope: req.authInfo.scope
        });
    }
);

/* GET users  */
router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {
    var collection = setUpDb(req, collectionName);
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

/* GET user  */
router.get('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {
    var o_id = createId(req, res, mongo);

    setUpDb(req, collectionName).findOne({_id: o_id}, function (err, user) {
        if (!user) {
            return res.status(404).send('User with id ' + o_id + ' was not found');
        }
        if (err) {
            return res.status(400).send(err);
        }
        return res.status(200).json({user: user});
    });
});

/* POST User */
router.post('/', passport.authenticate('bearer', { session: false }), userController.postUsers);

/* PUT User */
router.put('/:id', function (req, res) {
    // var o_id = createId(req, res, mongo);
    //
    // setUpDb(req, collectionName).update(
    //     {_id: o_id},
    //     {$set: req.body},
    //     {upsert: true, w: 1},
    //     function (err, result) {
    //         if (err) {
    //             return res.status(400).send(e.message);
    //         }
    //         res.status(200).json("User was updated");
    //     }
    // );
});

module.exports = router;
