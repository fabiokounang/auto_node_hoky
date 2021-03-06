const express = require('express');
const router = express.Router();
const emoneyMutationController = require('../controllers/emoneymutation');
const checkAuth = require('../middleware/check-auth');

router.post('/ovo_emoney', checkAuth, emoneyMutationController.getMutationOvo);

module.exports = router;