var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var collectionName = 'messages';

var messageObjSchema = new Schema({
        text: String,
        location: {
            longitude: {type: Number, required: true},
            latitude: {type: Number, required: true},
            city: String,
            country: String
        },
        validity: {type: Number, required: true},
        valid: Boolean,
        user: {
            id: {type: String, required: true},
            username: {type: String, required: true}
        },
        obj: Object,
        views_count: Number,
        created_at: Date
    },
    {
        collection: collectionName
    });

messageObjSchema.plugin(mongoosePaginate);

// add custom methods
// Get city and country
// messageSchema.methods.name = function() {};mo


var MessageObj = mongoose.model('MessageObj', messageObjSchema);

module.exports = MessageObj;
