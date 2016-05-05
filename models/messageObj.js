var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var collectionName = 'messages';

var messageObjSchema = new Schema({
        text: String,
        description: String,
        loc: {
            coordinates: {type: [Number], required: true},
            type: {type: String, required: true}
        },
        validity: {type: Date, required: true},
        valid: {type: Boolean, default: true},
        city: String,
        country: String,
        user: {
            id: {type: String, required: true},
            username: {type: String, required: true}
        },
        obj: Object,
        object: {type: Boolean, default: true},
        views_count: {type: Number, default: 0},
        comments_count: {type: Number, default: 0},
        created_at: Date
    },
    {
        collection: collectionName
    });

messageObjSchema.index({loc : '2dsphere'});

messageObjSchema.plugin(mongoosePaginate);

// add custom methods
// Get city and country
// messageSchema.methods.name = function() {};mo


var MessageObj = mongoose.model('MessageObj', messageObjSchema);

module.exports = MessageObj;
