var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var collectionName = 'messages';

var messageSchema = new Schema({
        text: {type: String, required: true},
        location: {
            lng: {type: Number, required: true},
            lat: {type: Number, required: true},
            city: String,
            country: String
        },
        validity: {type: Number, required: true},
        valid: Boolean,
        user_id: Number,
        views_count: Number,
        created_at: Date
    },
    {
        collection: collectionName
    });

// add custom methods
// Get city and country
// messageSchema.methods.name = function() {};mo


var Message = mongoose.model('Message', messageSchema);

module.exports = Message;