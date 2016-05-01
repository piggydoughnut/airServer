var express = require('express');
var router = express.Router();
var clientController = require('../controllers/client.controller');
var authController = require('../controllers/auth.controller');

router.get('/',  clientController.getClients);
router.post('/', clientController.postClients);

module.exports = router;
