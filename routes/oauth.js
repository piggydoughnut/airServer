var express = require('express');
var router = express.Router();
var passport = require('passport');
var oauth2Controller = require('../controllers/oauth2.controller');


router.post('/token', oauth2Controller.token);

module.exports = router;
