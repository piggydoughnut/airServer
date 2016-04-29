function checkInput(req) {

    var lat = '';
    var lng = '';
    var desc = '';
    if (typeof req.body.loc != 'undefined' && typeof req.body.loc.coordinates != 'undefined') {
        lat = req.body.loc.coordinates[1];
        lng = req.body.loc.coordinates[0];
    }
    if (typeof req.body.text != 'undefined') {
        desc = req.body.text.substr(0, 150);
    }
    return {lat, lng, desc};
}

module.exports = {checkInput};
