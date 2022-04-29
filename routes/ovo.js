const express = require('express');
const ovoMiddleware = require('../middleware/ovo-middleware');
const router = express.Router();
const ovoController = require('../controllers/ovo');

router.post('/login', ovoMiddleware, ovoController.login);

router.post('/accesstoken', ovoMiddleware, ovoController.accesstoken);

router.post('/confirmpin', ovoMiddleware, ovoController.confirmpin);

router.post('/balance', ovoMiddleware, ovoController.balance);

router.post('/mutation', ovoMiddleware, ovoController.mutation);

router.post('/logout', ovoMiddleware, ovoController.logout);

module.exports = router;