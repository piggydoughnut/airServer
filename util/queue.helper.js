
function addToValidQueue(queue, message){
    var job = queue.create('valid-queue', {
            title: 'unset valid',
            message_id: message.id,
        })
        .delay(message.validity)
        .save(function (err) {
            if (!err) console.log('Job ' + job.id + ' is being processed');
        });
}


function addToGeoQueue(queue, message){
    var job = queue.create('geo-queue', {
            title: 'set city and country',
            message: message
        })
        .save(function (err) {
            if (!err) console.log('Job ' + job.id + ' is being processed');
        });
}

module.exports = {addToValidQueue, addToGeoQueue};
