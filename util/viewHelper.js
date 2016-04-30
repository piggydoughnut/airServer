var View = require('../models/view');

function checkView(message, user_id) {
    View.findOne({user_id: user_id, message_id: message._id}, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (!result) {
            message.views_count = message.views_count + 1;
            message.save(function(err){
                if(err){
                    console.log(err);
                }
            })
        }
        var view = setView(message._id, user_id);
        view.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
}

function setView(message_id, user_id) {
    return new View({
        message_id: message_id,
        user_id: user_id,
        created_at: new Date()
    })
}

module.exports = {checkView};
