const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction');
const checkAuth = require('../middleware/check-auth');

router.post('/*', checkAuth, transactionController.filterTransaction);

module.exports = router;