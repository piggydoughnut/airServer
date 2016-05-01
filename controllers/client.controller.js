var Client = require('../models/client');

exports.postClients = function(req,res) {
    var client = new Client();

    client.name = req.body.name;
    client.id = req.body.id;
    client.secret = req.body.secret;
    client.userId = req.user._id;

    client.save(function(err){
        if(err){
            console.log(err);
            return res.send(err);
        }
        return res.json(client);
    })
};

exports.getClients = function(req, res){
    Client.find({userId: req.user._id}, function(err, clients){
        if(err){
            res.status(400).send(err);
        }
        res.status(200).json(clients);
    })
};
