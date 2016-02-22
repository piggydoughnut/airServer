var express = require('express');
var router = express.Router();
var collectionName = 'messagescollection';

/* GET Messages */
router.get('/', function (req, res) {
    var db = req.db;
    var collection = db.get(collectionName);
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

/* POST to Add User Service */
router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get(collectionName);
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
        )
    });
});

module.exports = router;
