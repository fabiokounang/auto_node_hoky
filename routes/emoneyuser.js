const express = require('express');
const router = express.Router();
const emoneyUsercontroller = require('../controllers/emoneyuser');
const { body } = require('express-validator');

router.post('/', emoneyUsercontroller.getAllEmoneyUser);
router.post('/phones', [
  body('id_emoney')
    .notEmpty().withMessage('Emoney wajib dipilih')
], emoneyUsercontroller.getAllEmoneyAndPhone);
router.post('/create', [
  body('id_emoney')
    .notEmpty().withMessage('Emoney wajib diisi')
    .isNumeric().withMessage('Data tidak valid'),
  body('nomor_emoney')
    .notEmpty().withMessage('Nomor emoney wajib diisi')
    .isString().withMessage('Data tidak valid')
], emoneyUsercontroller.createEmoneyUser);

router.post('/update/:id', [
  body('nomor_emoney')
    .notEmpty().withMessage('Nomor emoney wajib diisi')
    .isString().withMessage('Data tidak valid')
], emoneyUsercontroller.updateEmoneyUser);

module.exports = router;