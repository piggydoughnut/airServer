import {querySetUp, createId} from "../util/queryHelper";
import {json400, json200} from "../util/requestHelper";
import {objectLength} from "../util/commonHelper";
import {processFile, checkFilePath, checkFileName} from "../util/fileHelper";

var express = require('express');
var router = express.Router();
var GalleryFile = require('../models/galleryFile');
var validator = require('validator');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


router.post('/form', multipartMiddleware, function (req, res) {
    var thumb_file_path = '';
    var user_id = null;

    if (objectLength(req.files) != 2) {
        console.log('no files to upload');
        return json400('no files to upload');
    }
    if (!req.files.hasOwnProperty('thumb') || !req.files.hasOwnProperty('object')) {
        return json400(res, 'incorrect files for upload');
    }
    if (typeof req.body.user_id != 'undefined' && validator.isAlphanumeric(req.body.user_id)) {
        user_id = req.body.user_id;
    }

    processFile(req.files.thumb)
        .then(function (path) {

            thumb_file_path = path;
            processFile(req.files.object)

                .then(function (path) {
                    var galleryFile = new GalleryFile({
                        filename: checkFileName(req.body.filename),
                        thumb_file_path: thumb_file_path,
                        obj_file_path: path,
                        uploaded_at: new Date(),
                        user_id: user_id
                    });
                    galleryFile.save(function (err) {
                        if (err) {
                            console.log(error);
                            return json400(res, err);
                        }
                        return json200(res, '');
                    });
                })
                .catch(error => {
                    console.log(error);
                    return json400(res, error);
                });
        })
        .catch(error => {
            console.log(error);
            return json400(res, error);
        });
});

router.get('/gallery', function (req, res) {
    try {
        var q = querySetUp(req);
    } catch (error) {
        console.log(error);
        return json400(res, error);
    }
    var query = {user_id: null};
    var options = {
        limit: q.limit,
        offset: q.offset
    };

    GalleryFile.paginate(query, options).then(function (result, err) {
        if (err) {
            console.log(err);
            json400(res, err);
            return;
        }
        return json200(res, result);
    });
});

router.post('/gallery/user', function (req, res) {
    console.log(req.body);
    var filename = Number.isFinite(req.body.filename) ? req.body.filename : validator.escape(req.body.filename);

    try {
        var user_id = createId(req.body.user_id);
    } catch (err) {
        return json400(res, err);
    }

    try {
        checkFilePath(req.body.obj_file_path);
        checkFilePath(req.body.thumb_file_path);

        var galleryFile = new GalleryFile({
            filename: filename,
            obj_file_path: req.body.obj_file_path,
            thumb_file_path: req.body.thumb_file_path,
            uploaded_at: new Date(),
            user_id: user_id
        });

        galleryFile.save(function (err) {
            if (err) {
                console.log(err);
                return json400(res, err);
            }
            return json200(res, 'Added to you gallery');
        });
    } catch (err) {
        if(err.code=='ENOENT'){
            return json400(res, 'Incorrect path');
        }
        return json400(res, err);
    }
});

module.exports = router;
