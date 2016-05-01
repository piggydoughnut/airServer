var mongoose = require('mongoose');

var RefreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
