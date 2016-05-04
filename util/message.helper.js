var Message = require('../models/message');
var MessageObj = require('../models/messageObj');

function checkInput(req) {

    var lat = '';
    var lng = '';
    var desc = '';
    if (typeof req.body.loc != 'undefined' && typeof req.body.loc.coordinates != 'undefined') {
        lat = req.body.loc.coordinates[1];
        lng = req.body.loc.coordinates[0];
    }
    if (typeof req.body.text != 'undefined') {
        desc = req.body.text.substr(0, 150);
    }
    return {lat, lng, desc};
}

function setMessage(req, q) {
    var validity = getValidityDate(req.body.validity);
    return new Message({
        text: req.body.text,
        loc: {
            type: "Point",
            coordinates: [
                q.lng, q.lat
            ],
            longitude: q.lng
        },
        validity: validity,
        valid: true,
        user: req.body.user,
        file: req.body.file,
        description: q.desc,
        created_at: new Date(),
        view_count: 0,
        object: false,
        comments_count: 0
    });
}

function setMessageObj(req, q) {
    var validity = getValidityDate(req.body.validity);
    return new MessageObj({
        text: req.body.text,
        description: q.desc,
        loc: {
            type: "Point",
            coordinates: [
                q.lng, q.lat
            ],
        },
        validity: validity,
        valid: true,
        user: req.body.user,
        obj: req.body.obj,
        object: true,
        created_at: new Date(),
        view_count: 0
    });
}

function getValidityDate(validity){
    var dateObj = Date.now();
    dateObj += 1000 * 60 * 60 * 24 * validity;
    return new Date(dateObj);
}

module.exports = {checkInput, setMessage, setMessageObj};
