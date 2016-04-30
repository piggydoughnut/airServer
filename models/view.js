var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var collectionName = 'views';

var viewSchema = new Schema({
        user_id: {type: String, required: true},
        message_id: {type: String, required: true},
        created_at: Date
    },
    {
        collection: collectionName
    });

viewSchema.plugin(mongoosePaginate);

// add custom methods
// Get city and country
// messageSchema.methods.name = function() {};mo


var View = mongoose.model('View', viewSchema);

module.exports = View;