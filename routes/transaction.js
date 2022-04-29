const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction');

router.post('/*', transactionController.filterTransaction);

module.exports = router;