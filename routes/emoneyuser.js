const express = require('express');
const router = express.Router();
const emoneyUsercontroller = require('../controllers/emoneyuser');
const { body } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

router.post('/', checkAuth, [
  body('id_toko')
    .notEmpty().withMessage('Toko required')
], emoneyUsercontroller.getAllEmoneyUser);

router.post('/phones', [
  body('id_emoney')
    .notEmpty().withMessage('Emoney wajib dipilih')
], checkAuth, emoneyUsercontroller.getAllEmoneyAndPhone);

router.post('/create', [
  body('id_emoney')
    .notEmpty().withMessage('Emoney wajib dipilih')
    .isNumeric().withMessage('Data tidak valid'),
  body('nomor_emoney')
    .notEmpty().withMessage('Nomor emoney wajib diisi')
    .isString().withMessage('Data tidak valid'),
  body('id_toko')
    .notEmpty().withMessage('Toko wajib dipilih')
    .isNumeric().withMessage('Data tidak valid')
], checkAuth, emoneyUsercontroller.createEmoneyUser);

router.post('/update/:id', [
  body('nomor_emoney')
    .notEmpty().withMessage('Nomor emoney wajib diisi')
    .isString().withMessage('Data tidak valid'),
  body('id_toko')
    .notEmpty().withMessage('Toko wajib dipilih')
    .isNumeric().withMessage('Data tidak valid')
], checkAuth, emoneyUsercontroller.updateEmoneyUser);

module.exports = router;