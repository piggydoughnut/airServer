var mongoose = require('mongoose');
var Message = require('../models/message');
var kue = require('kue');
var queue = kue.createQueue();

queue.process('geo-queue', function(job, done){
    updateValid(job.data, done);
});

function updateValid(data, done) {
    console.log(data);
    console.log('email fn');
    done();
}
