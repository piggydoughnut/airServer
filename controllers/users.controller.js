var User = require('../models/user');

exports.postUsers = function (req, res) {
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        gender: req.body.gender,
        email: req.body.email
    });
    user.save(function (err, savedUser) {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).json(savedUser);
    })
};

exports.getUserInfo = function (user) {
    return {
        _id: user.userId,
        username: user.username,
        gender: user.gender,
        country: user.country,
        file: user.file,
        email: user.email,
        public: user.public
    }
}
