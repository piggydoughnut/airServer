var mongoose = require('mongoose');
mongoose.connect('localhost:27017/airdb');
var mongo = require('mongodb');
var kue = require('kue');
var queue = kue.createQueue();

var Message = require('../models/message');
var config = require("../config/config");
var GoogleMapsAPI = require('../node_modules/googlemaps/lib/index');
var gmAPI = new GoogleMapsAPI(config.google_config);

queue.process('geo-queue', function (job, done) {
    geoCode(job.data.message, done);
});

function geoCode(data, done) {
    // reverse geocode API

    if(data.loc.coordinates == [] ||
        data.loc.coordinates[0] == undefined ||
        data.loc.coordinates[0] == null ||
        data.loc.coordinates[1] == undefined ||
        data.loc.coordinates[1] == null
    ){
        console.log('incorrect coordinates');
        done();
        return;
    }
    var reverseGeocodeParams = {
        "latlng": data.loc.coordinates[1] + ',' + data.loc.coordinates[0],
        "result_type": "locality",
        "language": "en"
    };

    gmAPI.reverseGeocode(reverseGeocodeParams, function (err, result) {
        Message.findById(new mongo.ObjectID(data._id), function (err, message) {
            if (err) {
                console.log(err);
                done();
                return;
            }
            if (!message) {
                console.log('there is no message with id ' + data.message_id);
                done();
                return;
            }

            if (result.status == 'ZERO_RESULTS' || result.results == [] ) {
                console.log('No results');
                done();
                return;
            }
            parseRespone(result.results[0].address_components).then((address) => {
                console.log(address);
                message.city = address.city;
                message.country = address.country;
                message.save(function (err) {
                    if (err) {
                        console.log(err);
                        done();
                    }
                    console.log('message with id ' + data._id + ' was update with city and country');
                    done();
                });
            });

        });
    });
}
function parseRespone(response) {

    var result = {};
    return new Promise(function (resolve, reject) {
        response.forEach(function (val, index) {
            if (val.types[0] !== undefined && val.types[1] !== undefined) {
                if (val.types[0] === 'locality' && val.types[1] == 'political') {
                    result.city=val.long_name;
                }
                if (val.types[0] === 'country' && val.types[1] == 'political') {
                    result.country=val.long_name;
                }
            }
            if (result.city !== undefined && result.country !== undefined) {
                resolve(result);
            }
        });
        reject('no suitbale results');
    });
}
