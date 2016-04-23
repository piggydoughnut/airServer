function objectLength(object) {
    var length = 0;
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            ++length;
        }
    }
    return length;
}

var isEmptyObject = function (obj) {
    for (var property in obj)
        return false;
    return true;
};
module.exports = {objectLength, isEmptyObject};
