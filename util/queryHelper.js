var mongo = require('mongodb');

const LIMIT = 10;
const MAX_LIMIT = 50;

function querySetUp(req) {
    var limit = (typeof req.query.limit != 'undefined') ? parseInt(req.query.limit) : LIMIT;
    if(limit > MAX_LIMIT ){
        limit = MAX_LIMIT;
    }

    var page = (typeof req.query.page != 'undefined') ? parseInt(req.query.page) : 1;
    var offset = page ? limit * (page - 1) : 0;

    if (page == 0 || page < 1 ) {
        throw 'invalid page number - ' + req.query.page;
    }
    if(limit <= 0){
        throw 'invalid limit - ' + req.query.limit;
    }

    return {
        limit,
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
