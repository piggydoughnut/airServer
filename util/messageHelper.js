function checkInput(req) {

    var lat = '';
    var lng = '';
    var desc = '';

    if (typeof req.body.location != 'undefined') {
        lat = req.body.location.latitude;
        lng = req.body.location.longitude
    }
    if (typeof req.body.text != 'undefined') {
        desc = req.body.text.substr(0, 150);
    }
    return {lat, lng, desc};
}

module.exports = {checkInput};
