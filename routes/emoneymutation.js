const express = require('express');
const router = express.Router();
const emoneyMutationController = require('../controllers/emoneymutation');
const { body } = require('express-validator');

router.post('/ovo_emoney', emoneyMutationController.getMutationOvo);


module.exports = router;