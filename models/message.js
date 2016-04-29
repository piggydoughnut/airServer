var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var collectionName = 'messages';

var messageSchema = new Schema({
        text: {type: String, required: true},
        description: {type: String, required: true},
        loc: {
            coordinates: {type: Array, required: true},
            type: {type: String, required: true},
            city: String,
            country: String
        },
        validity: {type: Number, required: true},
        valid: Boolean,
        user: {
            id: {type: String, required: true},
            username: {type: String, required: true}
        },
        file: Object,
        object: Boolean,
        views_count: Number,
        comments_count: Number,
        created_at: Date
    },
    {
        collection: collectionName
    });

messageSchema.plugin(mongoosePaginate);

// add custom methods
// Get city and country
// messageSchema.methods.name = function() {};mo


var Message = mongoose.model('Message', messageSchema);

module.exports = Message;