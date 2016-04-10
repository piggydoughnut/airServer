var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

/* comment are the same as messages, just missing a few attributes */
var collectionName = 'messages';

var commentSchema = new Schema({
        text: {type: String, required: true},
        description: {type: String, required: true},
        parent: {type: String, required: true},
        user: {
            id: {type: String, required: true},
            username: {type: String, required: true}
        },
        published_at: Date
    },
    {
        collection: collectionName
    });

commentSchema.plugin(mongoosePaginate);

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;