var Message = require('../models/message');
var MessageObj = require('../models/messageObj');
var View = require('../models/view');

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
    return new Message({
        text: req.body.text,
        loc: {
            type: "Point",
            coordinates: [
                q.lng, q.lat
            ],
            longitude: q.lng
        },
        validity: req.body.validity,
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
    return new MessageObj({
        text: req.body.text,
        description: q.desc,
        loc: {
            type: "Point",
            coordinates: [
                q.lng, q.lat
            ],
        },
        validity: req.body.validity,
        user: req.body.user,
        obj: req.body.obj,
        object: true,
        created_at: new Date(),
        view_count: 0
    });
}

function checkView(message, user_id) {
    View.findOne({user_id: user_id, message_id: message._id}, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (!result) {
            updateViewCountMessage(message);
        }
        var view = setView(message._id, user_id);
        view.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
}

function updateViewCountMessage(message) {
    console.log('updating');
    var conditions = {_id: message._id};
    var update = {$inc: {views_count: 1}};
    Message.update(conditions, update, [], function(err){
        console.log('updated');
        if(err) {
            console.log(err);
        }
    });
}
function setView(message_id, user_id) {
    return new View({
        message_id: message_id,
        user_id: user_id,
        created_at: new Date()
    })
}

module.exports = {checkInput, setMessage, setMessageObj, setView, checkView};
