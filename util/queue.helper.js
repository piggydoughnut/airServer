
function addToValidQueue(queue, message){
    var job = queue.create('valid-queue', {
            title: 'unset valid',
            message_id: message.id,
            message_expiration: message.validity
        })
        .delay(message.validity)
        .save(function (err) {
            if (!err) console.log('Job ' + job.id + ' is being processed');
        });
}

module.exports = {addToValidQueue};
