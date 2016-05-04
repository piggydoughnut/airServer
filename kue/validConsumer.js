var mongoose = require('mongoose');
// the port might change
mongoose.connect('localhost:27017/airdb');
var mongo = require('mongodb');
var Message = require('../models/message');

var kue = require('kue');
var queue = kue.createQueue();

queue.process('valid-queue', function (job, done) {
    updateMessage(job.data, done);
});

function updateMessage(data, done) {
    console.log(data);
    var id = '';

    Message.findById(new mongo.ObjectID(data.message_id), function (err, message) {
        if (err) {
            console.log(err);
            done();
        }
        if(!message){
            console.log('message with id ' + data.message_id);
            done();
        }
        message.valid = false;
        message.save(function (err) {
            if (err) {
                console.log(err);
            }
            console.log('message with id ' + data.message_id + ' was update');
            done();
        });
    });
}
