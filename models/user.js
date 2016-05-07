var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;
var collectionName = 'users';

var userSchema = new Schema({
        username: {type: String, unique: true, required: true},
        hashedPassword: {type: String, required: true},
        salt: {
            type: String,
            required: true
        },
        gender: {type: String, required: false},
        email: {type: String, unique: true, required: true},
        public: {type: Boolean, default: true},
        country: String,
        file: Object
    },
    {
        collection: collectionName
    });


userSchema.methods.encryptPassword = function(password) {
    // return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure -
    return crypto.pbkdf2Sync(password, this.salt, 10000, 512).toString('hex');
};

userSchema.virtual('userId')
    .get(function () {
        return this.id;
    });

userSchema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        //this.salt = crypto.randomBytes(32).toString('hex');
        //more secure -
        this.salt = crypto.randomBytes(128).toString('hex');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


userSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
