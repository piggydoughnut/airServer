import {createId} from "../util/query.helper";

var express = require('express');
var passport = require('passport');
var router = express.Router();
var userController = require('../controllers/users.controller');
var User = require('../models/user');


router.get('/me', passport.authenticate('bearer', {session: false}), function (req, res) {
        // req.authInfo is set using the `info` argument supplied by
        // `BearerStrategy`.  It is typically used to indicate scope of the token,
        // and used in access control checks.  For illustrative purposes, this
        // example simply returns the scope in the response.
        return res.status(200).json(userController.getUserInfo(req.user));
    }
);

/* POST User */
router.post('/', userController.postUsers);

/* PUT User */
router.put('/:id', passport.authenticate('bearer', {session: false}), function (req, res) {
    if (req.user._id != req.params.id) {
        return res.status(400).json('You cannot update other users');
    }
    User.findOne({_id: req.user._id}, function (err, user) {
            if (err) {
                return res.status(400).json(err);
            }
            if (!user) {
                return res.status(400).json('User does not exist');
            }
            user.username = req.body.username;
            user.gender = req.body.gender;
            user.country = req.body.country;
            user.file = req.body.file;
            user.email = req.body.email;
            user.password = req.body.password;

            user.save(function (err, user) {
                if (err) {
                    return res.status(400).json(err);
                }
                return res.status(200).json(userController.getUserInfo(user));
            });
        }
    );
});

module.exports = router;
