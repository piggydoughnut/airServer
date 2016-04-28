import {querySetUp, createId} from "../util/queryHelper";
import {json400, json200} from "../util/requestHelper";
import {objectLength, isEmptyObject} from "../util/commonHelper";
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
        return json400(res, 'no files to upload');
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
                        return json200(res, {msg: 'Your obj was successfully uploaded.'});
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

router.get('/gallery/user/:id', function (req, res) {
    var id = validator.escape(req.params.id);

    try {
        var q = querySetUp(req);
    } catch (error) {
        console.log(error);
        return json400(res, error);
    }
    var query = {user_id: id};
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
    if (isEmptyObject(req.body)) {
        return json400(res, 'nothing to post');
    }
    var filename = Number.isFinite(req.body.filename) ? req.body.filename : validator.escape(req.body.filename);

    try {
        var user_id = createId(req.body.user_id);
    } catch (err) {
        return json400(res, err);
    }

    try {
        checkFilePath(req.body.obj_file_path);
        checkFilePath(req.body.thumb_file_path);

        GalleryFile.findOne({
            thumb_file_path: req.body.thumb_file_path,
            obj_file_path: req.body.obj_file_path,
            user_id: user_id
        }, function (err, docs) {
            if (err) {
                return json400(res, err);
            }
            if(docs) {
                return json200(res, {
                    msg: "This file is already in your gallery",
                    thumb_file_path: docs.thumb_file_path
                });
            }
            var galleryFile = new GalleryFile({
                filename: filename,
                obj_file_path: req.body.obj_file_path,
                thumb_file_path: req.body.thumb_file_path,
                uploaded_at: new Date(),
                user_id: user_id
            });
            galleryFile.save(function (err, doc) {
                if (err) {
                    console.log(err);
                    return json400(res, err);
                }
                var response = {
                    msg: 'Added to your gallery',
                    thumb_file_path: doc.thumb_file_path
                };
                return json200(res, response);
            });
        });

    } catch (err) {
        if (err.code == 'ENOENT') {
            return json400(res, 'Incorrect path');
        }
        return json400(res, err);
    }
});

module.exports = router;
