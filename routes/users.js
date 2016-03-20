var express = require('express');
var mongo = require('mongodb');
var router = express.Router();

var collectionName = 'users';

/* GET users  */
router.get('/', function (req, res) {
    collection = setUpDb(req);
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

/* GET user  */
router.get('/:id', function (req, res) {
    var o_id = createId(req, res);

    setUpDb(req).findOne({_id: o_id}, function (err, user) {
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
    var o_id = createId(req, res);

    setUpDb(req).update(
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

function setUpDb(req) {
    var db = req.db;
    return db.get(collectionName);
}

function createId(req, res) {
    try {
        return new mongo.ObjectID(req.params.id);
    } catch (e) {
        return res.status(400).send(e.message);
    }
}

module.exports = router;
