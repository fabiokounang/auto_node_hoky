const express = require('express');
const router = express.Router();
const emoneycontroller = require('../controllers/emoney');

router.post('/', emoneycontroller.getAllEmoney);
router.post('/create', emoneycontroller.createEmoney);

module.exports = router;