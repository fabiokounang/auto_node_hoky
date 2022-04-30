const express = require('express');
const router = express.Router();
const emoneycontroller = require('../controllers/emoney');
const { body } = require('express-validator');

router.post('/', emoneycontroller.getAllEmoney);
router.post('/active', emoneycontroller.getAllEmoneyActive);
router.post('/create', [
  body('nama_emoney')
    .notEmpty().withMessage('Nama emoney wajib diisi')
    .isString().withMessage('Data tidak valid'),
  body('alias_emoney')
    .notEmpty().withMessage('Alias emoney wajib diisi')
    .isString().withMessage('Data tidak valid')
], emoneycontroller.createEmoney);

router.post('/update/:id', [
  body('nama_emoney')
    .notEmpty().withMessage('Nama emoney wajib diisi')
    .isString().withMessage('Data tidak valid'),
  body('alias_emoney')
    .notEmpty().withMessage('Alias emoney wajib diisi')
    .isString().withMessage('Data tidak valid'),
  body('status_emoney')
    .notEmpty().withMessage('Status emoney wajib diisi')
    .custom((value, { req }) => {
      if (value && ![1, 2].includes(value)) return false;
      return true;
    })
], emoneycontroller.updateEmoney);

module.exports = router;