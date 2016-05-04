import {randomStr} from "./string.helper";

var config = require('../config/config');
var appDir = process.env.PWD;
var validator = require('validator');
var im = require('imagemagick');
var path = require('path');
var fs = require('fs');

function processFile(file) {
    return new Promise(function (resolve, reject) {
        
        if (typeof file == 'undefined' || !file.hasOwnProperty('path')) {
            reject('file not defined');
        }
        fs.readFile(file.path, function (err, data) {
            var filename = randomStr() + '.' + getFileExtension(file.originalFilename);
            var relPath = config.file_upload_folder + '/' + filename;
            var absPath = appDir + '/public/' + config.file_upload_folder + '/' + filename;
            if (file.type == 'image/png' || file.type == 'image/jpeg') {
                try {
                    resizeImage(absPath);
                } catch (err) {
                    throw err;
                }
            }

            fs.writeFile(absPath, data, function (err) {
                if (err) {
                    reject(err);
                }
                resolve(relPath);
            });
        });
    });
}

function getFileExtension(filename) {
    return filename.substring(filename.lastIndexOf(".") + 1);
}

function resizeImage(absPath) {

    im.resize({
        srcPath: absPath,
        dstPath: absPath,
        width: 256
    }, function (err, stdout, stderr) {
        if (err) {
            throw err;
        }
    });
}

function checkFilePath(filepath) {
    if (Number.isFinite(filepath)) {
        throw 'Incorrect file path ' + filepath;
    }
    
    var fileExists = fs.lstatSync(appDir + config.public_folder + filepath, function (err) {
        if (err) {
            return false;
        }
    });
    if(!fileExists){
        throw 'Incorrect file path ' + filepath;
    }
}

function checkFileName(filename) {
    if (typeof filename != 'undefined') {
        validator.escape(filename);
        return filename;
    } else {
        return randomStr();
    }
}

module.exports = {processFile, getFileExtension, resizeImage, checkFilePath, checkFileName};
