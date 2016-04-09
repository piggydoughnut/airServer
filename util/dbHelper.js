var mongo = require('mongodb');

function setUpDb(req, collectionName) {
    var db = req.db;
    return db.get(collectionName);
}

function createId(id, res) {
    try {
        return new mongo.ObjectID(id);
    } catch (e) {
        return res.status(400).send(e.message);
    }
}
module.exports = {setUpDb, createId};