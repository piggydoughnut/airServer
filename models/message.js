var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var collectionName = 'messages';

var messageSchema = new Schema({
        text: {type: String, required: true},
        description: {type: String, required: true},
        loc: {
            coordinates: {type: [Number], required: true},
            type: {type: String, required: true}
        },
        validity: {type: Date, required: true},
        city: String,
        country: String,
        valid: {type: Boolean, default: true},
        user: {
            id: {type: String, required: true},
            username: {type: String, required: true}
        },
        file: Object,
        object: {type: Boolean, default: false},
        views_count: {type: Number, default: 0},
        comments_count: {type: Number, default: 0},
        created_at: Date
    },
    {
        collection: collectionName
    });

messageSchema.index({loc : '2dsphere'});

messageSchema.plugin(mongoosePaginate);

// add custom methods
// Get city and country
// messageSchema.methods.name = function() {};mo


var Message = mongoose.model('Message', messageSchema);

module.exports = Message;