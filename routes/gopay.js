const express = require('express');
const router = express.Router();
const gopayController = require('../controllers/gopay');
const { body } = require('express-validator');

router.post('/login', [
  body('phone')
    .notEmpty().withMessage('Nomor telepon wajib diisi')
], gopayController.login);

// router.post('/accesstoken', ovoMiddleware, gopayController.accesstoken);

// router.post('/confirmpin', ovoMiddleware, gopayController.confirmpin);

// router.post('/balance', ovoMiddleware, gopayController.balance);

// router.post('/mutation', ovoMiddleware, gopayController.mutation);

// router.post('/logout', ovoMiddleware, gopayController.logout);

module.exports = router;