const express = require('express');
const ovoMiddleware = require('../middleware/ovo-middleware');
const router = express.Router();
const ovoController = require('../controllers/ovo');
const checkAuth = require('../middleware/check-auth');

router.post('/login', checkAuth, ovoMiddleware, ovoController.login);

router.post('/accesstoken', checkAuth, ovoMiddleware, ovoController.accesstoken);

router.post('/confirmpin', checkAuth, ovoMiddleware, ovoController.confirmpin);

router.post('/balance', checkAuth, ovoMiddleware, ovoController.balance);

router.post('/mutation', checkAuth, ovoMiddleware, ovoController.mutation);

router.post('/logout', checkAuth, ovoMiddleware, ovoController.logout);

module.exports = router;