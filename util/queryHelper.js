var mongo = require('mongodb');

const LIMIT = 10;

function querySetUp(req) {
    var limit = (typeof req.query.limit != 'undefined') ? parseInt(req.query.limit) : LIMIT;
    var page = (typeof req.query.page != 'undefined') ? parseInt(req.query.page) : 0;
    var offset = page ? limit * page - 1 : 0;

    return {
        limit,
        page,
        offset
    }
}

function createId(id, res) {
    try {
        return new mongo.ObjectID(id);
    } catch (e) {
        return res.status(400).send('The provided id is not in the required format');
    }
}

module.exports = {querySetUp, createId};
