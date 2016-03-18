var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var collectionName = 'users';

var messageSchema = new Schema({
        username: {type: String, required: true},
        gender: {type: String, required: true},
        profile_picture: {
            filename: {type: String, required: true},
            path: {type: String, required: true},
            fileSize: {type: String, required: true},
            mimeType: {type: String, required: true}
        },
        country_id: Number,
        birthday: Date,
        email: {type: String, required: true},
        password: String,
        public: Boolean
    },
    {
        collection: collectionName
    });

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;