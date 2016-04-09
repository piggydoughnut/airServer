var express = require('express');
var router = express.Router();
import {setUpDb, createId} from "../util/dbHelper";

var collectionName = 'users';

/* GET users  */
router.get('/', function (req, res) {
    var collection = setUpDb(req, collectionName);
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

/* GET user  */
router.get('/:id', function (req, res) {
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
router.post('/', function (req, res) {

});

/* PUT User */
router.put('/:id', function (req, res) {
    var o_id = createId(req, res, mongo);

    setUpDb(req, collectionName).update(
        {_id: o_id},
        {$set: req.body},
        {upsert: true, w: 1},
        function (err, result) {
            if (err) {
                return res.status(400).send(e.message);
            }
            res.status(200).json("User was updated");
        }
    );
});

module.exports = router;
