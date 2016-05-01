var express = require('express');
var router = express.Router();
var passport = require('passport');
var oauth2 = require('../controllers/oauth2.controller');
var auth = require('../controllers/auth.controller');


router.post('/token', oauth2.token);

module.exports = router;
