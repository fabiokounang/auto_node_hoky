const express = require('express');
const router = express.Router();
const emoneyUsercontroller = require('../controllers/emoneyuser');

const { body } = require('express-validator');
const checkAuth = require('../middleware/check-auth');
const { checkAdmin } = require('../middleware/check-user-type');

router.post('/', checkAuth, emoneyUsercontroller.getAllEmoneyUser);

router.post('/phones', [
  body('id_emoney')
    .notEmpty().withMessage('Emoney wajib dipilih')
], checkAuth, emoneyUsercontroller.getAllEmoneyAndPhone);

router.post('/create', checkAuth, checkAdmin, [
  body('id_emoney')
    .notEmpty().withMessage('Emoney wajib dipilih')
    .isNumeric().withMessage('Data tidak valid')
    .trim(),
  body('nomor_emoney')
    .notEmpty().withMessage('Nomor emoney wajib diisi')
    .isString().withMessage('Data tidak valid')
    .trim(),
  body('id_toko')
    .notEmpty().withMessage('Toko wajib dipilih')
    .isNumeric().withMessage('Data tidak valid')
    .trim()
], checkAuth, emoneyUsercontroller.createEmoneyUser);

router.post('/update/:id', checkAdmin, [
  body('nomor_emoney')
    .notEmpty().withMessage('Nomor emoney wajib diisi')
    .isString().withMessage('Data tidak valid')
    .trim(),
  body('id_toko')
    .notEmpty().withMessage('Toko wajib dipilih')
    .isNumeric().withMessage('Data tidak valid')
    .trim()
], checkAuth, emoneyUsercontroller.updateEmoneyUser);

router.post('/delete/:id', checkAdmin, [
  body('nomor_emoney')
    .notEmpty().withMessage('Nomor emoney wajib diisi')
    .isString().withMessage('Data tidak valid')
], emoneyUsercontroller.deleteEmoneyUser);

module.exports = router;