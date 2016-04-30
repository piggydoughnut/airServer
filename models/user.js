var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;
var collectionName = 'users';

var userSchema = new Schema({
        username: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        gender: {type: String, required: true},
        email: {type: String, unique: true, required: true},
        public: {type: Boolean, default: true},
        country_id: Number,
        birthday: Date
    },
    {
        collection: collectionName
    });

// Executes before each user save
userSchema.pre('save', function (callback) {
    var user = this;

    // Break out if the password hasn't changed
    if(!user.isModified('password')) {
        return callback();
    }

    //Password changed and need re-hash
    bcrypt.genSalt(5, function(err, salt){
        if(err){
            return callback(err);
        }

        bcrypt.hash(user.password, salt, null ,function(err ,hash){
            if(err){
                return callback(err);
            }
            user.password = hash;
            callback();
        });
    });

});

module.exports = mongoose.model('User', userSchema);