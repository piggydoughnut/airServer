var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var config = require('../config/config');
var GalleryFile = require('../models/galleryFile');
var validator = require('validator');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var appDir = process.env.PWD;

router.post('/', multipartMiddleware, function (req, res) {
    var thumb_file_path = '';

    processFile(req.files.thumb)
        .then(function (path) {

            thumb_file_path = path;
            processFile(req.files.object)

                .then(function (path) {
                    var galleryFile = new GalleryFile({
                        filename: checkFileName(req.body.filename),
                        thumb_file_path: thumb_file_path,
                        obj_file_path: path
                    });
                    galleryFile.save(function (err) {
                        if (err) {
                            return res.status(400).json(err);
                        }
                        return res.status(200).send();
                    });
                })
                .catch(error => {
                    return res.status(400).json(error);
                });
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

function processFile(file) {
    return new Promise(function (resolve, reject) {
        
        fs.readFile(file.path, function (err, data) {
            var filename = randomStr() + '.' + getFileExtension(file.originalFilename);
            var newPath = appDir + config.file_upload_folder + '/' + filename;
            fs.writeFile(newPath, data, function (err) {
                if (err) {
                    reject(err);
                }
                resolve(newPath);
            });
        });
    });
}

function checkFileName(filename) {
    if (filename != 'undefined' && validator.isAlphanumeric(filename)) {
        return filename;
    } else {
        return randomStr();
    }
}

function randomStr() {
    var m = 12;
    var s = '';
    var r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < m; i++) {
        s += r.charAt(Math.floor(Math.random() * r.length));
    }
    return s;
}

function getFileExtension(filename) {
    return filename.substring(filename.lastIndexOf(".") + 1);
}

module.exports = router;
